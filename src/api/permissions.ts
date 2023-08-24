import { Permission, PermissionsGetOptions } from "../types";
import { API } from "./raw";

/**
 * The class that encapsulates the permissions API
 */
export class PermissionsAPI {
  private api: API;

  constructor(api: API) {
    this.api = api;
  }

  /**
   * Get permissions for a table. Private endpoint.
   * @param options If no optional params are set, all permissions for the user are returned.
   * @returns All permissions are returned if no options are passed.
   */
  async get(options: PermissionsGetOptions = {}) {
    const rec = await this.api.permissionsGet(options);
    return rec.data;
  }

  /**
   * Set (insert/update) permissions for a table. Private endpoint.
   */
  async set(permissions: Permission[]) {
    return this.api.permissionsSet(permissions);
  }

  /**
   * Delete permissions for a table. Private endpoint.
   * @param options An optional object for specifying a permission ID to delete. All permissions are deleted if no permission ID option is passed.
   */
  async delete(options: { permissionId?: string } = {}) {
    return this.api.permissionsDelete(options);
  }
}
