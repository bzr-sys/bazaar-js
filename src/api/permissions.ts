import { linkPath, bazaarUri } from "../constants";
import type {
  BasicLink,
  GrantedPermission,
  Link,
  NewPermission,
  Notification,
  PermissionTemplate,
  PermissionType,
  SubscribeListener,
} from "../types";
import { API } from "./raw";

/**
 * The class that encapsulates the permissions API
 * @internal
 */
export class PermissionsAPI {
  private api: API;
  private linkUri: string;

  constructor(api: API, uri: string) {
    this.api = api;
    this.linkUri = (uri || bazaarUri) + linkPath;
  }

  /**
   * Creates permission for a collection.
   */
  async create(permission: NewPermission, notification: Notification = { enabled: false }) {
    return this.api.permissionsCreate(permission, notification);
  }

  /**
   * Lists permissions.
   * @param options - If no optional params are set, all permissions for the user are returned.
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
   * Deletes permission with a given ID
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
     * Creates a link
     */
    create: async (permission: PermissionTemplate, limit: number = 0) => {
      const { data: basicLink } = await this.api.linksCreate(permission, limit);
      return { url: this.linkUri + basicLink.id, ...basicLink };
    },

    /**
     * Lists links
     */
    list: async (
      options: {
        collectionName?: string;
        type?: PermissionType;
      } = {},
    ): Promise<Link[]> => {
      const { data: basicLinks } = await this.api.linksList(options);
      let links: Link[] = [];
      for (let l of basicLinks) {
        links.push({ url: this.linkUri + l.id, ...l });
      }
      return links;
    },

    subscribe: async (
      options: {
        collectionName?: string;
        type?: PermissionType;
      } = {},
      listener: SubscribeListener<Link>,
    ) => {
      const newListener: SubscribeListener<BasicLink> = (newChanges) => {
        let changes = { oldDoc: null, newDoc: null };
        if (newChanges.newDoc) {
          changes.newDoc = { url: this.linkUri + newChanges.newDoc.id, ...newChanges.newDoc };
        }
        if (newChanges.oldDoc) {
          changes.oldDoc = { url: this.linkUri + newChanges.oldDoc.id, ...newChanges.oldDoc };
        }
        listener(changes);
      };
      return this.api.linksSubscribe(options, newListener);
    },

    /**
     * Deletes permissions for a table
     */
    delete: async (linkId: string) => {
      return this.api.linksDelete(linkId);
    },
  };

  /**
   * Granted Permissions
   */
  public granted = {
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
    delete: async (grantedPermissionId: string) => {
      return this.api.grantedPermissionsDelete(grantedPermissionId);
    },
    subscribe: async (
      options: {
        collectionName?: string;
        ownerId?: string;
        type?: PermissionType;
      } = {},
      listener: SubscribeListener<GrantedPermission>,
    ) => {
      return this.api.grantedPermissionsSubscribe(options, listener);
    },
  };
}
