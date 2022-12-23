import RethinkID from "..";
import { SubscribeListener, Message } from "../types";
import { ErrorTypes, RethinkIDError } from "../utils";

export class Table {
  rid: RethinkID;
  tableName: string;
  tableOptions: { userId?: string };
  onCreate: () => Promise<void>;

  constructor(rid: RethinkID, tableName: string, onCreate: () => Promise<void>, tableOptions?: { userId?: string }) {
    this.rid = rid;
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
    } = {},
  ) {
    return this.withTable(() =>
      this.rid.tableRead(this.tableName, { ...this.tableOptions, ...methodOptions }),
    ) as Promise<{
      data: object | any[];
    }>;
  }

  /**
   * @returns An unsubscribe function
   */
  async subscribe(methodOptions: {} = {}, listener: SubscribeListener) {
    return this.withTable(() =>
      this.rid.tableSubscribe(this.tableName, { ...this.tableOptions, ...methodOptions }, listener),
    ) as Promise<() => Promise<Message>>;
  }

  async insert(row: object, methodOptions: {} = {}) {
    return this.withTable(() =>
      this.rid.tableInsert(this.tableName, row, { ...this.tableOptions, ...methodOptions }),
    ) as Promise<{
      data: string;
    }>;
  }

  async update(row: object, methodOptions: {} = {}) {
    return this.withTable(() =>
      this.rid.tableUpdate(this.tableName, row, { ...this.tableOptions, ...methodOptions }),
    ) as Promise<Message>;
  }

  async replace(methodOptions: {} = {}) {
    return this.withTable(() =>
      this.rid.tableReplace(this.tableName, { ...this.tableOptions, ...methodOptions }),
    ) as Promise<Message>;
  }

  async delete(methodOptions: { rowId?: string } = {}) {
    return this.withTable(() =>
      this.rid.tableDelete(this.tableName, { ...this.tableOptions, ...methodOptions }),
    ) as Promise<Message>;
  }

  //
  async withTable(tableQuery: () => Promise<any>) {
    try {
      return await tableQuery();
    } catch (error) {
      if (error instanceof RethinkIDError && error.type == ErrorTypes.TableDoesNotExist) {
        await this.rid.tablesCreate(this.tableName);
        await this.onCreate();
        return tableQuery();
      }
      throw error;
    }
  }
}
