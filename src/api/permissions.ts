import { linkPath, bazaarUri } from "../constants";
import {
  SendNotification,
  type BasicLink,
  type GrantedPermission,
  type Link,
  type NewPermission,
  type PermissionTemplate,
  type SharingNotification,
  type SubscribeListener,
  NewPermissionGroup,
  GrantedPermissionsQuery,
  LinksQuery,
  PermissionsQuery,
  ContextOptions,
} from "../types";
import { noSharingNotification } from "../utils";
import { API } from "./raw";

/**
 * The class that encapsulates the permissions API
 * @internal
 */
export class PermissionsAPI {
  private api: API;
  private linkUri: string;
  private contextOptions: ContextOptions;

  constructor(api: API, uri: string, contextOptions: ContextOptions = {}) {
    this.api = api;
    this.linkUri = (uri || bazaarUri) + linkPath;
    this.contextOptions = contextOptions;
  }

  /**
   * Creates permission for a collection query and a user.
   * @param {NewPermission} permission "Specifies the permission to be created"
   * @param {SharingNotification} notification "Specifies if/how the user is notified. Defaults to {createNotification: false, sendMessage: SendNotification.Never}"
   */
  async create(permission: NewPermission, notification: SharingNotification = noSharingNotification) {
    return this.api.permissionsCreate(permission, notification, this.contextOptions);
  }

  /**
   * Lists permissions.
   * @param options - If no optional params are set, all permissions for the user are returned.
   * @returns All permissions are returned if no options are passed.
   */
  async list(query: PermissionsQuery = {}) {
    const res = await this.api.permissionsList(query, this.contextOptions);
    return res.data;
  }

  /**
   * Deletes permission with a given ID
   * @param permissionId - ID of the permission to delete
   */
  async delete(permissionId: string) {
    return this.api.permissionsDelete(permissionId, this.contextOptions);
  }

  /**
   * Links
   */
  public links = {
    /**
     * Creates a link
     */
    create: async (permission: PermissionTemplate, description: string = "", limit: number = 1) => {
      const { data: basicLink } = await this.api.linksCreate(permission, description, limit, this.contextOptions);
      return { url: this.linkUri + basicLink.id, ...basicLink };
    },

    /**
     * Lists links
     */
    list: async (query: LinksQuery = {}): Promise<Link[]> => {
      const { data: basicLinks } = await this.api.linksList(query, this.contextOptions);
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
    subscribe: async (query: LinksQuery = {}, listener: SubscribeListener<Link>) => {
      if (listener.onInitial) {
        const links = await this.links.list(query);
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
      return this.api.linksSubscribe(query, this.contextOptions, newListener);
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
    list: async (query: GrantedPermissionsQuery = {}) => {
      const res = await this.api.grantedPermissionsList(query, this.contextOptions);
      return res.data;
    },

    subscribe: async (query: GrantedPermissionsQuery = {}, listener: SubscribeListener<GrantedPermission>) => {
      if (listener.onInitial) {
        const permissions = await this.granted.list(query);
        for (const permission of permissions) {
          listener.onInitial(permission);
        }
      }
      return this.api.grantedPermissionsSubscribe(query, this.contextOptions, listener);
    },

    delete: async (grantedPermissionId: string) => {
      return this.api.grantedPermissionsDelete(grantedPermissionId);
    },
  };

  /**
   * Groups
   * @alpha
   */
  private groups = {
    /**
     * Get group by Id
     * @returns group for a given ID
     */
    get: async (groupId: string) => {
      const res = await this.api.groupsGet(groupId, this.contextOptions);
      return res.data;
    },
    /**
     * Lists groups
     * @returns a list of groups user is part of (in current app)
     */
    list: async () => {
      const res = await this.api.groupsList(this.contextOptions);
      return res.data;
    },

    /**
     * Creates a new group
     * Groups require at least one member.
     */
    create: async (group: NewPermissionGroup) => {
      return this.api.groupsCreate(group, this.contextOptions);
    },
    addMember: async (groupId: string, userId: string) => {
      return this.api.groupsAddMember(groupId, userId, this.contextOptions);
    },
    removeMember: async (groupId: string, userId: string) => {
      return this.api.groupsRemoveMember(groupId, userId, this.contextOptions);
    },

    delete: async (groupId: string) => {
      return this.api.groupsDelete(groupId, this.contextOptions);
    },
  };
}
