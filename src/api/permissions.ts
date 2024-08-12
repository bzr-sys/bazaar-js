import { linkPath, bazaarUri } from "../constants";
import {
  SendNotification,
  type BasicLink,
  type GrantedPermission,
  type Link,
  type NewPermission,
  type PermissionTemplate,
  type PermissionType,
  type SharingNotification,
  type SubscribeListener,
  CollectionIdOptions,
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
   * Creates permission for a collection query and a user.
   * @param {NewPermission} permission "Specifies the permission to be created"
   * @param {SharingNotification} notification "Specifies if/how the user is notified. Defaults to {createNotification: false, sendMessage: SendNotification.Never}"
   */
  async create(
    permission: NewPermission,
    notification: SharingNotification = { createNotification: false, sendMessage: SendNotification.NEVER },
    options: CollectionIdOptions,
  ) {
    return this.api.permissionsCreate(permission, notification, options);
  }

  /**
   * Lists permissions.
   * @param options - If no optional params are set, all permissions for the user are returned.
   * @returns All permissions are returned if no options are passed.
   */
  async list(
    query: {
      collectionName?: string;
      userId?: string;
      type?: PermissionType;
    } = {},
    options: CollectionIdOptions,
  ) {
    const res = await this.api.permissionsList(query, options);
    return res.data;
  }

  /**
   * Deletes permission with a given ID
   * @param permissionId - ID of the permission to delete
   */
  async delete(permissionId: string, options: CollectionIdOptions) {
    return this.api.permissionsDelete(permissionId, options);
  }

  /**
   * Links
   */
  public links = {
    /**
     * Creates a link
     */
    create: async (
      permission: PermissionTemplate,
      description: string = "",
      limit: number = 1,
      options: CollectionIdOptions,
    ) => {
      const { data: basicLink } = await this.api.linksCreate(permission, description, limit, options);
      return { url: this.linkUri + basicLink.id, ...basicLink };
    },

    /**
     * Lists links
     */
    list: async (
      query: {
        collectionName?: string;
        type?: PermissionType;
      } = {},
      options: CollectionIdOptions,
    ): Promise<Link[]> => {
      const { data: basicLinks } = await this.api.linksList(query, options);
      let links: Link[] = [];
      for (let l of basicLinks) {
        links.push({ url: this.linkUri + l.id, ...l });
      }
      return links;
    },

    /**
     * Subscribes to links changes
     * @returns an unsubscribe function
     */
    subscribe: async (
      query: {
        collectionName?: string;
        type?: PermissionType;
      } = {},
      options: CollectionIdOptions,
      listener: SubscribeListener<Link>,
    ) => {
      if (listener.onInitial) {
        const links = await this.links.list(query, options);
        for (const link of links) {
          listener.onInitial({ url: this.linkUri + link.id, ...link });
        }
      }

      const newListener: SubscribeListener<BasicLink> = {};
      if (listener.onAdd) {
        newListener.onAdd = (doc) => {
          return listener.onAdd({ url: this.linkUri + doc.id, ...doc });
        };
      }
      if (listener.onDelete) {
        newListener.onDelete = (doc) => {
          return listener.onDelete({ url: this.linkUri + doc.id, ...doc });
        };
      }
      if (listener.onChange) {
        newListener.onChange = (oldDoc, newDoc) => {
          return listener.onChange(
            { url: this.linkUri + oldDoc.id, ...oldDoc },
            { url: this.linkUri + newDoc.id, ...newDoc },
          );
        };
      }
      return this.api.linksSubscribe(query, options, newListener);
    },

    /**
     * Deletes a link
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
      if (listener.onInitial) {
        const permissions = await this.granted.list(options);
        for (const permission of permissions) {
          listener.onInitial(permission);
        }
      }
      return this.api.grantedPermissionsSubscribe(options, listener);
    },
  };
}
