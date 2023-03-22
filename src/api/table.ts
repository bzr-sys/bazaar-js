import { API } from ".";
import { SubscribeListener, Message, TableOptions, FilterObject, OrderBy } from "../types";
import { ErrorTypes, RethinkIDError } from "../utils";

export class TableAPI {
  private api: API;
  tableName: string;
  tableOptions: TableOptions;

  constructor(api: API, tableName: string, tableOptions: TableOptions = {}) {
    this.api = api;
    this.tableName = tableName;
    this.tableOptions = tableOptions;
  }

  /**
   *
   * @param methodOptions
   * @returns
   */
  async read(
    methodOptions: {
      rowId?: string;
      startOffset?: number;
      endOffset?: number;
      orderBy?: OrderBy;
      filter?: FilterObject;
    } = {},
  ) {
    return this.withTable(async () => {
      const rec = await this.api.tableRead(this.tableName, { ...this.tableOptions, ...methodOptions });
      return rec.data;
    }) as Promise<object | any[]>;
  }

  /**
   * @returns An unsubscribe function
   */
  async subscribe(methodOptions: { rowId?: string; filter?: FilterObject } = {}, listener: SubscribeListener) {
    return this.withTable(() =>
      this.api.tableSubscribe(this.tableName, { ...this.tableOptions, ...methodOptions }, listener),
    ) as Promise<() => Promise<Message>>;
  }

  async insert(row: object, methodOptions: {} = {}) {
    return this.withTable(async () => {
      const rec = await this.api.tableInsert(this.tableName, row, { ...this.tableOptions, ...methodOptions });
      return rec.data;
    }) as Promise<string>;
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
      if (this.tableOptions.userId) {
        // We cannot create tables for other users
        //
        // Note: userId could be your own ID which would give you permission to create a table.
        // However, if userId is set it is safe to say the user does not know if it is the own ID (dynamic)
        // and thus a table should not be created.
        // TODO: this should be reviewed with real-world usage.
        throw error;
      }
      if (error instanceof RethinkIDError && error.type == ErrorTypes.TableDoesNotExist) {
        await this.api.tablesCreate(this.tableName);
        if (this.tableOptions.onCreate) {
          await this.tableOptions.onCreate();
        }
        return tableQuery();
      }
      throw error;
    }
  }
}
