import ClientOAuth2 from "client-oauth2";
import jwt_decode from "jwt-decode";
import io from "socket.io-client";

import { Table } from "./table";
import { Options, IdTokenDecoded, Permission, SubscribeListener } from "./types";
import { generateRandomString, pkceChallengeFromVerifier } from "./utils";

// Private vars set in the constructor
let signUpBaseUri = "";
let tokenUri = "";
let authUri = "";
let socketioUri = "";
let rethinkIdBaseUri = "https://id.rethinkdb.cloud";
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

let socket = null;

// End constructor vars

/**
 * The primary class of the RethinkID JS SDK to help you more easily build web apps with RethinkID.
 *
 * @example
 * ```
 * import RethinkID from "@mostlytyped/rethinkid-js-sdk";
 *
 * const config = {
 *   appId: "3343f20f-dd9c-482c-9f6f-8f6e6074bb81",
 *   loginRedirectUri: "https://example.com/complete-login",
 * };
 *
 * export const rid = new RethinkID(config);
 * ```
 */
export default class RethinkID {
  constructor(options: Options) {
    signUpBaseUri = `${rethinkIdBaseUri}/sign-up`;
    tokenUri = `${rethinkIdBaseUri}/oauth2/token`;
    authUri = `${rethinkIdBaseUri}/oauth2/auth`;
    socketioUri = rethinkIdBaseUri;

    if (options.rethinkIdBaseUri) {
      rethinkIdBaseUri = options.rethinkIdBaseUri;
    }

    if (options.dataAPIConnectErrorCallback) {
      dataAPIConnectErrorCallback = options.dataAPIConnectErrorCallback;
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

    this._socketConnect();
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

    socket.on("connect_error", (error) => {
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
   *
   * Use {@link completeLogin} to exchange the authorization code for an access token and ID token
   * at the {@link Options.loginRedirectUri} URI specified when creating a RethinkID instance.
   */
  async loginUri(): Promise<string> {
    // if logging in, do not overwrite existing PKCE local storage values.
    if (this.isLoggingIn()) {
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
   * Completes the login flow.
   * Gets the access and ID tokens, establishes an API connection.
   *
   * Must be called at the {@link Options.loginRedirectUri} URI.
   */
  async completeLogin(): Promise<void> {
    await this._getAndSetTokens();

    // Make a socket connection now that we have an access token
    this._socketConnect();
  }

  /**
   * Takes an authorization code and exchanges it for an access token and ID token.
   * Used in {@link completeLogin}.
   * An authorization code is received as a URL param after a successfully calling {@link loginUri}
   * and approving the login request.
   *
   * Expects `code` and `state` query params to be present in the URL. Or else an `error` query
   * param if something went wrong.
   *
   * Stores the access token and ID token in local storage.
   */
  private async _getAndSetTokens(): Promise<void> {
    // get the URL parameters which will include the auth code
    const params = new URLSearchParams(window.location.search);

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
   * A utility function to check if a redirect to complete a login request has been performed.
   * Useful if a login redirect URI is not used solely to complete login, e.g. an app's
   * home page, to check when {@link completeLogin} needs to be called.
   *
   * Also used in {@link loginUri} to make sure PKCE local storage values are not overwritten,
   * which would otherwise accidentally invalidate a login request.
   */
  isLoggingIn(): boolean {
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
        }, 3000);
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
   * @param options An object for specifying a user ID. Specify a user ID to operate on a table owned by that user ID. Otherwise passing `{}` operates on a table owned by the authenticated user.
   */
  async tableSubscribe(tableName: string, options: { userId?: string }, listener: SubscribeListener) {
    const payload = { tableName };
    Object.assign(payload, options);

    const response = (await this._asyncEmit("table:subscribe", payload)) as { data: string }; // data: subscription handle
    const subscriptionHandle = response.data;

    socket.on(subscriptionHandle, listener);

    return async () => {
      socket.off(subscriptionHandle, listener);
      return this._asyncEmit("table:unsubscribe", subscriptionHandle) as Promise<{ message: string }>;
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

  table(tableName: string, tableOptions: { userId?: string }) {
    return new Table(this, tableName, tableOptions);
  }
}
