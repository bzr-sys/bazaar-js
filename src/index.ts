import { API } from "./api/raw";
import { CollectionAPI } from "./api/collection";
import { CollectionsAPI } from "./api/collections";
import { PermissionsAPI } from "./api/permissions";
import { SocialAPI } from "./api/social";
import { Auth } from "./auth";
import { rethinkIdUri } from "./constants";
import { RethinkIDOptions, CollectionOptions, Doc, LoginType } from "./types";

/**
 * Types of errors that can return from the API
 */
export { ErrorTypes, RethinkIDError } from "./utils";
export { CollectionAPI } from "./api/collection";
export { CollectionsAPI } from "./api/collections";
export { PermissionsAPI } from "./api/permissions";
export { SocialAPI } from "./api/social";

export {
  User,
  Contact,
  Permission,
  NewPermission,
  PermissionTemplate,
  PermissionType,
  GrantedPermission,
  FilterObject,
  FilterComparison,
  OrderBy,
  OrderByType,
  RethinkIdMessage,
  Link,
  LoginType,
  Doc,
  AnyDoc,
  SubscribeListener,
  RethinkIDOptions,
} from "./types";

/**
 * The primary class of the RethinkID JS SDK to help you more easily build web apps with RethinkID.
 * @alpha
 */
export class RethinkID {
  /**
   * Auth handles authentication and login
   */

  private auth: Auth;

  /**
   * A wrapper of the low level Data API
   */
  private api: API;

  /**
   * Access to the collections API
   */
  collections: CollectionsAPI;

  /**
   * Access to the permissions API
   */
  permissions: PermissionsAPI;

  /**
   * Access to the social API
   */
  social: SocialAPI;

  constructor(options: RethinkIDOptions) {
    if (!options.rethinkIdUri) {
      options.rethinkIdUri = rethinkIdUri;
    }

    // Initialize API and make a connection to the Data API if logged in
    this.api = new API(
      options,
      async () => {
        if (options.onApiConnect) {
          await options.onApiConnect(this);
          return;
        }
        console.log("API connected");
      },
      async (message: string) => {
        if (options.onApiConnectError) {
          await options.onApiConnectError(this, message);
          return;
        }
        console.error("API connection error:", message);
      },
    );

    // Initialize authentication (auto-login or auto-complete-login if possible)
    this.auth = new Auth(
      options,
      async () => {
        this.api.connect();
        if (options.onLogin) {
          await options.onLogin(this);
          return;
        }
        console.log("onLogin default");
      },
      async (message: string) => {
        if (options.onLoginError) {
          await options.onLoginError(this, message);
          return;
        }
        console.log("onLoginError default:", message);
      },
    );

    this.collections = new CollectionsAPI(this.api);
    this.permissions = new PermissionsAPI(this.api, options.rethinkIdUri, options.appId);
    this.social = new SocialAPI(this.api);
  }

  /**
   * Set a callback function an app can run when it connects or re-connects to the API.
   */
  onApiConnect(f: (rid: RethinkID) => Promise<void>) {
    this.api.onConnect = async () => {
      await f(this);
    };
  }

  /**
   * Set a callback function an app can run when an API disconnection occurs.
   *
   * e.g. Invalid access token
   */
  onApiConnectError(f: (rid: RethinkID, message: string) => Promise<void>) {
    this.api.onConnectError = async (message) => {
      await f(this, message);
    };
  }

  //
  // Login methods
  //

  /**
   * Set a callback function an app can run a login error occurs.
   *
   * e.g. Authorization code is invalid
   */
  onLoginError(f: (rid: RethinkID, message: string) => Promise<void>) {
    this.auth.onLoginError = async (message) => {
      await f(this, message);
    };
  }

  /**
   * Set a callback function an app can run when a user has successfully logged in.
   *
   * e.g. Set state, redirect, etc.
   */
  onLogin(f: (rid: RethinkID) => Promise<void>) {
    this.auth.onLogin = async () => {
      this.api.connect();
      await f(this);
    };
  }

  /**
   * Opens a pop-up window to perform OAuth login.
   * Will fallback to redirect login if pop-up fails to open, if `options.type` is not `popup` (meaning an app has explicitly opted out of falling back to redirect login)
   */
  async login(options?: { type?: LoginType }): Promise<void> {
    return this.auth.login(options);
  }

  /**
   * A utility function to check if the user is logged in.
   * i.e. if an access token is in local storage.
   */
  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  /**
   * A utility function to log a user out.
   * Deletes the access token from local storage and reloads the page.
   */
  logOut(): void {
    return this.auth.logOut();
  }

  /**
   * Get a collection interface (API access to the specified collection)
   * @param collectionName - The name of the collection to create the interface for.
   * @param collectionOptions - An optional object for specifying a user ID & onCreate hook. Specify a user ID to operate on a collection owned by that user ID. Otherwise operates on a collection owned by the authenticated user. The onCreate hook sets up a collection when it is created (e.g., to set up permissions)
   */
  collection<T extends Doc>(collectionName: string, collectionOptions?: CollectionOptions): CollectionAPI<T> {
    return new CollectionAPI<T>(this.api, collectionName, collectionOptions);
  }
}
