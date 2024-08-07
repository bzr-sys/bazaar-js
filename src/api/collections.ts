import { CollectionIdOptions } from "../types";
import type { API } from "./raw";

/**
 * The class that encapsulates the collections API
 * @internal
 */
export class CollectionsAPI {
  private api: API;

  constructor(api: API) {
    this.api = api;
  }

  /**
   * Creates a collection.
   */
  async create(collectionName: string, options: CollectionIdOptions = {}) {
    return this.api.collectionsCreate(collectionName, options);
  }

  /**
   * Drops a collection.
   */
  async drop(collectionName: string, options: CollectionIdOptions = {}) {
    return this.api.collectionsDrop(collectionName, options);
  }

  /**
   * Lists all collection names.
   * @returns Where `data` is an array of collection names
   */
  async list(options: CollectionIdOptions = {}) {
    const res = await this.api.collectionsList(options);
    return res.data;
  }
}
