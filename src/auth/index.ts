import { OAuth2Client, generateCodeVerifier } from "@badgateway/oauth2-client";

import { CommonOptions, AuthOptions, LoginType } from "../types";
import { generateRandomString, popupWindow } from "../utils";
import { rethinkIdUri, namespacePrefix } from "../constants";

/**
 * The class that deals with login and authentication
 */
export class Auth {
  /**
   * Local storage key names, namespaced in the constructor
   */
  tokenKeyName: string;
  pkceStateKeyName: string;
  pkceCodeVerifierKeyName: string;

  oAuthClient: OAuth2Client;

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
    this.onLogin = onLogin;

    /**
     * Namespace local storage key names
     */
    const namespace = namespacePrefix + options.appId;
    this.tokenKeyName = `${namespace}_token`;
    this.pkceStateKeyName = `${namespace}_pkce_state`;
    this.pkceCodeVerifierKeyName = `${namespace}_pkce_code_verifier`;

    this.oAuthClient = new OAuth2Client({
      server: options.rethinkIdUri,
      clientId: options.appId,
      tokenEndpoint: "/api/v1/oauth2/token",
      authorizationEndpoint: "/oauth2",
    });

    /**
     * Get the base URL from the log in redirect URI already supplied,
     * to save a developer from having to add another options property
     */
    this.baseUrl = new URL(options.loginRedirectUri).origin;

    this.loginRedirectUri = options.loginRedirectUri;

    this.checkLoginQueryParams();
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
    // The OAuth client handles the code challenge
    const codeVerifier = await generateCodeVerifier();
    localStorage.setItem(this.pkceCodeVerifierKeyName, codeVerifier);

    return this.oAuthClient.authorizationCode.getAuthorizeUri({
      redirectUri: this.loginRedirectUri,
      state,
      codeVerifier,
      scope: ["openid", "profile", "email"],
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
    window.removeEventListener("message", this.receiveLoginWindowMessage);

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
    window.addEventListener("message", (event) => this.receiveLoginWindowMessage(event), false);
    // assign the previous URL
    this.loginWindowPreviousUrl = url;
  }

  /**
   * A "message" event listener for the login pop-up window.
   * Handles messages sent from the login pop-up window to its opener window.
   * @param event A postMessage event object
   */
  private receiveLoginWindowMessage(event): void {
    // Make sure to check origin and source to mitigate XSS attacks

    // Do we trust the sender of this message? (might be
    // different from what we originally opened, for example).
    if (event.origin !== this.baseUrl) {
      return;
    }

    // if we trust the sender and the source is our pop-up
    if (event.source === this.loginWindowReference) {
      this.completeLogin(event.data);
    }
  }

  /**
   * Continues the login flow after redirected back from the OAuth server, handling pop-up or redirect login types.
   *
   * Must be called at the {@link Options.loginRedirectUri} URI.
   *
   * @returns string to indicate login type
   */
  private async checkLoginQueryParams(): Promise<string> {
    // Only attempt to complete login if actually logging in.
    if (!Auth.hasLoginQueryParams()) return;

    /**
     * If completing redirect login
     */
    if (!window.opener) {
      await this.completeLogin(location.search);
      return "redirect";
    }

    /**
     * If completing pop-up login
     */
    // Send message to parent/opener window with login query params
    // Specify `baseUrl` targetOrigin for security
    window.opener.postMessage(location.search, this.baseUrl); // handled by receiveLoginWindowMessage

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
  private async completeLogin(loginQueryParams: string): Promise<void> {
    const state = localStorage.getItem(this.pkceStateKeyName);
    const codeVerifier = localStorage.getItem(this.pkceCodeVerifierKeyName);

    const uri = `${this.loginRedirectUri}${loginQueryParams}`;

    const oAuth2Token = await this.oAuthClient.authorizationCode.getTokenFromCodeRedirect(uri, {
      /**
       * The redirect URI is not actually used for any redirects, but MUST be the
       * same as what you passed earlier to "authorizationCode"
       */
      redirectUri: this.loginRedirectUri,
      state,
      codeVerifier,
    });

    const token = oAuth2Token.accessToken;

    // getTokenFromCodeRedirect() can return a successful response with empty values
    // if the get token response body does not contain the properties it expects
    // e.g. the response body contains `accessToken` instead of `access_token`.
    if (!token) {
      throw new Error("No token");
    }

    // Store token in local storage
    localStorage.setItem(this.tokenKeyName, token);

    // Clean these up since we don't need them anymore
    localStorage.removeItem(this.pkceStateKeyName);
    localStorage.removeItem(this.pkceCodeVerifierKeyName);

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
    if (token) {
      return true;
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
    return !!(params.get("code") && params.get("state"));
  }

  /**
   * A utility function to log a user out.
   * Deletes the access token and ID token from local storage and reloads the page.
   */
  logOut(): void {
    if (localStorage.getItem(this.tokenKeyName)) {
      localStorage.removeItem(this.tokenKeyName);
      location.reload();
    }
  }
}
