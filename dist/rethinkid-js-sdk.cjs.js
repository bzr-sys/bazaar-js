'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ClientOAuth2 = require('client-oauth2');
var jwt_decode = require('jwt-decode');
var io = require('socket.io-client');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var ClientOAuth2__default = /*#__PURE__*/_interopDefaultLegacy(ClientOAuth2);
var jwt_decode__default = /*#__PURE__*/_interopDefaultLegacy(jwt_decode);
var io__default = /*#__PURE__*/_interopDefaultLegacy(io);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

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
function pkceChallengeFromVerifier(codeVerifier) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashed = yield sha256(codeVerifier);
        return base64UrlEncode(hashed);
    });
}

const signUpBaseUri = "http://localhost:3000/sign-up";
const tokenUri = "http://localhost:4444/oauth2/token";
const authUri = "http://localhost:4444/oauth2/auth";
const socketioUri = "http://localhost:4000";
let signUpRedirectUri = "";
let oAuthClient = null;
// Local storage key names
let tokenKeyName = "";
let idTokenKeyName = "";
let pkceStateKeyName = "";
let pkceCodeVerifierKeyName = "";
/**
 * The primary class of the RethinkID JS SDK to help you more easily build web apps with RethinkID.
 *
 * @example
 * ```
 * import { RethinkID } from "@mostlytyped/rethinkid-js-sdk";
 *
 * const config = {
 *   appId: "3343f20f-dd9c-482c-9f6f-8f6e6074bb81",
 *   signUpRedirectUri: https://example.com/callback,
 *   logInRedirectUri: https://example.com/sign-in,
 * };
 *
 * export const rid = new RethinkID(config);
 * ```
 */
class RethinkID {
    constructor(options) {
        // Data API
        /**
         * Makes sure a socket has connected.
         */
        this._waitForConnection = () => {
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
        this._asyncEmit = (event, payload) => __awaiter(this, void 0, void 0, function* () {
            yield this._waitForConnection();
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
        });
        signUpRedirectUri = options.signUpRedirectUri;
        // Namespace local storage key names
        const namespace = `rethinkid_${options.appId}`;
        tokenKeyName = `${namespace}_token`;
        idTokenKeyName = `${namespace}_id_token`;
        pkceStateKeyName = `${namespace}_pkce_state`;
        pkceCodeVerifierKeyName = `${namespace}_pkce_code_verifier`;
        oAuthClient = new ClientOAuth2__default["default"]({
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
    socketConnect() {
        const token = localStorage.getItem(tokenKeyName);
        if (!token) {
            return;
        }
        this.socket = io__default["default"](socketioUri, {
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
        params.append("redirect_uri", signUpRedirectUri);
        return `${signUpBaseUri}?${params.toString()}`;
    }
    /**
     * Generate a URI to log in a user to RethinkID and authorize an app.
     * Uses the Authorization Code Flow for single page apps with PKCE code verification.
     * Requests an authorization code.
     *
     * Use {@link getTokens} to exchange the authorization code for an access token and ID token
     * at the `logInRedirectUri` URI specified when creating a RethinkID instance.
     */
    logInUri() {
        return __awaiter(this, void 0, void 0, function* () {
            // Create and store a random "state" value
            const state = generateRandomString();
            localStorage.setItem(pkceStateKeyName, state);
            // Create and store a new PKCE code_verifier (the plaintext random secret)
            const codeVerifier = generateRandomString();
            localStorage.setItem(pkceCodeVerifierKeyName, codeVerifier);
            // Hash and base64-urlencode the secret to use as the challenge
            const codeChallenge = yield pkceChallengeFromVerifier(codeVerifier);
            return oAuthClient.code.getUri({
                state: state,
                query: {
                    code_challenge: codeChallenge,
                    code_challenge_method: "S256",
                },
            });
        });
    }
    /**
     * Takes an authorization code and exchanges it for an access token and ID token
     * An authorization code is received after a successfully calling logInUri() and
     * approving the log in request.
     * Stores the access token and ID token in local storage as `token` and `idToken` respectively.
     */
    getTokens() {
        return __awaiter(this, void 0, void 0, function* () {
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
            if (localStorage.getItem(pkceStateKeyName) !== params.get("state")) {
                return {
                    error: "State did not match. Possible CSRF attack",
                };
            }
            let getTokenResponse;
            try {
                getTokenResponse = yield oAuthClient.code.getToken(window.location.href, {
                    body: {
                        code_verifier: localStorage.getItem(pkceCodeVerifierKeyName) || "",
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
            localStorage.removeItem(pkceStateKeyName);
            localStorage.removeItem(pkceCodeVerifierKeyName);
            // Store tokens and sign user in locally
            const token = getTokenResponse.data.access_token;
            const idToken = getTokenResponse.data.id_token;
            localStorage.setItem(tokenKeyName, token);
            localStorage.setItem(idTokenKeyName, idToken);
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
        });
    }
    /**
     * A utility function to check if the user is logged in.
     * i.e. if an access token and ID token are in local storage.
     * Returns the decoded ID token for convenient access to user information.
     */
    isLoggedIn() {
        const token = localStorage.getItem(tokenKeyName);
        const idToken = localStorage.getItem(idTokenKeyName);
        if (token && idToken) {
            try {
                const idTokenDecoded = jwt_decode__default["default"](idToken);
                return {
                    idTokenDecoded,
                };
            }
            catch (error) {
                // clean up
                localStorage.removeItem(tokenKeyName);
                localStorage.removeItem(idTokenKeyName);
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
        if (localStorage.getItem(tokenKeyName) || localStorage.getItem(idTokenKeyName)) {
            localStorage.removeItem(tokenKeyName);
            localStorage.removeItem(idTokenKeyName);
            location.reload();
        }
    }
    /**
     * Creates a table
     */
    tablesCreate(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._asyncEmit("tables:create", { tableName });
        });
    }
    /**
     * Drops, or deletes, a table
     */
    tablesDrop(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._asyncEmit("tables:drop", { tableName });
        });
    }
    /**
     * Lists all table names
     */
    tablesList() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._asyncEmit("tables:list", null);
        });
    }
    /**
     * Gets permissions for a user. At least one of the parameters must be provided.
     */
    permissionsGet(tableName, userId, permission) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._asyncEmit("permissions:get", { tableName, userId, permission });
        });
    }
    /**
     * Sets permissions for a user
     */
    permissionsSet(permissions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._asyncEmit("permissions:set", permissions);
        });
    }
    /**
     * Sets permissions for a user
     */
    permissionsDelete(rowId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._asyncEmit("permissions:delete", { rowId });
        });
    }
    /**
     * Get all rows from a table, or a single row if rowId is provided
     */
    tableRead(tableName, rowId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._asyncEmit("table:read", { tableName, rowId });
        });
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
    tableSubscribe(tableName, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._asyncEmit("table:subscribe", { tableName, userId }); // data: socket table handle
        });
    }
    /**
     * Unsubscribe from table changes
     * After having subscribed with {@link tableSubscribe}
     */
    tableUnsubscribe(tableName, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._asyncEmit("table:unsubscribe", { tableName, userId });
        });
    }
    /**
     * Inserts a row into a table
     */
    tableInsert(tableName, row, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._asyncEmit("table:insert", { tableName, row, userId });
        });
    }
    /**
     * Updates a row in a table
     */
    tableUpdate(tableName, row, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._asyncEmit("table:update", { tableName, row, userId });
        });
    }
    /**
     * Replaces a row in a table
     */
    tableReplace(tableName, row, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._asyncEmit("table:replace", { tableName, row, userId });
        });
    }
    /**
     * Deletes a row from a table
     */
    tableDelete(tableName, rowId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._asyncEmit("table:delete", { tableName, rowId, userId });
        });
    }
}

exports.RethinkID = RethinkID;
