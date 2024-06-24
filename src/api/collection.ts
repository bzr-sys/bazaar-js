import { API } from "./raw";
import type {
  SubscribeListener,
  BazaarMessage,
  CollectionOptions,
  FilterObject,
  OrderBy,
  Doc,
  AnyDoc,
  DeepPartial,
} from "../types";
import { ErrorTypes, BazaarError } from "../utils";

/**
 * @internal
 */
export class CollectionAPI<T extends Doc = AnyDoc> {
  private api: API;
  private collectionName: string;
  private collectionOptions: CollectionOptions;

  constructor(api: API, collectionName: string, collectionOptions: CollectionOptions = {}) {
    this.api = api;
    this.collectionName = collectionName;
    this.collectionOptions = collectionOptions;
  }

  async getOne(docId: string) {
    return this.withCollection(async () => {
      const res = await this.api.collectionGetOne<T>(this.collectionName, docId, this.collectionOptions);
      return res.data;
    }) as Promise<T | null>;
  }

  async getAll(
    filter: FilterObject = {},
    options: {
      startOffset?: number;
      endOffset?: number;
      orderBy?: OrderBy;
    } = {},
  ) {
    return this.withCollection(async () => {
      const res = await this.api.collectionGetAll<T>(this.collectionName, {
        ...this.collectionOptions,
        ...options,
        filter,
      });
      return res.data;
    }) as Promise<T[]>;
  }

  async getPage(
    pageNumber: number,
    pageSize: number,
    filter: FilterObject = {},
    options: {
      orderBy?: OrderBy;
    } = {},
  ) {
    const startOffset = pageNumber * pageSize;
    const endOffset = (pageNumber + 1) * pageSize;
    return this.getAll(filter, { startOffset, endOffset, ...options });
  }

  /**
   * @returns An unsubscribe function
   */
  async subscribeOne(docId: string, listener: SubscribeListener<T>) {
    if (listener.onInitial) {
      const doc = await this.getOne(docId);
      if (doc) {
        listener.onInitial(doc);
      }
    }
    return this.withCollection(() =>
      this.api.collectionSubscribeOne<T>(this.collectionName, docId, this.collectionOptions, listener),
    ) as Promise<() => Promise<BazaarMessage>>;
  }

  /**
   * @returns An unsubscribe function
   */
  async subscribeAll(filter: FilterObject, listener: SubscribeListener<T>) {
    if (listener.onInitial) {
      const docs = await this.getAll(filter);
      for (const doc of docs) {
        listener.onInitial(doc);
      }
    }
    return this.withCollection(() =>
      this.api.collectionSubscribeAll<T>(this.collectionName, { filter, ...this.collectionOptions }, listener),
    ) as Promise<() => Promise<BazaarMessage>>;
  }

  /**
   * @returns The doc ID
   */
  async insertOne(doc: Omit<T, "id"> | T) {
    return this.withCollection(async () => {
      const res = await this.api.collectionInsertOne(this.collectionName, doc, this.collectionOptions);
      return res.data;
    }) as Promise<string>;
  }

  async updateOne(docId: string, doc: DeepPartial<T>) {
    return this.withCollection(() =>
      this.api.collectionUpdateOne(this.collectionName, docId, doc, this.collectionOptions),
    ) as Promise<BazaarMessage>;
  }

  async replaceOne(docId: string, doc: Omit<T, "id"> | T) {
    return this.withCollection(() =>
      this.api.collectionReplaceOne(this.collectionName, docId, doc, this.collectionOptions),
    ) as Promise<BazaarMessage>;
  }

  async deleteOne(docId: string) {
    return this.withCollection(() =>
      this.api.collectionDeleteOne(this.collectionName, docId, this.collectionOptions),
    ) as Promise<BazaarMessage>;
  }

  async deleteAll(filter: FilterObject = {}) {
    return this.withCollection(() =>
      this.api.collectionDeleteAll(this.collectionName, { filter, ...this.collectionOptions }),
    ) as Promise<BazaarMessage>;
  }

  //
  private async withCollection(collectionQuery: () => Promise<any>) {
    try {
      return await collectionQuery();
    } catch (error) {
      if (this.collectionOptions.userId) {
        // We cannot create collections for other users
        //
        // Note: userId could be your own ID which would give you permission to create a collection.
        // However, if userId is set it is safe to say the user does not know if it is the own ID (dynamic)
        // and thus a collection should not be created.
        // TODO: this should be reviewed with real-world usage.
        throw error;
      }
      if (error instanceof BazaarError && error.type == ErrorTypes.CollectionDoesNotExist) {
        await this.api.collectionsCreate(this.collectionName);
        if (this.collectionOptions.onCreate) {
          await this.collectionOptions.onCreate();
        }
        return collectionQuery();
      }
      throw error;
    }
  }
}
