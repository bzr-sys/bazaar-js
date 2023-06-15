import { linkPath, rethinkIdUri } from "../constants";
import { GrantedPermission, LinksGetOptions, Message, PermissionsGetOptions, PermissionTemplate } from "../types";
import { API } from "./raw";

/**
 * The class that encapsulates the sharing API
 */
export class SharingAPI {
  private api: API;
  private linkUri: string;

  private onSharedUnsubscribe: () => Promise<Message>;

  constructor(api: API, uri: string) {
    this.api = api;
    this.linkUri = (uri || rethinkIdUri) + linkPath;
  }

  /**
   * Set permission to share with user
   */
  async withUser(userId: string, permission: PermissionTemplate) {
    const p = { ...permission, userId };
    return this.api.permissionsSet([p]);
  }

  async createLink(permission: PermissionTemplate) {
    const p = { ...permission, userId: "*" };
    const link = await this.api.permissionsLink(p);
    return this.linkUri + link.data.id;
  }

  /**
   * List sharing permissions
   * @param {PermissionGetOptions} [options] If no optional params are set, all permissions for the user are returned.
   * @returns All permissions are returned if no options are passed.
   */
  async list(options: PermissionsGetOptions = {}) {
    const rec = await this.api.permissionsGet(options);
    return rec.data;
  }

  /**
   * Delete permissions for a table.
   * @param options An optional object for specifying a permission ID to delete. All permissions are deleted if no permission ID option is passed.
   */
  async delete(options: { permissionId?: string } = {}) {
    return this.api.permissionsDelete(options);
  }

  async listShared() {
    const rec = await this.api.grantedPermissionsList();
    return rec.data;
  }

  async deleteShared(permissionId: string) {
    return this.api.grantedPermissionsDelete(permissionId);
  }

  async onShared(f: (grantedPermission: GrantedPermission) => void) {
    if (this.onSharedUnsubscribe) {
      await this.onSharedUnsubscribe();
    }
    try {
      // Subscribe
      console.log("Subscribe onShared");
      this.onSharedUnsubscribe = await this.api.grantedPermissionsSubscribe(
        (changes: { new_val: object; old_val: object }) => {
          if (changes.new_val) {
            f(changes.new_val as GrantedPermission);
          }
        },
      );
      // List
      console.log("List onShared");
      let reqs = await this.api.grantedPermissionsList();
      reqs.data.forEach((req: GrantedPermission) => {
        f(req);
      });
    } catch (error) {
      // TODO what should we do
      console.log("onReceivedInvitation error:", error);
    }
  }

  async stopOnShared() {
    if (!this.onSharedUnsubscribe) {
      return;
    }
    await this.onSharedUnsubscribe();
    this.onSharedUnsubscribe = undefined;
    return;
  }

  async listLinks(options: LinksGetOptions) {
    const rec = await this.api.linksGet(options);
    return rec.data;
  }
}
