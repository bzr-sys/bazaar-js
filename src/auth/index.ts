import { OAuth2Client, OAuth2Token, generateCodeVerifier } from "@badgateway/oauth2-client";

import type { AuthOptions } from "../types";
import { LoginType } from "../types";
import { generateRandomString, popupWindow } from "../utils";
import { namespacePrefix } from "../constants";

/**
 * The class that deals with login and authentication
 */
export class Auth {
  /**
   * Local storage key names, namespaced in the constructor
   */
  private tokenKeyName: string;
  private pkceStateKeyName: string;
  private pkceCodeVerifierKeyName: string;

  private oAuthClient: OAuth2Client;

  /**
   * An app's base URL
   * Used to check against the origin of a postMessage event sent from the login pop-up window.
   * e.g. https://example-app.com
   */
  private baseUrl: string;

  /**
   * The OAuth2 redirect URI. Required to get token.
   */
  private loginRedirectUri: string;

  // End constructor vars

  /**
   * A reference to the window object of the login pop-up window.
   */
  private popupWindow: Window;

  private popupWindowName = "bazaar-login-window";

  /**
   * A reference to the previous URL of the login pop-up window.
   * Used to avoid creating duplicate windows and for focusing an existing window.
   */
  private popupPreviousUrl: string;

  /**
   * A reference to a {@link popupMessageListener} so it can be reliably cleaned up
   */
  private boundPopupMessageListener: (event: MessageEvent) => void;

  /**
   * Set from {@link login} context so errors from {@link popupMessageListener} can propagate.
   */
  private popupResolve: () => void;

  /**
   * Set from {@link login} context so errors from {@link popupMessageListener} can propagate.
   */
  private popupReject: (error: Error) => void;

  /**
   * A callback function an app can specify to run when a user has successfully logged in.
   *
   * e.g. Set state, redirect, etc.
   */
  onLogin: () => void;

  /**
   * A callback function an app can run a login error occurs.
   *
   * e.g. Authorization code is invalid
   */
  onLoginError: (message: string) => void;

  constructor(options: AuthOptions, onLogin: () => void, onLoginError: (message: string) => void) {
    this.onLogin = onLogin;

    this.onLoginError = onLoginError;

    // Cache the bound event listener for consistent reference and reliable removal later
    this.boundPopupMessageListener = this.popupMessageListener.bind(this);

    /**
     * Namespace local storage key names
     */
    const namespace = namespacePrefix + options.appId;
    this.tokenKeyName = `${namespace}_token`;
    this.pkceStateKeyName = `${namespace}_pkce_state`;
    this.pkceCodeVerifierKeyName = `${namespace}_pkce_code_verifier`;

    this.oAuthClient = new OAuth2Client({
      server: options.bazaarUri,
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
   * Generates a URI to log in a user to Bazaar and authorize an app.
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
   * Will fallback to redirect login if pop-up fails to open, if `options.type` is not `popup` (meaning an app has explicitly opted out of falling back to redirect login)
   */
  async login(options?: { type?: LoginType }): Promise<void> {
    // Remove any existing event listeners
    window.removeEventListener("message", this.boundPopupMessageListener);

    /**
     * Stop a log in request early when it cannot succeed to avoid a potentially frustrating DX.
     * The same check happens later in the log in process in {@link popupMessageListener} for security.
     */
    if (window.origin !== this.baseUrl) {
      this.onLoginError(
        `Login failed: Request origin (${window.origin}) doesn't match configured loginRedirectUri origin (${this.baseUrl})`,
      );
      return;
    }

    const loginType = options?.type || LoginType.POPUP_FALLBACK;

    const loginUri = await this.loginUri();

    // Do redirect login
    if (loginType === LoginType.REDIRECT) {
      window.location.href = loginUri;
      return;
    }

    // Do pop-up login

    /**
     * Add event listener in the opening window for messages sent from the pop-up
     */
    window.addEventListener("message", this.boundPopupMessageListener);

    /**
     * Return promise to allow errors to propagate up to this {@link login} method.
     * Otherwise, cannot catch errors that occur when a pop-up message is received.
     */
    return new Promise(async (resolve, reject) => {
      this.popupResolve = resolve;
      this.popupReject = reject;

      if (!this.popupWindow || this.popupWindow.closed) {
        // If the pointer to the window object in memory does not exist or if such
        // pointer exists but the window was closed
        this.popupWindow = popupWindow(loginUri, this.popupWindowName, window);
      } else if (this.popupPreviousUrl !== loginUri) {
        // If the resource to load is different, then we load it in the already opened secondary
        // window and then we bring such window back on top/in front of its parent window.
        this.popupWindow = popupWindow(loginUri, this.popupWindowName, window);
        this.popupWindow.focus();
      } else {
        // Else the window reference must exist and the window is not closed; therefore,
        // we can bring it back on top of any other window with the focus() method.
        // There would be no need to re-create the window or to reload the referenced resource.
        this.popupWindow.focus();
      }

      // Pop-up possibly blocked
      if (!this.popupWindow) {
        if (loginType === LoginType.POPUP) {
          // App explicitly does not want to fallback to redirect
          reject(new Error("Pop-up failed to open"));
        } else {
          // Do fallback to redirect login
          window.location.href = loginUri;
          return resolve();
        }
      }

      this.popupPreviousUrl = loginUri;
    });
  }

  /**
   * A "message" event listener for the login pop-up window.
   * Handles messages sent from the login pop-up window to its opener window.
   * Set to {@link boundPopupMessageListener} in the constructor
   */
  private async popupMessageListener(event: MessageEvent) {
    // Possibly not a Window
    // Note: checking `event.source instanceof Window` is unreliable for some reason.
    if (!("name" in event.source)) return;

    // Only handle events from the pop-up
    // e.g. The React Developer Tools Chrome extension constantly sends message events. Do not try handle those.
    if ("name" in event.source && event.source.name !== this.popupWindowName) return;

    try {
      // Make sure to check origin and source to mitigate XSS attacks

      // Do we trust the sender of this message? (might be
      // different from what we originally opened, for example).
      if (event.origin !== this.baseUrl) {
        this.onLoginError(`Login failed: Request origin doesn't match configured loginRedirectUri origin`);
      }

      // If we trust the sender and the source is our pop-up
      if (event.source === this.popupWindow) {
        await this.completeLogin(event.data);
      }

      window.removeEventListener("message", this.boundPopupMessageListener);
      if (this.popupResolve) this.popupResolve();
    } catch (error) {
      window.removeEventListener("message", this.boundPopupMessageListener);
      if (this.popupReject) this.popupReject(error);
    }
  }

  /**
   * Continues the login flow after redirected back from the OAuth server, handling pop-up or redirect login types.
   *
   * Must be called at the {@link loginRedirectUri} URI.
   *
   * @returns string to indicate login type
   */
  private async checkLoginQueryParams(): Promise<LoginType.POPUP | LoginType.REDIRECT> {
    // Only attempt to complete login if actually logging in.
    if (!Auth.hasLoginQueryParams()) return;

    /**
     * If completing redirect login
     */
    if (!window.opener) {
      await this.completeLogin(location.search);
      return LoginType.REDIRECT;
    }

    /**
     * If completing pop-up login
     */

    /**
     * Send message to parent/opener window with login query params.
     * Specify `baseUrl` targetOrigin for security.
     * Handled by {@link popupMessageListener}
     */
    window.opener.postMessage(location.search, this.baseUrl);

    // Close the pop-up, and return focus to the parent window where the `postMessage` we just sent above is received.
    window.close();

    // Send message in case window fails to close,
    // e.g. On Brave iOS the tab does not seem to close,
    // so at least an app has some way of gracefully handling this case.
    return LoginType.POPUP;
  }

  /**
   * Completes a login request
   *
   * Takes an authorization code and exchanges it for an access token.
   *
   * Expects `code` and `state` query params to be present in the URL. Or else an `error` query
   * param if something went wrong.
   *
   * Stores the access token in local storage.
   *
   * Performs after login actions.
   */
  private async completeLogin(loginQueryParams: string): Promise<void> {
    const state = localStorage.getItem(this.pkceStateKeyName);
    const codeVerifier = localStorage.getItem(this.pkceCodeVerifierKeyName);

    const uri = `${this.loginRedirectUri}${loginQueryParams}`;

    let oAuth2Token: OAuth2Token;

    try {
      oAuth2Token = await this.oAuthClient.authorizationCode.getTokenFromCodeRedirect(uri, {
        /**
         * The redirect URI is not actually used for any redirects, but MUST be the
         * same as what you passed earlier to "authorizationCode"
         */
        redirectUri: this.loginRedirectUri,
        state,
        codeVerifier,
      });
    } catch (error) {
      this.onLoginError(error.message);
      return;
    }

    const token = oAuth2Token.accessToken;

    // getTokenFromCodeRedirect() can return a successful response with empty values
    // if the get token response body does not contain the properties it expects
    // e.g. the response body contains `accessToken` instead of `access_token`.
    if (!token) {
      this.onLoginError("No token");
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
   * Check if the user is logged in.
   * i.e. if an access token is in local storage.
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKeyName);
    if (token) {
      return true;
    }
    return false;
  }

  /**
   * Checks if a redirect to complete a login request has been performed.
   *
   * Also used in {@link loginUri} to make sure PKCE local storage values are not overwritten,
   * which would otherwise accidentally invalidate a login request.
   */
  static hasLoginQueryParams(): boolean {
    const params = new URLSearchParams(location.search);

    // These query params will be present when redirected
    // back from the OAuth server
    return !!(params.get("code") && params.get("state"));
  }

  /**
   * Logs out a user.
   */
  logOut(): void {
    if (localStorage.getItem(this.tokenKeyName)) {
      localStorage.removeItem(this.tokenKeyName);
      location.reload();
    }
  }
}
