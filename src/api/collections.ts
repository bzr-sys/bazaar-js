import { API } from "./raw";

/**
 * The class that encapsulates the collections API
 */
export class CollectionsAPI {
  private api: API;

  constructor(api: API) {
    this.api = api;
  }

  /**
   * Create a collection.
   */
  async create(collectionName: string) {
    return this.api.collectionsCreate(collectionName);
  }

  /**
   * Drop a collection.
   */
  async drop(collectionName: string) {
    return this.api.collectionsDrop(collectionName);
  }

  /**
   * List all collection names.
   * @returns Where `data` is an array of collection names
   */
  async list() {
    const rec = await this.api.collectionsList();
    return rec.data;
  }
}
