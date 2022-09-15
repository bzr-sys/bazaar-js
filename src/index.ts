import ClientOAuth2 from "client-oauth2";
import jwt_decode from "jwt-decode";
import io from "socket.io-client";

import { Table } from "./table";
import { Options, IdTokenDecoded, Permission, SubscribeListener, MessageOrError, LoginType } from "./types";
import { generateRandomString, pkceChallengeFromVerifier, popupWindow } from "./utils";

/**
 * The URI of the current RethinkID deployment
 */
const rethinkIdUri = "https://id.rethinkdb.cloud";

// Private vars set in the constructor

/**
 * URI for the Data API, RethinkID's realtime data storage service.
 * Currently implemented with Socket.IO + RethinkDB
 *
 * In local development requires a port value and is different than {@link oAuthUri }
 */
let dataApiUri = rethinkIdUri;

/**
 * Public URI for the OAuth authorization server.
 * Currently implemented with Hydra
 *
 * In local development requires a port value and is different than {@link dataApiUri }
 */
let oAuthUri = rethinkIdUri;

/**
 * URI to start an OAuth login request
 */
let authUri = "";

/**
 * URI to complete an OAuth login request, exchanging a auth code for an access token and ID token
 */
let tokenUri = "";

/**
 * A callback to do something when a Data API connection error occurs
 */
let dataAPIConnectErrorCallback = (errorMessage: string) => {
  console.error("Connection error:", errorMessage);
};

/**
 * Local storage key names, namespaced in the constructor
 */
let tokenKeyName = "";
let idTokenKeyName = "";
let pkceStateKeyName = "";
let pkceCodeVerifierKeyName = "";

let oAuthClient = null;

/**
 * A Socket.IO connection to the Data API
 */
let dataApi = null;

/**
 * An app's base URL
 * Used to check against the origin of a postMessage event sent from the login pop-up window.
 * e.g. https://example-app.com
 */
let baseUrl = "";

// End constructor vars

/**
 * A reference to the window object of the login pop-up window.
 * Used in {@link RethinkID.openLoginPopup}
 */
let loginWindowReference = null;

/**
 * A reference to the previous URL of the login pop-up window.
 * Used to avoid creating duplicate windows and for focusing an existing window.
 * Used in {@link RethinkID.openLoginPopup}
 */
let loginWindowPreviousUrl = null;

/**
 * The primary class of the RethinkID JS SDK to help you more easily build web apps with RethinkID.
 */
export default class RethinkID {
  constructor(options: Options) {
    if (options.dataApiUri) {
      dataApiUri = options.dataApiUri;
    }
    if (options.oAuthUri) {
      oAuthUri = options.oAuthUri;
    }

    authUri = `${oAuthUri}/oauth2/auth`;
    tokenUri = `${oAuthUri}/oauth2/token`;

    if (options.dataAPIConnectErrorCallback) {
      dataAPIConnectErrorCallback = options.dataAPIConnectErrorCallback;
    }

    if (options.onLogin) {
      this.onLogin = options.onLogin;
    }

    /**
     * Namespace local storage key names
     */
    const namespace = `rethinkid_${options.appId}`;
    tokenKeyName = `${namespace}_token`;
    idTokenKeyName = `${namespace}_id_token`;
    pkceStateKeyName = `${namespace}_pkce_state`;
    pkceCodeVerifierKeyName = `${namespace}_pkce_code_verifier`;

    oAuthClient = new ClientOAuth2({
      clientId: options.appId,
      redirectUri: options.loginRedirectUri,
      accessTokenUri: tokenUri,
      authorizationUri: authUri,
      scopes: ["openid", "profile", "email"],
    });

    /**
     * Get the base URL from the log in redirect URI already supplied,
     * to save a developer from having to add another options property
     */
    baseUrl = new URL(options.loginRedirectUri).origin;

    // Make a connection to the Data API if logged in
    this._dataApiConnect();

    this._checkLoginQueryParams();
  }

  /**
   * A callback function an app can specify to run when a user has successfully logged in.
   *
   * e.g. Set state, redirect, etc.
   */
  onLogin = () => {};

  /**
   * Creates a Data API connection with an auth token
   */
  private _dataApiConnect(): void {
    const token = localStorage.getItem(tokenKeyName);

    if (!token) {
      return;
    }

    dataApi = io(dataApiUri, {
      auth: { token },
    });

    dataApi.on("connect", () => {
      console.log("sdk: connected. dataApi.id:", dataApi.id);
    });

    dataApi.on("connect_error", (error) => {
      let errorMessage = error.message;

      if (error.message.includes("Unauthorized")) {
        errorMessage = "Unauthorized";
      } else if (error.message.includes("TokenExpiredError")) {
        errorMessage = "Token expired";
      }

      // Set `this` context so the RethinkID instance can be accessed a in the callback
      // e.g. calling `this.logOut()` might be useful.
      dataAPIConnectErrorCallback.call(this, errorMessage);
    });
  }

  /**
   * Generate a URI to log in a user to RethinkID and authorize an app.
   * Uses the Authorization Code Flow for single page apps with PKCE code verification.
   * Requests an authorization code.
   */
  async loginUri(): Promise<string> {
    // if logging in, do not overwrite existing PKCE local storage values.
    if (this.hasLoginQueryParams()) {
      return "";
    }

    // Create and store a random "state" value
    const state = generateRandomString();
    localStorage.setItem(pkceStateKeyName, state);

    // Create and store a new PKCE code_verifier (the plaintext random secret)
    const codeVerifier = generateRandomString();
    localStorage.setItem(pkceCodeVerifierKeyName, codeVerifier);

    // Hash and base64-urlencode the secret to use as the challenge
    const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);

    return oAuthClient.code.getUri({
      state: state,
      query: {
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
      },
    });
  }

  /**
   * Opens a pop-up window to perform OAuth login.
   * Will fallback to redirect login if pop-up fails to open, provided options type is not `popup` (meaning an app has explicitly opted out of fallback redirect login)
   */
  async login(options?: { type?: LoginType }): Promise<void> {
    const loginType = options?.type || "popup_fallback";

    const url = await this.loginUri();

    // App explicitly requested redirect login, so redirect
    if (loginType === "redirect") {
      window.location.href = url;
      return;
    }

    const windowName = "rethinkid-login-window";

    // remove any existing event listeners
    window.removeEventListener("message", this._receiveLoginWindowMessage);

    if (loginWindowReference === null || loginWindowReference.closed) {
      /**
       * if the pointer to the window object in memory does not exist or if such pointer exists but the window was closed
       * */
      loginWindowReference = popupWindow(url, windowName, window);
    } else if (loginWindowPreviousUrl !== url) {
      /**
       * if the resource to load is different, then we load it in the already opened secondary
       * window and then we bring such window back on top/in front of its parent window.
       */
      loginWindowReference = popupWindow(url, windowName, window);
      loginWindowReference.focus();
    } else {
      /**
       * else the window reference must exist and the window is not closed; therefore,
       * we can bring it back on top of any other window with the focus() method.
       * There would be no need to re-create the window or to reload the referenced resource.
       */
      loginWindowReference.focus();
    }

    // Pop-up possibly blocked
    if (!loginWindowReference) {
      if (loginType === "popup") {
        // app explicitly does not want to fallback to redirect
        throw new Error("Pop-up failed to open");
      } else {
        // fallback to redirect login
        window.location.href = url;
        return;
      }
    }

    // add the listener for receiving a message from the pop-up
    window.addEventListener("message", (event) => this._receiveLoginWindowMessage(event), false);
    // assign the previous URL
    loginWindowPreviousUrl = url;
  }

  /**
   * A "message" event listener for the login pop-up window.
   * Handles messages sent from the login pop-up window to its opener window.
   * @param event A postMessage event object
   */
  private _receiveLoginWindowMessage(event): void {
    // Make sure to check origin and source to mitigate XSS attacks

    // Do we trust the sender of this message? (might be
    // different from what we originally opened, for example).
    if (event.origin !== baseUrl) {
      return;
    }

    // if we trust the sender and the source is our pop-up
    if (event.source === loginWindowReference) {
      this._completeLogin(event.data);
    }
  }

  /**
   * Continues the login flow after redirected back from the OAuth server, handling pop-up or redirect login types.
   *
   * Must be called at the {@link Options.loginRedirectUri} URI.
   *
   * @returns string to indicate login type
   */
  private async _checkLoginQueryParams(): Promise<string> {
    // Only attempt to complete login if actually logging in.
    if (!this.hasLoginQueryParams()) return;

    /**
     * If completing redirect login
     */
    if (!window.opener) {
      await this._completeLogin(location.search);
      return "redirect";
    }

    /**
     * If completing pop-up login
     */
    // Send message to parent/opener window with login query params
    // Specify `baseUrl` targetOrigin for security
    window.opener.postMessage(location.search, baseUrl); // handled by _receiveLoginWindowMessage

    // Close the pop-up, and return focus to the parent window where the `postMessage` we just sent above is received.
    window.close();

    // Send message in case window fails to close,
    // e.g. On Brave iOS the tab does not seem to close,
    // so at least an app has some way of gracefully handling this case.
    return "popup";
  }

  /**
   * Complete a login request
   *
   * Takes an authorization code and exchanges it for an access token and ID token.
   *
   * Expects `code` and `state` query params to be present in the URL. Or else an `error` query
   * param if something went wrong.
   *
   * Stores the access token and ID token in local storage.
   *
   * Performs after login actions.
   */
  private async _completeLogin(loginQueryParams: string): Promise<void> {
    const params = new URLSearchParams(loginQueryParams);

    // Check if the auth server returned an error string
    const error = params.get("error");
    if (error) {
      throw new Error(`An error occurred: ${error}`);
    }

    // Make sure the auth server returned a code
    const code = params.get("code");
    if (!code) {
      throw new Error(`No query param code`);
    }

    // Verify state matches the value set when the login request was initiated to mitigate CSRF attacks
    if (localStorage.getItem(pkceStateKeyName) !== params.get("state")) {
      throw new Error(`State did not match. Possible CSRF attack`);
    }

    // Exchange auth code for access and ID tokens
    let getTokenResponse;
    const uri = `${location.origin}${loginQueryParams}`;
    try {
      getTokenResponse = await oAuthClient.code.getToken(uri, {
        body: {
          code_verifier: localStorage.getItem(pkceCodeVerifierKeyName) || "",
        },
      });
    } catch (error) {
      throw new Error(`Error getting token: ${error.message}`);
    }

    if (!getTokenResponse) {
      throw new Error(`No token response`);
    }

    // Clean these up since we don't need them anymore
    localStorage.removeItem(pkceStateKeyName);
    localStorage.removeItem(pkceCodeVerifierKeyName);

    // Store tokens in local storage
    const token: string = getTokenResponse.data.access_token;
    const idToken: string = getTokenResponse.data.id_token;

    localStorage.setItem(tokenKeyName, token);
    localStorage.setItem(idTokenKeyName, idToken);

    /**
     * Do after login actions
     */
    // Connect to the Data API
    this._dataApiConnect();

    // Run the user defined post login callback
    this.onLogin.call(this);
  }

  /**
   * A utility function to check if the user is logged in.
   * i.e. if an access token and ID token are in local storage.
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem(tokenKeyName);
    const idToken = localStorage.getItem(idTokenKeyName);

    if (token && idToken) {
      try {
        jwt_decode(idToken);

        return true;
      } catch (error) {
        // Error decoding ID token, assume tokens are invalid and remove
        localStorage.removeItem(tokenKeyName);
        localStorage.removeItem(idTokenKeyName);
      }
    }

    return false;
  }

  /**
   * A utility function to check if a redirect to complete a login request has been performed.
   *
   * Also used in {@link loginUri} to make sure PKCE local storage values are not overwritten,
   * which would otherwise accidentally invalidate a login request.
   */
  hasLoginQueryParams(): boolean {
    const params = new URLSearchParams(location.search);

    // These query params will be present when redirected
    // back from the RethinkID auth server
    return !!(params.get("code") && params.get("scope") && params.get("state"));
  }

  /**
   * A utility function to log a user out.
   * Deletes the access token and ID token from local storage and reloads the page.
   */
  logOut(): void {
    if (localStorage.getItem(tokenKeyName) || localStorage.getItem(idTokenKeyName)) {
      localStorage.removeItem(tokenKeyName);
      localStorage.removeItem(idTokenKeyName);
      location.reload();
    }
  }

  /**
   * A utility function to get user info, i.e. user ID and the scope-based claims of an
   * authenticated user's ID token.
   */
  userInfo(): null | { id: string; email: string; name: string } {
    const idToken = localStorage.getItem(idTokenKeyName);

    if (idToken) {
      try {
        const idTokenDecoded: IdTokenDecoded = jwt_decode(idToken);

        return {
          id: idTokenDecoded.sub || "",
          email: idTokenDecoded.email || "", // emailVerified is redundant because login requires verification
          name: idTokenDecoded.name || "",
        };
      } catch (error) {
        // Error decoding ID token, assume token is invalid and remove
        localStorage.removeItem(idTokenKeyName);
      }
    }

    return null;
  }

  // Data API

  /**
   * Make sure a connection to the Data API has been made.
   */
  private _waitForConnection: () => Promise<true> = () => {
    return new Promise((resolve, reject) => {
      if (dataApi.connected) {
        resolve(true);
      } else {
        dataApi.on("connect", () => {
          resolve(true);
        });
        // Don't wait for connection indefinitely
        setTimeout(() => {
          reject(new Error("Timeout waiting for on connect"));
        }, 3000);
      }
    });
  };

  /**
   * Promisifies a dataApi.io emit event
   * @param event A dataApi.io event name, like `tables:create`
   * @param payload
   */
  private _asyncEmit = async (event: string, payload: any) => {
    await this._waitForConnection();
    return new Promise((resolve, reject) => {
      dataApi.emit(event, payload, (response: any) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  };

  /**
   * Create a table. Private endpoint.
   */
  async tablesCreate(tableName: string) {
    return this._asyncEmit("tables:create", { tableName }) as Promise<MessageOrError>;
  }

  /**
   * Drop a table. Private endpoint.
   */
  async tablesDrop(tableName: string) {
    return this._asyncEmit("tables:drop", { tableName }) as Promise<MessageOrError>;
  }

  /**
   * List all table names. Private endpoint.
   * @returns Where `data` is an array of table names
   */
  async tablesList() {
    return this._asyncEmit("tables:list", null) as Promise<{ data: string[]; error?: string }>;
  }

  /**
   * Get permissions for a table. Private endpoint.
   * @param options If no optional params are set, all permissions for the user are returned.
   * @returns All permissions are returned if no options are passed.
   */
  async permissionsGet(
    options: {
      tableName?: string;
      userId?: string;
      type?: "read" | "insert" | "update" | "delete";
    } = {},
  ) {
    return this._asyncEmit("permissions:get", options) as Promise<{ data?: Permission[]; error?: string }>;
  }

  /**
   * Set (insert/update) permissions for a table. Private endpoint.
   */
  async permissionsSet(permissions: Permission[]) {
    return this._asyncEmit("permissions:set", permissions) as Promise<MessageOrError>;
  }

  /**
   * Delete permissions for a table. Private endpoint.
   * @param options An optional object for specifying a permission ID to delete. All permissions are deleted if no permission ID option is passed.
   */
  async permissionsDelete(options: { permissionId?: string } = {}) {
    return this._asyncEmit("permissions:delete", options) as Promise<MessageOrError>;
  }

  /**
   * Read all table rows, or a single row if row ID passed. Private by default, or public with read permission.
   * @param options An optional object for specifying a row ID and/or user ID.
   * @returns Specify a row ID to get a specific row, otherwise all rows are returned. Specify a user ID to operate on a table owned by that user ID. Otherwise operates on a table owned by the authenticated user.
   */
  async tableRead(tableName: string, options: { rowId?: string; userId?: string } = {}) {
    const payload = { tableName };
    Object.assign(payload, options);

    return this._asyncEmit("table:read", payload) as Promise<{ data?: any[] | object; error?: string }>;
  }

  /**
   * Subscribe to table changes. Private by default, or public with read permission.
   * @param tableName
   * @param options An object for specifying a user ID. Specify a user ID to operate on a table owned by that user ID. Otherwise passing `{}` operates on a table owned by the authenticated user.
   * @returns An unsubscribe function
   */
  async tableSubscribe(tableName: string, options: { rowId?: string; userId?: string }, listener: SubscribeListener) {
    const payload = { tableName };
    Object.assign(payload, options);

    const response = (await this._asyncEmit("table:subscribe", payload)) as { data?: string; error?: string }; // where data is the subscription handle
    const subscriptionHandle = response.data;

    dataApi.on(subscriptionHandle, listener);

    return async () => {
      dataApi.off(subscriptionHandle, listener);
      return this._asyncEmit("table:unsubscribe", subscriptionHandle) as Promise<MessageOrError>;
    };
  }

  /**
   * Insert a table row, lazily creates the table if it does not exist. Private by default, or public with insert permission
   * @param tableName The name of the table to operate on.
   * @param row The row to insert.
   * @param options An optional object for specifying a user ID. Specify a user ID to operate on a table owned by that user ID. Otherwise operates on a table owned by the authenticated user.
   * @returns Where `data` is the row ID
   */
  async tableInsert(tableName: string, row: object, options: { userId?: string } = {}) {
    const payload = { tableName, row };
    Object.assign(payload, options);

    return this._asyncEmit("table:insert", payload) as Promise<{ data?: string; error?: string }>;
  }

  /**
   * Update all table rows, or a single row if row ID exists. Private by default, or public with update permission
   * @param tableName The name of the table to operate on.
   * @param row Note! If row.id not present, updates all rows
   * @param options An optional object for specifying a user ID. Specify a user ID to operate on a table owned by that user ID. Otherwise operates on a table owned by the authenticated user.
   */
  async tableUpdate(tableName: string, row: object, options: { userId?: string } = {}) {
    const payload = { tableName, row };
    Object.assign(payload, options);

    return this._asyncEmit("table:update", payload) as Promise<MessageOrError>;
  }

  /**
   * Replace a table row. Private by default, or public with insert, update, delete permissions.
   * @param tableName The name of the table to operate on.
   * @param row Must contain a row ID.
   * @param options An optional object for specifying a user ID. Specify a user ID to operate on a table owned by that user ID. Otherwise operates on a table owned by the authenticated user.
   */
  async tableReplace(tableName: string, row: object, options: { userId?: string } = {}) {
    const payload = { tableName, row };
    Object.assign(payload, options);

    return this._asyncEmit("table:replace", payload) as Promise<MessageOrError>;
  }

  /**
   * Deletes all table rows, or a single row if row ID passed. Private by default, or public with delete permission.
   * @param tableName The name of the table to operate on.
   * @param options An optional object for specifying a row ID and/or user ID. Specify a row ID to delete a specific row, otherwise all rows are deleted. Specify a user ID to operate on a table owned by that user ID. Otherwise operates on a table owned by the authenticated user.
   */
  async tableDelete(tableName: string, options: { rowId?: string; userId?: string } = {}) {
    const payload = { tableName };
    Object.assign(payload, options);

    return this._asyncEmit("table:delete", payload) as Promise<MessageOrError>;
  }

  table(tableName: string, tableOptions: { userId?: string }) {
    return new Table(this, tableName, tableOptions);
  }
}
