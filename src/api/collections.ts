import { ContextOptions } from "../types";
import type { API } from "./raw";

/**
 * The class that encapsulates the collections API
 * @internal
 */
export class CollectionsAPI {
  private api: API;
  private contextOptions: ContextOptions;

  constructor(api: API, contextOptions: ContextOptions = {}) {
    this.api = api;
    this.contextOptions = contextOptions;
  }

  /**
   * Creates a collection.
   */
  async create(collectionName: string) {
    return this.api.collectionsCreate(collectionName, this.contextOptions);
  }

  /**
   * Drops a collection.
   */
  async drop(collectionName: string) {
    return this.api.collectionsDrop(collectionName, this.contextOptions);
  }

  /**
   * Lists all collection names.
   * @returns Where `data` is an array of collection names
   */
  async list() {
    const res = await this.api.collectionsList(this.contextOptions);
    return res.data;
  }
}
