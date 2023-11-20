import { API } from "./raw";
import { SubscribeListener, Message, CollectionOptions, FilterObject, OrderBy, Doc } from "../types";
import { ErrorTypes, RethinkIDError } from "../utils";

export class CollectionAPI {
  private api: API;
  private collectionName: string;
  private collectionOptions: CollectionOptions;

  constructor(api: API, collectionName: string, collectionOptions: CollectionOptions = {}) {
    this.api = api;
    this.collectionName = collectionName;
    this.collectionOptions = collectionOptions;
  }

  /**
   *
   * @param docId
   * @returns
   */
  async getOne(docId: string) {
    return this.withCollection(async () => {
      const res = await this.api.collectionGetOne(this.collectionName, docId, this.collectionOptions);
      return res.data;
    }) as Promise<Doc | null>;
  }

  /**
   *
   * @param filter
   * @param options
   * @returns
   */
  async getAll(
    filter: FilterObject = {},
    options: {
      startOffset?: number;
      endOffset?: number;
      orderBy?: OrderBy;
    } = {},
  ) {
    return this.withCollection(async () => {
      const res = await this.api.collectionGetAll(this.collectionName, {
        ...this.collectionOptions,
        ...options,
        filter,
      });
      return res.data;
    }) as Promise<Doc[]>;
  }

  /**
   *
   * @param pageNumber
   * @param pageSize
   * @param filter
   * @param options
   * @returns
   */
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
  async subscribeOne(docId: string, listener: SubscribeListener) {
    return this.withCollection(() =>
      this.api.collectionSubscribeOne(this.collectionName, docId, this.collectionOptions, listener),
    ) as Promise<() => Promise<Message>>;
  }

  /**
   * @returns An unsubscribe function
   */
  async subscribeAll(filter: FilterObject, listener: SubscribeListener) {
    return this.withCollection(() =>
      this.api.collectionSubscribeAll(this.collectionName, { filter, ...this.collectionOptions }, listener),
    ) as Promise<() => Promise<Message>>;
  }

  async insertOne(doc: object) {
    return this.withCollection(async () => {
      const res = await this.api.collectionInsertOne(this.collectionName, doc, this.collectionOptions);
      return res.data;
    }) as Promise<string>;
  }

  async updateOne(docId: string, doc: object) {
    return this.withCollection(() =>
      this.api.collectionUpdateOne(this.collectionName, docId, doc, this.collectionOptions),
    ) as Promise<Message>;
  }

  async replaceOne(docId: string, doc: object) {
    return this.withCollection(() =>
      this.api.collectionReplaceOne(this.collectionName, docId, doc, this.collectionOptions),
    ) as Promise<Message>;
  }

  async deleteOne(docId: string) {
    return this.withCollection(() =>
      this.api.collectionDeleteOne(this.collectionName, docId, this.collectionOptions),
    ) as Promise<Message>;
  }

  async deleteAll(filter: FilterObject = {}) {
    return this.withCollection(() =>
      this.api.collectionDeleteAll(this.collectionName, { filter, ...this.collectionOptions }),
    ) as Promise<Message>;
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
      if (error instanceof RethinkIDError && error.type == ErrorTypes.CollectionDoesNotExist) {
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
