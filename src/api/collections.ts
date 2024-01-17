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
  async create(collectionName: string) {
    return this.api.collectionsCreate(collectionName);
  }

  /**
   * Drops a collection.
   */
  async drop(collectionName: string) {
    return this.api.collectionsDrop(collectionName);
  }

  /**
   * Lists all collection names.
   * @returns Where `data` is an array of collection names
   */
  async list() {
    const res = await this.api.collectionsList();
    return res.data;
  }
}
