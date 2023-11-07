import { linkPath, rethinkIdUri } from "../constants";
import {
  GrantedPermission,
  Message,
  NewPermission,
  Permission,
  PermissionTemplate,
  PermissionType,
  SubscribeListener,
} from "../types";
import { API } from "./raw";

/**
 * The class that encapsulates the permissions API
 */
export class PermissionsAPI {
  private api: API;
  private linkUri: string;
  private appId: string;

  constructor(api: API, uri: string, appId: string) {
    this.api = api;
    this.linkUri = (uri || rethinkIdUri) + linkPath;
    this.appId = appId;
  }

  /**
   * Open the permission modal
   */
  openModal(permission: PermissionTemplate) {
    // this.modal.showModal();
    this.api.openModal(`/m/permission?appId=${this.appId}&permission=${JSON.stringify(permission)}`);
    return;
  }

  /**
   * Create permission for a collection.
   */
  async create(permission: NewPermission) {
    return this.api.permissionsCreate(permission);
  }

  /**
   * List permissions.
   * @param options If no optional params are set, all permissions for the user are returned.
   * @returns All permissions are returned if no options are passed.
   */
  async list(
    options: {
      collectionName?: string;
      userId?: string;
      type?: PermissionType;
    } = {},
  ) {
    const res = await this.api.permissionsList(options);
    return res.data;
  }

  /**
   * Delete permission with a given ID
   * @param permissionId - ID of the permission to delete
   */
  async delete(permissionId: string) {
    return this.api.permissionsDelete(permissionId);
  }

  /**
   * Links
   */
  public links = {
    /**
     * Create a link
     */
    create: async (permission: PermissionTemplate, limit: number = 0) => {
      const { data: link } = await this.api.linksCreate(permission, limit);
      link.url = this.linkUri + link.id;
      return link;
    },

    /**
     * List links
     */
    list: async (
      options: {
        collectionName?: string;
        type?: PermissionType;
      } = {},
    ) => {
      const res = await this.api.linksList(options);
      let links = res.data;
      for (let i in links) {
        links[i].url = this.linkUri + links[i].id;
      }
      return res.data;
    },

    /**
     * Delete permissions for a table
     */
    delete: async (linkId: string) => {
      return this.api.linksDelete(linkId);
    },
  };

  /**
   * Granted Permissions
   */
  public granted = {
    /**
     *
     */
    list: async (
      options: {
        collectionName?: string;
        ownerId?: string;
        type?: PermissionType;
      } = {},
    ) => {
      const res = await this.api.grantedPermissionsList(options);
      return res.data;
    },

    /**
     *
     */
    delete: async (permissionId: string) => {
      return this.api.grantedPermissionsDelete(permissionId);
    },

    /**
     *
     */
    subscribe: async (
      options: {
        collectionName?: string;
        ownerId?: string;
        type?: PermissionType;
      } = {},
      listener: SubscribeListener<Permission>,
    ) => {
      return this.api.grantedPermissionsSubscribe(options, listener);
    },
  };

  private onGrantedUnsubscribe: () => Promise<Message>;

  async onGranted(f: (grantedPermission: GrantedPermission) => void) {
    if (this.onGrantedUnsubscribe) {
      await this.onGrantedUnsubscribe();
    }
    try {
      // Subscribe
      console.log("Subscribe onShared");
      this.onGrantedUnsubscribe = await this.api.grantedPermissionsSubscribe(
        {},
        (changes: { new_val: object; old_val: object }) => {
          console.log("***onGranted triggered");
          if (changes.new_val) {
            f(changes.new_val as GrantedPermission);
          }
        },
      );
      // List
      console.log("List onGranted");
      let reqs = await this.api.grantedPermissionsList();
      reqs.data.forEach((req: GrantedPermission) => {
        f(req);
      });
    } catch (error) {
      // TODO what should we do
      console.log("onGranted error:", error);
    }
  }

  async stopOnGranted() {
    if (!this.onGrantedUnsubscribe) {
      return;
    }
    await this.onGrantedUnsubscribe();
    this.onGrantedUnsubscribe = undefined;
    return;
  }
}
