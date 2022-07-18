import RethinkID from "..";
import { SubscribeListener } from "../types";

export class Table {
  rid: RethinkID;
  tableName: string;
  tableOptions: { userId?: string };

  constructor(rid: RethinkID, tableName: string, tableOptions: { userId?: string }) {
    this.rid = rid;
    this.tableName = tableName;
    this.tableOptions = tableOptions;
  }

  async read(methodOptions: { rowId?: string } = {}) {
    return this.rid.tableRead(this.tableName, { ...this.tableOptions, ...methodOptions });
  }

  /**
   * @returns An unsubscribe function
   */
  async subscribe(methodOptions: {} = {}, listener: SubscribeListener) {
    return this.rid.tableSubscribe(this.tableName, { ...this.tableOptions, ...methodOptions }, listener);
  }

  async insert(row: object, methodOptions: {} = {}) {
    return this.rid.tableInsert(this.tableName, row, { ...this.tableOptions, ...methodOptions });
  }

  async update(row: object, methodOptions: {} = {}) {
    return this.rid.tableUpdate(this.tableName, row, { ...this.tableOptions, ...methodOptions });
  }

  async replace(methodOptions: {} = {}) {
    return this.rid.tableReplace(this.tableName, { ...this.tableOptions, ...methodOptions });
  }

  async delete(methodOptions: { rowId?: string } = {}) {
    return this.rid.tableDelete(this.tableName, { ...this.tableOptions, ...methodOptions });
  }
}
