import { API } from "./api/raw";
import { CollectionAPI } from "./api/collection";
import { CollectionsAPI } from "./api/collections";
import { PermissionsAPI } from "./api/permissions";
import { SocialAPI } from "./api/social";
import { Auth } from "./auth";
import { bazaarUri } from "./constants";
import type { BazaarOptions, CollectionOptions, ContextOptions, Doc, LoginType } from "./types";
import { NotificationsAPI } from "./api/notifications";
import { OrganizationsAPI } from "./api/organizations";
import { BazaarContext } from "./api/context";
import { EmailAPI } from "./api/email";

/**
 * Types of errors that can return from the API
 */
export {
  ErrorTypes,
  BazaarError,
  isNoAppUserError,
  isNoPermissionError,
  arrayMirrorSubscribeListener,
  objectMirrorSubscribeListener,
  noSharingNotification,
} from "./utils";
export { CollectionAPI } from "./api/collection";
export { CollectionsAPI } from "./api/collections";
export { PermissionsAPI } from "./api/permissions";
export { SocialAPI } from "./api/social";
export { BazaarContext } from "./api/context";

/**
 * Enums
 */
export { OrderByType, PermissionType, LoginType, SendNotification, GranteeType } from "./types";

export type {
  User,
  Contact,
  Team,
  Org,
  AnyPermission,
  UserPermission,
  GroupPermission,
  OrgPermission,
  Permission,
  NewPermission,
  PermissionTemplate,
  GrantedPermission,
  PermissionGroup,
  SharingNotification,
  FilterObject,
  FilterComparison,
  OrderBy,
  BazaarMessage,
  Link,
  Doc,
  AnyDoc,
  DeepPartial,
  SubscribeListener,
  BazaarOptions,
  CollectionOptions,
  ContextOptions,
  PermissionsQuery,
  LinksQuery,
  GrantedPermissionsQuery,
  CalendarInvite,
  EmailMessage,
} from "./types";

/**
 * The primary class of the Bazaar JS SDK to help you more easily build web apps with Bazaar.
 */
export class BazaarApp {
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
   * Access to the notifications API
   * @alpha
   */
  private notifications: NotificationsAPI;

  /**
   * Access to the social API
   */
  social: SocialAPI;

  /**
   * Access to the organizations API
   * @alpha
   */
  private orgs: OrganizationsAPI;

  /**
   * Access to the email API
   * @alpha
   */
  private email: EmailAPI;

  // URI of this Bazaar instance (used to complete links URLs)
  private bazaarUri: string = bazaarUri;

  constructor(options: BazaarOptions) {
    if (options.bazaarUri) {
      this.bazaarUri = options.bazaarUri;
    } else {
      options.bazaarUri = this.bazaarUri;
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
    this.permissions = new PermissionsAPI(this.api, this.bazaarUri);
    this.notifications = new NotificationsAPI(this.api);
    this.social = new SocialAPI(this.api);
    this.orgs = new OrganizationsAPI(this.api);
    this.email = new EmailAPI(this.api);
  }

  /**
   * Sets a callback function an app can run when it connects or re-connects to the API.
   */
  onApiConnect(f: (bzr: BazaarApp) => Promise<void>) {
    this.api.onConnect = async () => {
      await f(this);
    };
  }

  /**
   * Sets a callback function an app can run when an API disconnection occurs.
   *
   * e.g. Invalid access token
   */
  onApiConnectError(f: (bzr: BazaarApp, message: string) => Promise<void>) {
    this.api.onConnectError = async (message) => {
      await f(this, message);
    };
  }

  //
  // Login methods
  //

  /**
   * Sets a callback function an app can run a login error occurs.
   *
   * e.g. Authorization code is invalid
   */
  onLoginError(f: (bzr: BazaarApp, message: string) => Promise<void>) {
    this.auth.onLoginError = async (message) => {
      await f(this, message);
    };
  }

  /**
   * Sets a callback function an app can run when a user has successfully logged in.
   *
   * e.g. Set state, redirect, etc.
   */
  onLogin(f: (bzr: BazaarApp) => Promise<void>) {
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
   * Checks if the user is logged in.
   * i.e. if an access token is in local storage.
   */
  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  /**
   * Logs out a user.
   * Deletes the access token from local storage and reloads the page.
   */
  logOut(): void {
    return this.auth.logOut();
  }

  /**
   * Gets a collection interface (API access to the specified collection)
   * @param collectionName - The name of the collection to create the interface for.
   * @param collectionOptions - An optional object for specifying an onCreate hook. The onCreate hook sets up a collection when it is created (e.g., to set up permissions)
   */
  collection<T extends Doc>(collectionName: string, collectionOptions?: CollectionOptions): CollectionAPI<T> {
    return new CollectionAPI<T>(this.api, collectionName, collectionOptions);
  }

  async createContext(options: ContextOptions) {
    await this.api.createContext(options);
    return new BazaarContext(this.api, this.bazaarUri, options);
  }
}
