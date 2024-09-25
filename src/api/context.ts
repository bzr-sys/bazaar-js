import { CollectionOptions, ContextOptions, Doc } from "../types";
import { CollectionAPI } from "./collection";
import { CollectionsAPI } from "./collections";
import { PermissionsAPI } from "./permissions";
import { API } from "./raw";

/**
 * The primary class of the Bazaar JS SDK to help you more easily build web apps with Bazaar.
 */
export class BazaarContext {
  private api: API;
  private contextOptions: ContextOptions;
  // private bazaarUri: string

  /**
   * Access to the collections API
   */
  collections: CollectionsAPI;

  /**
   * Access to the permissions API
   */
  permissions: PermissionsAPI;

  constructor(api: API, bazaarUri: string, contextOptions: ContextOptions) {
    this.api = api;
    this.contextOptions = contextOptions;
    // this.bazaarUri = bazaarUri

    this.collections = new CollectionsAPI(this.api, contextOptions);
    this.permissions = new PermissionsAPI(this.api, bazaarUri, contextOptions);
  }

  /**
   * Gets a collection interface (API access to the specified collection)
   * @param collectionName - The name of the collection to create the interface for.
   * @param collectionOptions - An optional object for specifying an onCreate hook. The onCreate hook sets up a collection when it is created (e.g., to set up permissions)
   */
  collection<T extends Doc>(collectionName: string, collectionOptions?: CollectionOptions): CollectionAPI<T> {
    return new CollectionAPI<T>(this.api, collectionName, collectionOptions, this.contextOptions);
  }
}
