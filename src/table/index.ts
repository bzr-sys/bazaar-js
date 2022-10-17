import RethinkID from "..";
import { SubscribeListener, MessageOrError } from "../types";

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

  async read(methodOptions: { rowId?: string } = {}) {
    return this.withTable(this.rid.tableRead(this.tableName, { ...this.tableOptions, ...methodOptions })) as Promise<{
      data?: object | any[];
      error?: string;
    }>;
  }

  /**
   * @returns An unsubscribe function
   */
  async subscribe(methodOptions: {} = {}, listener: SubscribeListener) {
    return this.withTable(
      this.rid.tableSubscribe(this.tableName, { ...this.tableOptions, ...methodOptions }, listener),
    ) as Promise<() => Promise<MessageOrError>>;
  }

  async insert(row: object, methodOptions: {} = {}) {
    return this.withTable(
      this.rid.tableInsert(this.tableName, row, { ...this.tableOptions, ...methodOptions }),
    ) as Promise<{
      data?: string;
      error?: string;
    }>;
  }

  async update(row: object, methodOptions: {} = {}) {
    return this.withTable(
      this.rid.tableUpdate(this.tableName, row, { ...this.tableOptions, ...methodOptions }),
    ) as Promise<MessageOrError>;
  }

  async replace(methodOptions: {} = {}) {
    return this.withTable(
      this.rid.tableReplace(this.tableName, { ...this.tableOptions, ...methodOptions }),
    ) as Promise<MessageOrError>;
  }

  async delete(methodOptions: { rowId?: string } = {}) {
    return this.withTable(
      this.rid.tableDelete(this.tableName, { ...this.tableOptions, ...methodOptions }),
    ) as Promise<MessageOrError>;
  }

  //
  async withTable(tableQuery: Promise<any>) {
    try {
      await tableQuery;
    } catch (error) {
      // Table `af450dd0-88ad-4f15-ac24-7e4aef4ddec9_7cb5a8f3-c174-4f12-aa72-d188a89ccae9.hosted_games` does not exist in:
      if (error.message && error.message.match(/Table `.*` does not exist in/)) {
        try {
          await this.rid.tablesCreate(this.tableName);
        } catch (createError) {
          return createError.message;
        }
        await this.onCreate();
        return tableQuery;
      }
    }
  }
}
