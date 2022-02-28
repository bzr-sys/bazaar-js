'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ClientOAuth2 = require('client-oauth2');
var jwt_decode = require('jwt-decode');
var io = require('socket.io-client');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var ClientOAuth2__default = /*#__PURE__*/_interopDefaultLegacy(ClientOAuth2);
var jwt_decode__default = /*#__PURE__*/_interopDefaultLegacy(jwt_decode);
var io__default = /*#__PURE__*/_interopDefaultLegacy(io);

/**
 * Generates a secure random string using the browser crypto functions
 */
function generateRandomString() {
    const array = new Uint32Array(28);
    window.crypto.getRandomValues(array);
    return Array.from(array, (dec) => ("0" + dec.toString(16)).slice(-2)).join("");
}
/**
 * Calculates the SHA256 hash of the input text.
 * @param input A random string
 */
function sha256(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    return window.crypto.subtle.digest("SHA-256", data);
}
/**
 * Base64-url encodes an input string
 * @param arrayBuffer the result of a random string hashed by sha256()
 */
function base64UrlEncode(arrayBuffer) {
    // Convert the ArrayBuffer to string using Uint8 array to convert to what btoa accepts.
    // btoa accepts chars only within ascii 0-255 and base64 encodes them.
    // Then convert the base64 encoded to base64url encoded
    // (replace + with -, replace / with _, trim trailing =)
    return btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}
/**
 * Return the base64-url encoded sha256 hash for the PKCE challenge
 * @param codeVerifier A random string
 */
async function pkceChallengeFromVerifier(codeVerifier) {
    const hashed = await sha256(codeVerifier);
    return base64UrlEncode(hashed);
}

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
class RethinkID {
    #signUpBaseUri = "http://localhost:3000/sign-up";
    #tokenUri = "http://localhost:4444/oauth2/token";
    #authUri = "http://localhost:4444/oauth2/auth";
    #socketioUri = "http://localhost:4000";
    #signUpRedirectUri = "";
    #oAuthClient;
    socket;
    constructor(options) {
        this.#signUpRedirectUri = options.signUpRedirectUri;
        this.#oAuthClient = new ClientOAuth2__default["default"]({
            clientId: options.appId,
            redirectUri: options.logInRedirectUri,
            accessTokenUri: this.#tokenUri,
            authorizationUri: this.#authUri,
            scopes: ["openid", "profile", "email"],
        });
        this.socketConnect();
    }
    /**
     * Creates a SocketIO connection with an auth token
     */
    socketConnect() {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }
        this.socket = io__default["default"](this.#socketioUri, {
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
    signUpUri() {
        const params = new URLSearchParams();
        params.append("redirect_uri", this.#signUpRedirectUri);
        return `${this.#signUpBaseUri}?${params.toString()}`;
    }
    /**
     * Generate a URI to log in a user to RethinkID and authorize your app.
     * Uses the Authorization Code Flow for single page apps with PKCE code verification.
     * Requests an authorization code.
     */
    async logInUri() {
        // Create and store a random "state" value
        const state = generateRandomString();
        localStorage.setItem("pkce_state", state);
        // Create and store a new PKCE code_verifier (the plaintext random secret)
        const codeVerifier = generateRandomString();
        localStorage.setItem("pkce_code_verifier", codeVerifier);
        // Hash and base64-urlencode the secret to use as the challenge
        const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);
        return this.#oAuthClient.code.getUri({
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
    async getTokens() {
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
            getTokenResponse = await this.#oAuthClient.code.getToken(window.location.href, {
                body: {
                    code_verifier: localStorage.getItem("pkce_code_verifier") || "",
                },
            });
        }
        catch (error) {
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
        const token = getTokenResponse.data.access_token;
        const idToken = getTokenResponse.data.id_token;
        localStorage.setItem("token", token);
        localStorage.setItem("idToken", idToken);
        try {
            const tokenDecoded = jwt_decode__default["default"](token);
            const idTokenDecoded = jwt_decode__default["default"](idToken);
            this.socketConnect();
            return {
                tokenDecoded,
                idTokenDecoded,
            };
        }
        catch (error) {
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
    isLoggedIn() {
        const token = localStorage.getItem("token");
        const idToken = localStorage.getItem("idToken");
        if (token && idToken) {
            try {
                const idTokenDecoded = jwt_decode__default["default"](idToken);
                return {
                    idTokenDecoded,
                };
            }
            catch (error) {
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
    logOut() {
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
    _waitForConnection = () => {
        return new Promise((resolve, reject) => {
            if (this.socket.connected) {
                resolve(true);
            }
            else {
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
    _asyncEmit = async (event, payload) => {
        await this._waitForConnection();
        return new Promise((resolve, reject) => {
            this.socket.emit(event, payload, (response) => {
                if (response.error) {
                    reject(new Error(response.error));
                }
                else {
                    resolve(response);
                }
            });
        });
    };
    /**
     * Creates a table
     */
    async tablesCreate(tableName) {
        return this._asyncEmit("tables:create", { tableName });
    }
    /**
     * Drops, or deletes, a table
     */
    async tablesDrop(tableName) {
        return this._asyncEmit("tables:drop", { tableName });
    }
    /**
     * Lists all table names
     */
    async tablesList() {
        return this._asyncEmit("tables:list", null);
    }
    /**
     * Gets permissions for a user. At least one of the parameters must be provided.
     */
    async permissionsGet(tableName, userId, permission) {
        return this._asyncEmit("permissions:get", { tableName, userId, permission });
    }
    /**
     * Sets permissions for a user
     */
    async permissionsSet(permissions) {
        return this._asyncEmit("permissions:set", permissions);
    }
    /**
     * Sets permissions for a user
     */
    async permissionsDelete(rowId) {
        return this._asyncEmit("permissions:delete", { rowId });
    }
    /**
     * Get all rows from a table, or a single row if rowId is provided
     */
    async tableRead(tableName, rowId) {
        return this._asyncEmit("table:read", { tableName, rowId });
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
    async tableSubscribe(tableName, userId) {
        return this._asyncEmit("table:subscribe", { tableName, userId }); // data: socket table handle
    }
    /**
     * Unsubscribe from table changes
     * After having subscribed with {@link tableSubscribe}
     */
    async tableUnsubscribe(tableName, userId) {
        return this._asyncEmit("table:unsubscribe", { tableName, userId });
    }
    /**
     * Inserts a row into a table
     */
    async tableInsert(tableName, row, userId) {
        return this._asyncEmit("table:insert", { tableName, row, userId });
    }
    /**
     * Updates a row in a table
     */
    async tableUpdate(tableName, row, userId) {
        return this._asyncEmit("table:update", { tableName, row, userId });
    }
    /**
     * Replaces a row in a table
     */
    async tableReplace(tableName, row, userId) {
        return this._asyncEmit("table:replace", { tableName, row, userId });
    }
    /**
     * Deletes a row from a table
     */
    async tableDelete(tableName, rowId, userId) {
        return this._asyncEmit("table:delete", { tableName, rowId, userId });
    }
}

exports.RethinkID = RethinkID;
