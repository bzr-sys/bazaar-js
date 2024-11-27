import { APIOptions, CollectionOptions, Doc } from "../types";
import { CollectionAPI } from "./collection";
import { CollectionsAPI } from "./collections";
import { PermissionsAPI } from "./permissions";
import { API } from "./raw";

/**
 * The primary class of the Bazaar JS SDK to help you more easily build web apps with Bazaar.
 */
export class BazaarContext {
  private api: API;

  /**
   * Access to the collections API
   */
  collections: CollectionsAPI;

  /**
   * Access to the permissions API
   */
  permissions: PermissionsAPI;

  constructor(options: APIOptions, onConnect: () => Promise<void>, onConnectError: (message: string) => Promise<void>) {
    this.api = new API(options, onConnect, onConnectError);
    this.collections = new CollectionsAPI(this.api);
    this.permissions = new PermissionsAPI(this.api, options.bazaarUri);
  }

  /**
   * Gets a collection interface (API access to the specified collection)
   * @param collectionName - The name of the collection to create the interface for.
   * @param collectionOptions - An optional object for specifying an onCreate hook. The onCreate hook sets up a collection when it is created (e.g., to set up permissions)
   */
  collection<T extends Doc>(collectionName: string, collectionOptions?: CollectionOptions): CollectionAPI<T> {
    return new CollectionAPI<T>(this.api, collectionName, collectionOptions);
  }
}
