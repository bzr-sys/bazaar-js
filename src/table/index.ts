import API from "../api";
import { SubscribeListener, Message } from "../types";
import { ErrorTypes, RethinkIDError } from "../utils";

export class Table {
  api: API;
  tableName: string;
  tableOptions: { userId?: string };
  onCreate: () => Promise<void>;

  constructor(api: API, tableName: string, onCreate: () => Promise<void>, tableOptions?: { userId?: string }) {
    this.api = api;
    this.tableName = tableName;
    this.tableOptions = tableOptions;
    this.onCreate = onCreate;
  }

  async read(
    methodOptions: {
      rowId?: string;
      startOffset?: number;
      endOffset?: number;
      orderBy?: { [field: string]: "asc" | "desc" };
      filter?: {
        [field: string]: {
          $eq?: string | number;
          $ne?: string | number;
          $gt?: string | number;
          $ge?: string | number;
          $lt?: string | number;
          $le?: string | number;
        };
      }[];
    } = {},
  ) {
    return this.withTable(() =>
      this.api.tableRead(this.tableName, { ...this.tableOptions, ...methodOptions }),
    ) as Promise<{
      data: object | any[];
    }>;
  }

  /**
   * @returns An unsubscribe function
   */
  async subscribe(methodOptions: {} = {}, listener: SubscribeListener) {
    return this.withTable(() =>
      this.api.tableSubscribe(this.tableName, { ...this.tableOptions, ...methodOptions }, listener),
    ) as Promise<() => Promise<Message>>;
  }

  async insert(row: object, methodOptions: {} = {}) {
    return this.withTable(() =>
      this.api.tableInsert(this.tableName, row, { ...this.tableOptions, ...methodOptions }),
    ) as Promise<{
      data: string;
    }>;
  }

  async update(row: object, methodOptions: {} = {}) {
    return this.withTable(() =>
      this.api.tableUpdate(this.tableName, row, { ...this.tableOptions, ...methodOptions }),
    ) as Promise<Message>;
  }

  async replace(methodOptions: {} = {}) {
    return this.withTable(() =>
      this.api.tableReplace(this.tableName, { ...this.tableOptions, ...methodOptions }),
    ) as Promise<Message>;
  }

  async delete(methodOptions: { rowId?: string } = {}) {
    return this.withTable(() =>
      this.api.tableDelete(this.tableName, { ...this.tableOptions, ...methodOptions }),
    ) as Promise<Message>;
  }

  //
  async withTable(tableQuery: () => Promise<any>) {
    try {
      return await tableQuery();
    } catch (error) {
      if (error instanceof RethinkIDError && error.type == ErrorTypes.TableDoesNotExist) {
        await this.api.tablesCreate(this.tableName);
        await this.onCreate();
        return tableQuery();
      }
      throw error;
    }
  }
}
