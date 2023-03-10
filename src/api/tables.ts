import { API } from "./raw";

/**
 * The class that encapsulates the tables API
 */
export class TablesAPI {
  private api: API;

  constructor(api: API) {
    this.api = api;
  }

  /**
   * Create a table.
   */
  async create(tableName: string) {
    return this.api.tablesCreate(tableName);
  }

  /**
   * Drop a table.
   */
  async drop(tableName: string) {
    return this.api.tablesDrop(tableName);
  }

  /**
   * List all table names.
   * @returns Where `data` is an array of table names
   */
  async list() {
    const rec = await this.api.tablesList();
    return rec.data;
  }
}
