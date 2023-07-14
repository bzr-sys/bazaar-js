import { API, ContactsAPI, PermissionsAPI, TableAPI, TablesAPI, UsersAPI } from "./api";
import { SharingAPI } from "./api/sharing";
import { Auth } from "./auth";
import { ApiOptions, AuthOptions, CommonOptions, LoginType, TableOptions } from "./types";

/**
 * Types of errors that can return from the API
 */
export { ErrorTypes, RethinkIDError } from "./utils";
export { ContactsAPI, PermissionsAPI, TableAPI, TablesAPI, UsersAPI } from "./api";

export {
  User,
  Contact,
  ConnectionRequest,
  Permission,
  PermissionType,
  PermissionCondition,
  TableOptions,
  FilterObject,
  OrderBy,
  Message,
} from "./types";

/**
 * RethinkID constructor options
 */
export type Options = CommonOptions &
  AuthOptions &
  ApiOptions & {
    /**
     * Public URI for the API & OAuth authorization server.
     * Will set AuthOptions.oAuthUri & ApiOptions.dataApiUri
     */
    rethinkIdUri?: string;

    /**
     * A callback function an app can specify to run when a user has successfully logged in.
     *
     * e.g. Set state, redirect, etc.
     */
    onLogin?: (rid: RethinkID) => Promise<void>;

    /**
     * Provide a callback to handle failed data API connections. E.g. unauthorized, or expired token.
     */
    onApiConnectError?: (rid: RethinkID, message: string) => void;
  };

/**
 * The primary class of the RethinkID JS SDK to help you more easily build web apps with RethinkID.
 */
export class RethinkID {
  /**
   * Auth handles authentication and login
   */

  auth: Auth;

  /**
   * A wrapper of the low level Data API
   */
  private api: API;

  /**
   * Access to the tables API
   */
  tables: TablesAPI;

  /**
   * Access to the permissions API
   */
  permissions: PermissionsAPI;

  /**
   * Access to the users API
   */
  users: UsersAPI;

  /**
   * Access to the contacts API
   */
  contacts: ContactsAPI;

  /**
   * Access to the sharing API
   */
  sharing: SharingAPI;

  constructor(options: Options) {
    if (options.rethinkIdUri) {
      options.dataApiUri = options.rethinkIdUri;
      options.oAuthUri = options.rethinkIdUri;
    }

    // Initialize API and make a connection to the Data API if logged in
    this.api = new API(options, (message: string) => {
      if (options.onApiConnectError) {
        options.onApiConnectError(this, message);
        return;
      }
      console.error("Connection error:", message);
    });

    // Initialize authentication (auto-login or auto-complete-login if possible)
    this.auth = new Auth(options, async () => {
      console.log("onLogin default")
      this.api._connect();
      if (options.onLogin) {
        await options.onLogin(this);
      }
    });

    this.tables = new TablesAPI(this.api);
    this.permissions = new PermissionsAPI(this.api);
    this.users = new UsersAPI(this.api);
    this.contacts = new ContactsAPI(this.api);
    this.sharing = new SharingAPI(this.api, options.rethinkIdUri);
  }

  //
  // Login methods
  //

  /**
   * Set a callback function an app can run when a user has successfully logged in.
   *
   * e.g. Set state, redirect, etc.
   */
  onLogin(f: (rid: RethinkID) => Promise<void>) {
    this.auth.onLogin = async () => {
      console.log("onLogin set")
      this.api._connect();
      await f(this);
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

  /**
   * Get a table interface (API access to the specified table)
   * @param {string} tableName The name of the table to create the interface for.
   * @param {TableOptions} [tableOptions] An optional object for specifying a user ID & onCreate hook. Specify a user ID to operate on a table owned by that user ID. Otherwise operates on a table owned by the authenticated user. The onCreate hook sets up a table when it is created (e.g., to set up permissions)
   */
  table(tableName: string, tableOptions?: TableOptions): TableAPI {
    return new TableAPI(this.api, tableName, tableOptions);
  }
}
