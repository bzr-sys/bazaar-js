import ClientOAuth2 from "client-oauth2";
import jwt_decode from "jwt-decode";
import io from "socket.io-client";

import { Options, TokenDecoded, IdTokenDecoded, Permission } from "./types";
import { generateRandomString, pkceChallengeFromVerifier } from "./utils";

const signUpBaseUri: string = "http://localhost:3000/sign-up";
const tokenUri: string = "http://localhost:4444/oauth2/token";
const authUri: string = "http://localhost:4444/oauth2/auth";
const socketioUri: string = "http://localhost:4000";
let signUpRedirectUri: string = "";
let oAuthClient = null;

/**
 * The primary class of the RethinkID JS SDK to help you more easily build web apps with RethinkID.
 *
 * @example
 * ```
 * import { RethinkID } from "@mostlytyped/rethinkid-js-sdk";
 *
 * const config = {
 *   appId: process.env.VUE_APP_APP_ID,
 *   signUpRedirectUri: process.env.VUE_APP_SIGN_UP_REDIRECT_URI,
 *   logInRedirectUri: process.env.VUE_APP_LOG_IN_REDIRECT_URI,
 * };
 *
 * export const rid = new RethinkID(config);
 * ```
 */
export class RethinkID {
  socket;

  constructor(options: Options) {
    signUpRedirectUri = options.signUpRedirectUri;

    oAuthClient = new ClientOAuth2({
      clientId: options.appId,
      redirectUri: options.logInRedirectUri,
      accessTokenUri: tokenUri,
      authorizationUri: authUri,
      scopes: ["openid", "profile", "email"],
    });

    this.socketConnect();
  }

  /**
   * Creates a SocketIO connection with an auth token
   */
  private socketConnect(): void {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    this.socket = io(socketioUri, {
      auth: { token },
    });

    this.socket.on("connect", () => {
      console.log("sdk: connected. this.socket.id:", this.socket.id);
    });

    this.socket.on("connect_error", (err) => {
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
   * Generate a URI to log in a user to RethinkID and authorize your app.
   * Uses the Authorization Code Flow for single page apps with PKCE code verification.
   * Requests an authorization code.
   */
  async logInUri(): Promise<string> {
    // Create and store a random "state" value
    const state = generateRandomString();
    localStorage.setItem("pkce_state", state);

    // Create and store a new PKCE code_verifier (the plaintext random secret)
    const codeVerifier = generateRandomString();
    localStorage.setItem("pkce_code_verifier", codeVerifier);

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
   * Takes an authorization code and exchanges it for an access token and ID token
   * An authorization code is received after a successfully calling logInUri() and
   * approving the log in request.
   * Stores the access token and ID token in local storage as `token` and `idToken` respectively.
   */
  async getTokens(): Promise<{
    error?: string;
    errorDescription?: string;
    tokenDecoded?: TokenDecoded;
    idTokenDecoded?: IdTokenDecoded;
  }> {
    const params = new URLSearchParams(window.location.search);

    // Check if the auth server returned an error string
    const error = params.get("error");
    if (error) {
      return {
        error: error,
        errorDescription: params.get("error_description") || "",
      };
    }

    // Make sure the auth server returned a code
    const code = params.get("code");
    if (!code) {
      return {
        error: "No query param code",
      };
    }

    // Verify state matches what we set at the beginning
    if (localStorage.getItem("pkce_state") !== params.get("state")) {
      return {
        error: "State did not match. Possible CSRF attack",
      };
    }

    let getTokenResponse;
    try {
      getTokenResponse = await oAuthClient.code.getToken(window.location.href, {
        body: {
          code_verifier: localStorage.getItem("pkce_code_verifier") || "",
        },
      });
    } catch (error) {
      return {
        error: `Error getting token: ${error.message}`,
      };
    }

    if (!getTokenResponse) {
      return {
        error: "No token response",
      };
    }

    // Clean these up since we don't need them anymore
    localStorage.removeItem("pkce_state");
    localStorage.removeItem("pkce_code_verifier");

    // Store tokens and sign user in locally
    const token: string = getTokenResponse.data.access_token;
    const idToken: string = getTokenResponse.data.id_token;

    localStorage.setItem("token", token);
    localStorage.setItem("idToken", idToken);

    try {
      const tokenDecoded: TokenDecoded = jwt_decode(token);
      const idTokenDecoded: IdTokenDecoded = jwt_decode(idToken);

      this.socketConnect();
      return {
        tokenDecoded,
        idTokenDecoded,
      };
    } catch (error) {
      return {
        error: `Error decoding token: ${error.message}`,
      };
    }
  }

  /**
   * A utility function to check if the user is logged in.
   * i.e. if an access token and ID token are in local storage.
   * Returns the decoded ID token for convenient access to user information.
   */
  isLoggedIn():
    | {
        idTokenDecoded?: IdTokenDecoded;
        error?: string;
      }
    | false {
    const token = localStorage.getItem("token");
    const idToken = localStorage.getItem("idToken");

    if (token && idToken) {
      try {
        const idTokenDecoded: IdTokenDecoded = jwt_decode(idToken);

        return {
          idTokenDecoded,
        };
      } catch (error) {
        // clean up
        localStorage.removeItem("token");
        localStorage.removeItem("idToken");

        return {
          error: `ID token decode error: ${error}`,
        };
      }
    }

    return false;
  }

  /**
   * A utility function to log a user out.
   * Deletes the access token and ID token from local storage and reloads the page.
   */
  logOut(): void {
    if (localStorage.getItem("token") || localStorage.getItem("idToken")) {
      localStorage.removeItem("token");
      localStorage.removeItem("idToken");
      location.reload();
    }
  }

  // Data API

  /**
   * Makes sure a socket has connected.
   */
  private _waitForConnection: () => Promise<true> = () => {
    return new Promise((resolve, reject) => {
      if (this.socket.connected) {
        resolve(true);
      } else {
        this.socket.on("connect", () => {
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
      this.socket.emit(event, payload, (response: any) => {
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
   * Gets permissions for a user. At least one of the parameters must be provided.
   */
  async permissionsGet(tableName?: string, userId?: string, permission?: "read" | "insert" | "update" | "delete") {
    return this._asyncEmit("permissions:get", { tableName, userId, permission }) as Promise<{ data: Permission[] }>;
  }

  /**
   * Sets permissions for a user
   */
  async permissionsSet(permissions: Permission[]) {
    return this._asyncEmit("permissions:set", permissions) as Promise<{ message: string }>;
  }

  /**
   * Sets permissions for a user
   */
  async permissionsDelete(rowId: string) {
    return this._asyncEmit("permissions:delete", { rowId }) as Promise<{ message: string }>;
  }

  /**
   * Get all rows from a table, or a single row if rowId is provided
   */
  async tableRead(tableName: string, rowId?: string): Promise<{ data: object }> {
    return this._asyncEmit("table:read", { tableName, rowId }) as Promise<{ data: object }>;
  }

  /**
   * Subscribe to table changes. Returns a handle to receive for changes,
   * to be used with {@link socket}.
   *
   * @example
   * ```js
   *   const rid = new RethinkID(options);
   *   rid.socket.on(socketTableHandle, (changes) => {
   *     console.log("Received emitted changes", changes);
   *     if (changes.new_val && changes.old_val === null) {
   *         console.log("Received new message");
   *     }
   *     if (changes.new_val === null && changes.old_val) {
   *         console.log("Received deleted message");
   *     }
   *     if (changes.new_val && changes.old_val) {
   *         console.log("Received updated message");
   *     }
   * });
   * ```
   */
  async tableSubscribe(tableName: string, userId?: string) {
    return this._asyncEmit("table:subscribe", { tableName, userId }) as Promise<{ data: string }>; // data: socket table handle
  }

  /**
   * Unsubscribe from table changes
   * After having subscribed with {@link tableSubscribe}
   */
  async tableUnsubscribe(tableName: string, userId?: string) {
    return this._asyncEmit("table:unsubscribe", { tableName, userId }) as Promise<{ message: string }>;
  }

  /**
   * Inserts a row into a table
   */
  async tableInsert(tableName: string, row: object, userId?: string) {
    return this._asyncEmit("table:insert", { tableName, row, userId }) as Promise<{ message: string }>;
  }

  /**
   * Updates a row in a table
   */
  async tableUpdate(tableName: string, row: object, userId?: string) {
    return this._asyncEmit("table:update", { tableName, row, userId }) as Promise<{ message: string }>;
  }

  /**
   * Replaces a row in a table
   */
  async tableReplace(tableName: string, row: object, userId?: string) {
    return this._asyncEmit("table:replace", { tableName, row, userId }) as Promise<{ message: string }>;
  }

  /**
   * Deletes a row from a table
   */
  async tableDelete(tableName: string, rowId: string, userId?: string) {
    return this._asyncEmit("table:delete", { tableName, rowId, userId }) as Promise<{ message: string }>;
  }
}
