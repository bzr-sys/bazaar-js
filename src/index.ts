import ClientOAuth2 from "client-oauth2";
import jwt_decode from "jwt-decode";
import io from "socket.io-client";

import { Options, IdTokenDecoded, Permission } from "./types";
import { generateRandomString, pkceChallengeFromVerifier } from "./utils";

// Config
const signUpBaseUri: string = "http://localhost:3000/sign-up";
const tokenUri: string = "http://localhost:4444/oauth2/token";
const authUri: string = "http://localhost:4444/oauth2/auth";
const socketioUri: string = "http://localhost:4000";

// Private vars set in the constructor

/**
 * The URI to redirect to after a successful sign up
 */
let signUpRedirectUri = "";

/**
 * Local storage key names, namespaced in the constructor
 */
let tokenKeyName = "";
let idTokenKeyName = "";
let pkceStateKeyName = "";
let pkceCodeVerifierKeyName = "";

let oAuthClient = null;

let socket = null;

/**
 * A callback function an app can specify in the constructor to run when
 * a user has successfully logged in.
 *
 * e.g. Set state, redirect, etc.
 */
let onLogInComplete: () => void = null;

/**
 * An app's base URL
 * Used to check against the origin of a postMessage event sent from the log in pop-up window.
 * e.g. https://example-app.com
 */
let baseUrl = "";

// End constructor vars

/**
 * A reference to the window object of the log in pop-up window.
 * Used in {@link RethinkID.openLogInWindow}
 */
let logInWindowReference = null;

/**
 * A reference to the previous URL of the sign up pop-up window.
 * Used to avoid creating duplicate windows and for focusing an existing window.
 * Used in {@link RethinkID.openLogInWindow}
 */
let logInWindowPreviousUrl = null;

/**
 * The primary class of the RethinkID JS SDK to help you more easily build web apps with RethinkID.
 *
 * @example
 * ```
 * import { RethinkID } from "@mostlytyped/rethinkid-js-sdk";
 *
 * const config = {
 *   appId: "3343f20f-dd9c-482c-9f6f-8f6e6074bb81",
 *   signUpRedirectUri: "https://example.com/sign-in",
 *   logInRedirectUri: "https://example.com/callback",
 *   onLogInComplete: () => {
 *     // do something when the user logs in
 *   },
 * };
 *
 * export const rid = new RethinkID(config);
 * ```
 */
export class RethinkID {
  constructor(options: Options) {
    signUpRedirectUri = options.signUpRedirectUri;

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
      redirectUri: options.logInRedirectUri,
      accessTokenUri: tokenUri,
      authorizationUri: authUri,
      scopes: ["openid", "profile", "email"],
    });

    this._socketConnect();

    /**
     * Set the app's custom "after log in" callback
     */
    onLogInComplete = options.onLogInComplete;

    /**
     * Get the base URL from the log in redirect URI already supplied,
     * to save a developer from having to add another options property
     */
    baseUrl = new URL(options.logInRedirectUri).origin;
  }

  /**
   * Creates a SocketIO connection with an auth token
   */
  private _socketConnect(): void {
    const token = localStorage.getItem(tokenKeyName);

    if (!token) {
      return;
    }

    socket = io(socketioUri, {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("sdk: connected. socket.id:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("sdk connect err.message", err.message);
      if (err.message.includes("Unauthorized")) {
        console.log("Unauthorized!");
      }
    });
  }

  /**
   * Generate a URI to sign up a user, creating a RethinkID account
   */
  signUpUri(): string {
    const params = new URLSearchParams();
    params.append("redirect_uri", signUpRedirectUri);
    return `${signUpBaseUri}?${params.toString()}`;
  }

  /**
   * Generate a URI to log in a user to RethinkID and authorize an app.
   * Uses the Authorization Code Flow for single page apps with PKCE code verification.
   * Requests an authorization code.
   *
   * Used by the {@link openLogInWindow} method as the URI to open.
   *
   * Use {@link completeLogIn} to exchange the authorization code for an access token and ID token
   * at the `logInRedirectUri` URI specified when creating a RethinkID instance.
   */
  private async _logInUri(): Promise<string> {
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
   * Opens a pop-up window to perform OAuth log in.
   * e.g. attach to "Log in" button click.
   */
  async openLogInWindow(): Promise<void> {
    const url = await this._logInUri();
    const name = "rethinkid-log-in-window";

    // remove any existing event listeners
    window.removeEventListener("message", this._receiveLogInWindowMessage);

    // window features
    const strWindowFeatures = "toolbar=no, menubar=no, width=600, height=700, top=100, left=100";

    if (logInWindowReference === null || logInWindowReference.closed) {
      /**
       * if the pointer to the window object in memory does not exist or if such pointer exists but the window was closed
       * */
      logInWindowReference = window.open(url, name, strWindowFeatures);
    } else if (logInWindowPreviousUrl !== url) {
      /**
       * if the resource to load is different, then we load it in the already opened secondary
       * window and then we bring such window back on top/in front of its parent window.
       */
      logInWindowReference = window.open(url, name, strWindowFeatures);
      logInWindowReference.focus();
    } else {
      /**
       * else the window reference must exist and the window is not closed; therefore,
       * we can bring it back on top of any other window with the focus() method.
       * There would be no need to re-create the window or to reload the referenced resource.
       */
      logInWindowReference.focus();
    }

    // add the listener for receiving a message from the pop-up
    window.addEventListener("message", (event) => this._receiveLogInWindowMessage(event), false);
    // assign the previous URL
    logInWindowPreviousUrl = url;
  }

  /**
   * Completes the log in flow, sends a message to the opener window, and
   * closes the pop-up window.
   * Runs in the log in pop-up window at the login redirect URI, options.logInRedirectUri.
   */
  async completeLogIn(): Promise<void> {
    // get the URL parameters which will include the auth code
    const params = window.location.search;
    if (window.opener) {
      try {
        await this._getAndSetTokens(params);
      } catch (e) {
        console.log("complete login error", e.message);
      }
      // send them to the opening window
      window.opener.postMessage(params);
      // close the pop-up
      window.close();
    }
  }

  /**
   * A "message" event listener for the log in pop-up window.
   * Handles messages sent from the log in pop-up window to its opener window.
   * @param event A postMessage event object
   */
  private _receiveLogInWindowMessage(event): void {
    // Do we trust the sender of this message? (might be
    // different from what we originally opened, for example).
    if (event.origin !== baseUrl) {
      return;
    }

    // if we trust the sender and the source is our pop-up
    if (event.source === logInWindowReference) {
      // Make a socket connection now that we have an access token and are back in the main window
      this._socketConnect();

      // Run the app's post log in callback
      onLogInComplete();
    }
  }

  /**
   * Takes an authorization code and exchanges it for an access token and ID token.
   * Used in {@link completeLogIn}.
   * An authorization code is received as a URL param after a successfully calling {@link openLogInWindow}
   * and approving the log in request.
   *
   * Expects `code` and `state` query params to be present in the URL. Or else an `error` query
   * param if something went wrong.
   *
   * Stores the access token and ID token in local storage.
   */
  private async _getAndSetTokens(paramsStr: string): Promise<void> {
    const params = new URLSearchParams(paramsStr);

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

    // Verify state matches what we set at the beginning
    if (localStorage.getItem(pkceStateKeyName) !== params.get("state")) {
      throw new Error(`State did not match. Possible CSRF attack`);
    }

    let getTokenResponse;
    try {
      getTokenResponse = await oAuthClient.code.getToken(window.location.href, {
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
          email: idTokenDecoded.email || "", // emailVerified is redundant because log in requires verification
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
   * Makes sure a socket has connected.
   */
  private _waitForConnection: () => Promise<true> = () => {
    return new Promise((resolve, reject) => {
      if (socket.connected) {
        resolve(true);
      } else {
        socket.on("connect", () => {
          resolve(true);
        });
        // Don't wait for connection indefinitely
        setTimeout(() => {
          reject(new Error("Timeout waiting for on connect"));
        }, 1000);
      }
    });
  };

  /**
   * Promisifies a socket.io emit event
   * @param event A socket.io event name, like `tables:create`
   * @param payload
   */
  private _asyncEmit = async (event: string, payload: any) => {
    await this._waitForConnection();
    return new Promise((resolve, reject) => {
      socket.emit(event, payload, (response: any) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  };

  /**
   * Creates a table
   */
  async tablesCreate(tableName: string) {
    return this._asyncEmit("tables:create", { tableName }) as Promise<{ message: string }>;
  }

  /**
   * Drops, or deletes, a table
   */
  async tablesDrop(tableName: string) {
    return this._asyncEmit("tables:drop", { tableName }) as Promise<{ message: string }>;
  }

  /**
   * Lists all table names
   */
  async tablesList() {
    return this._asyncEmit("tables:list", null) as Promise<{ data: object }>;
  }

  /**
   * Gets permissions for a user.
   * @param options An optional object for specifying which permissions to get.
   * @returns All permissions are returned if no options are passed.
   */
  async permissionsGet(
    options: {
      tableName?: string;
      userId?: string;
      type?: "read" | "insert" | "update" | "delete";
    } = {},
  ) {
    return this._asyncEmit("permissions:get", options) as Promise<{ data: Permission[] }>;
  }

  /**
   * Sets permissions for a user
   */
  async permissionsSet(permissions: Permission[]) {
    return this._asyncEmit("permissions:set", permissions) as Promise<{ message: string }>;
  }

  /**
   * Deletes permissions for a user.
   * @param options An optional object for specifying a permission ID to delete. All permissions are deleted if no permission ID option is passed.
   */
  async permissionsDelete(options: { permissionId?: string } = {}) {
    return this._asyncEmit("permissions:delete", options) as Promise<{ message: string }>;
  }

  /**
   * Get data from a table.
   * @param options An optional object for specifying a row ID and/or user ID.
   * @returns Specify a row ID to get a specific row, otherwise all rows are returned. Specify a user ID to operate on a table owned by that user ID. Otherwise operates on a table owned by the authenticated user.
   */
  async tableRead(tableName: string, options: { rowId?: string; userId?: string } = {}): Promise<{ data: object }> {
    const payload = { tableName };
    Object.assign(payload, options);

    return this._asyncEmit("table:read", payload) as Promise<{ data: object }>;
  }

  /**
   * Subscribe to table changes.
   * @param tableName
   * @param options An optional object for specifying a user ID. Specify a user ID to operate on a table owned by that user ID. Otherwise operates on a table owned by the authenticated user.
   */
  async tableSubscribe(tableName: string, options: { userId?: string } = {}) {
    const payload = { tableName };
    Object.assign(payload, options);

    const response = (await this._asyncEmit("table:subscribe", payload)) as { data: string }; // data: subscription handle
    const subscriptionHandle = response.data;

    return {
      do: async (listener: (changes: { new_val: object; old_val: object }) => void) => {
        socket.on(subscriptionHandle, listener);
      },
      unsubscribe: async () => {
        return this._asyncEmit("table:unsubscribe", subscriptionHandle) as Promise<{ message: string }>;
      },
    };
  }

  /**
   * Inserts a row into a table
   * @param tableName The name of the table to operate on.
   * @param row The row to insert.
   * @param options An optional object for specifying a user ID. Specify a user ID to operate on a table owned by that user ID. Otherwise operates on a table owned by the authenticated user.
   */
  async tableInsert(tableName: string, row: object, options: { userId?: string } = {}) {
    const payload = { tableName, row };
    Object.assign(payload, options);

    return this._asyncEmit("table:insert", payload) as Promise<{ message: string }>;
  }

  /**
   * Updates a row in a table
   * @param tableName The name of the table to operate on.
   * @param row Must contain a row ID.
   * @param options An optional object for specifying a user ID. Specify a user ID to operate on a table owned by that user ID. Otherwise operates on a table owned by the authenticated user.
   */
  async tableUpdate(tableName: string, row: object, options: { userId?: string } = {}) {
    const payload = { tableName, row };
    Object.assign(payload, options);

    return this._asyncEmit("table:update", payload) as Promise<{ message: string }>;
  }

  /**
   * Replaces a row in a table
   * @param tableName The name of the table to operate on.
   * @param row Must contain a row ID.
   * @param options An optional object for specifying a user ID. Specify a user ID to operate on a table owned by that user ID. Otherwise operates on a table owned by the authenticated user.
   */
  async tableReplace(tableName: string, row: object, options: { userId?: string } = {}) {
    const payload = { tableName, row };
    Object.assign(payload, options);

    return this._asyncEmit("table:replace", payload) as Promise<{ message: string }>;
  }

  /**
   * Deletes from a table
   * @param tableName The name of the table to operate on.
   * @param options An optional object for specifying a row ID and/or user ID. Specify a row ID to delete a specific row, otherwise all rows are deleted. Specify a user ID to operate on a table owned by that user ID. Otherwise operates on a table owned by the authenticated user.
   */
  async tableDelete(tableName: string, options: { rowId?: string; userId?: string } = {}) {
    const payload = { tableName };
    Object.assign(payload, options);

    return this._asyncEmit("table:delete", payload) as Promise<{ message: string }>;
  }
}
