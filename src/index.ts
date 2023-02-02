import jwt_decode from "jwt-decode";

import API from "./api";
import Auth from "./auth";
import { namespacePrefix } from "./constants";
import { Table } from "./table";
import { ApiOptions, AuthOptions, CommonOptions, IdTokenDecoded, LoginType } from "./types";

/**
 * Types of errors that can return from the API
 */
export { ErrorTypes, RethinkIDError } from "./utils";

/**
 * RethinkID constructor options
 */
export type Options = CommonOptions &
  AuthOptions &
  ApiOptions & {
    /**
     * A callback function an app can specify to run when a user has successfully logged in.
     *
     * e.g. Set state, redirect, etc.
     */
    onLogin?: (rid: RethinkID) => void;

    /**
     * Provide a callback to handled failed data API connections. E.g. unauthorized, or expired token.
     */
    onApiConnectError?: (rid: RethinkID, message: string) => void;
  };

/**
 * The primary class of the RethinkID JS SDK to help you more easily build web apps with RethinkID.
 */
export default class RethinkID {
  /**
   * Local storage key names, namespaced in the constructor
   */
  idTokenKeyName: string;

  /**
   * Auth handles authentication and login
   */

  auth: Auth;
  /**
   * A wrapper of the low level Data API
   */
  api: API;

  constructor(options: Options) {
    // set local storage variable name for userInfo method (TODO: remove)
    const namespace = namespacePrefix + options.appId;
    this.idTokenKeyName = `${namespace}_id_token`;

    // Initialize API and make a connection to the Data API if logged in
    this.api = new API(options, (message: string) => {
      if (options.onApiConnectError) {
        options.onApiConnectError(this, message);
        return;
      }
      console.error("Connection error:", message);
    });

    // Initialize authentication (auto-login or auto-complete-login if possible)
    this.auth = new Auth(options, () => {
      this.api._connect();
      if (options.onLogin) {
        options.onLogin(this);
      }
    });
  }

  /**
   * Set a callback function an app can run when a user has successfully logged in.
   *
   * e.g. Set state, redirect, etc.
   */
  onLogin(f: (rid: RethinkID) => void) {
    this.auth.onLogin = () => {
      this.api._connect();
      f(this);
    };
  }

  /**
   * Opens a pop-up window to perform OAuth login.
   * Will fallback to redirect login if pop-up fails to open, provided options type is not `popup` (meaning an app has explicitly opted out of fallback redirect login)
   */
  async login(options?: { type?: LoginType }): Promise<void> {
    return this.auth.login(options);
  }

  /**
   * A utility function to check if the user is logged in.
   * i.e. if an access token and ID token are in local storage.
   */
  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  /**
   * A utility function to log a user out.
   * Deletes the access token and ID token from local storage and reloads the page.
   */
  logOut(): void {
    return this.auth.logOut();
  }

  // TODO remove userInfo

  /**
   * A utility function to get user info, i.e. user ID and the scope-based claims of an
   * authenticated user's ID token.
   */
  userInfo(): null | { id: string; email: string; name: string } {
    const idToken = localStorage.getItem(this.idTokenKeyName);

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
        localStorage.removeItem(this.idTokenKeyName);
      }
    }

    return null;
  }

  //
  // APIs
  //

  /**
   * Get a table interface
   * @param tableName The name of the table to create the interface for.
   * @param onCreate A hook to set up a table when it is created (e.g., to set up permissions)
   * @param tableOptions An optional object for specifying a user ID. Specify a user ID to operate on a table owned by that user ID. Otherwise operates on a table owned by the authenticated user.
   */
  table(tableName: string, onCreate: () => Promise<void>, tableOptions?: { userId?: string }) {
    return new Table(this.api, tableName, onCreate, tableOptions);
  }
}
