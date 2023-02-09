import ClientOAuth2 from "client-oauth2";
import jwt_decode from "jwt-decode";

import { CommonOptions, AuthOptions, LoginType } from "../types";
import { generateRandomString, pkceChallengeFromVerifier, popupWindow } from "../utils";
import { rethinkIdUri, namespacePrefix } from "../constants";

/**
 * The class that deals with login and authentication
 */
export default class Auth {
  /**
   * Public URI for the OAuth authorization server.
   * Currently implemented with Hydra
   *
   * In local development requires a port value and is different than {@link dataApiUri }
   */
  oAuthUri = rethinkIdUri;

  /**
   * URI to start an OAuth login request
   */
  authUri: string;

  /**
   * URI to complete an OAuth login request, exchanging a auth code for an access token and ID token
   */
  tokenUri: string;

  /**
   * Local storage key names, namespaced in the constructor
   */
  tokenKeyName: string;
  idTokenKeyName: string;
  pkceStateKeyName: string;
  pkceCodeVerifierKeyName: string;

  oAuthClient;

  /**
   * An app's base URL
   * Used to check against the origin of a postMessage event sent from the login pop-up window.
   * e.g. https://example-app.com
   */
  baseUrl: string;

  /**
   * The OAuth2 redirect URI. Required to get token.
   */
  loginRedirectUri: string;

  // End constructor vars

  /**
   * A reference to the window object of the login pop-up window.
   */
  loginWindowReference = null;

  /**
   * A reference to the previous URL of the login pop-up window.
   * Used to avoid creating duplicate windows and for focusing an existing window.
   */
  loginWindowPreviousUrl = null;

  /**
   * A callback function an app can specify to run when a user has successfully logged in.
   *
   * e.g. Set state, redirect, etc.
   */
  onLogin: () => void;

  constructor(options: CommonOptions & AuthOptions, onLogin: () => void) {
    if (options.oAuthUri) {
      this.oAuthUri = options.oAuthUri;
    }

    this.authUri = `${this.oAuthUri}/oauth2/auth`;
    this.tokenUri = `${this.oAuthUri}/oauth2/token`;

    this.onLogin = onLogin;

    /**
     * Namespace local storage key names
     */
    const namespace = namespacePrefix + options.appId;
    this.tokenKeyName = `${namespace}_token`;
    this.idTokenKeyName = `${namespace}_id_token`;
    this.pkceStateKeyName = `${namespace}_pkce_state`;
    this.pkceCodeVerifierKeyName = `${namespace}_pkce_code_verifier`;

    this.oAuthClient = new ClientOAuth2({
      clientId: options.appId,
      redirectUri: options.loginRedirectUri,
      accessTokenUri: this.tokenUri,
      authorizationUri: this.authUri,
      scopes: ["openid", "profile", "email"],
    });

    /**
     * Get the base URL from the log in redirect URI already supplied,
     * to save a developer from having to add another options property
     */
    this.baseUrl = new URL(options.loginRedirectUri).origin;

    this.loginRedirectUri = options.loginRedirectUri;

    this._checkLoginQueryParams();
  }

  /**
   * Generate a URI to log in a user to RethinkID and authorize an app.
   * Uses the Authorization Code Flow for single page apps with PKCE code verification.
   * Requests an authorization code.
   */
  async loginUri(): Promise<string> {
    // if logging in, do not overwrite existing PKCE local storage values.
    if (Auth.hasLoginQueryParams()) {
      return "";
    }

    // Create and store a random "state" value
    const state = generateRandomString();
    localStorage.setItem(this.pkceStateKeyName, state);

    // Create and store a new PKCE code_verifier (the plaintext random secret)
    const codeVerifier = generateRandomString();
    localStorage.setItem(this.pkceCodeVerifierKeyName, codeVerifier);

    // Hash and base64-urlencode the secret to use as the challenge
    const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);

    return this.oAuthClient.code.getUri({
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

    if (this.loginWindowReference === null || this.loginWindowReference.closed) {
      /**
       * if the pointer to the window object in memory does not exist or if such pointer exists but the window was closed
       * */
      this.loginWindowReference = popupWindow(url, windowName, window);
    } else if (this.loginWindowPreviousUrl !== url) {
      /**
       * if the resource to load is different, then we load it in the already opened secondary
       * window and then we bring such window back on top/in front of its parent window.
       */
      this.loginWindowReference = popupWindow(url, windowName, window);
      this.loginWindowReference.focus();
    } else {
      /**
       * else the window reference must exist and the window is not closed; therefore,
       * we can bring it back on top of any other window with the focus() method.
       * There would be no need to re-create the window or to reload the referenced resource.
       */
      this.loginWindowReference.focus();
    }

    // Pop-up possibly blocked
    if (!this.loginWindowReference) {
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
    this.loginWindowPreviousUrl = url;
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
    if (event.origin !== this.baseUrl) {
      return;
    }

    // if we trust the sender and the source is our pop-up
    if (event.source === this.loginWindowReference) {
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
    if (!Auth.hasLoginQueryParams()) return;

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
    window.opener.postMessage(location.search, this.baseUrl); // handled by _receiveLoginWindowMessage

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
    if (localStorage.getItem(this.pkceStateKeyName) !== params.get("state")) {
      throw new Error(`State did not match. Possible CSRF attack`);
    }

    // Exchange auth code for access and ID tokens
    let getTokenResponse;
    const uri = `${this.loginRedirectUri}${loginQueryParams}`;
    try {
      getTokenResponse = await this.oAuthClient.code.getToken(uri, {
        body: {
          code_verifier: localStorage.getItem(this.pkceCodeVerifierKeyName) || "",
        },
      });
    } catch (error) {
      throw new Error(`Error getting token: ${error.message}`);
    }

    if (!getTokenResponse) {
      throw new Error(`No token response`);
    }

    // Clean these up since we don't need them anymore
    localStorage.removeItem(this.pkceStateKeyName);
    localStorage.removeItem(this.pkceCodeVerifierKeyName);

    // Store tokens in local storage
    const token: string = getTokenResponse.data.access_token;
    const idToken: string = getTokenResponse.data.id_token;

    localStorage.setItem(this.tokenKeyName, token);
    localStorage.setItem(this.idTokenKeyName, idToken);

    /**
     * Do after login actions
     */
    this.onLogin();
  }

  /**
   * A utility function to check if the user is logged in.
   * i.e. if an access token and ID token are in local storage.
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKeyName);
    const idToken = localStorage.getItem(this.idTokenKeyName);

    if (token && idToken) {
      try {
        jwt_decode(idToken);

        return true;
      } catch (error) {
        // Error decoding ID token, assume tokens are invalid and remove
        localStorage.removeItem(this.tokenKeyName);
        localStorage.removeItem(this.idTokenKeyName);
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
  static hasLoginQueryParams(): boolean {
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
    if (localStorage.getItem(this.tokenKeyName) || localStorage.getItem(this.idTokenKeyName)) {
      localStorage.removeItem(this.tokenKeyName);
      localStorage.removeItem(this.idTokenKeyName);
      location.reload();
    }
  }
}
