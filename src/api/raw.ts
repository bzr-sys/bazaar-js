import io from "socket.io-client";

import {
  APIOptions,
  Permission,
  NewPermission,
  SubscribeListener,
  Message,
  FilterObject,
  Contact,
  User,
  OrderBy,
  GrantedPermission,
  PermissionType,
  PermissionTemplate,
  Doc,
  BasicLink,
} from "../types";
import { RethinkIDError } from "../utils";
import { rethinkIdUri, namespacePrefix } from "../constants";

/**
 * The class that encapsulates the low level data API
 */
export class API {
  /**
   * Version of the API
   */
  private version = "v1";

  /**
   * URI for the Data API, RethinkID's realtime data storage service.
   * Currently implemented with Socket.IO + RethinkDB
   */
  private rethinkIdUri = rethinkIdUri;

  /**
   * Local storage key names, namespaced in the constructor
   */
  private tokenKeyName: string;

  /**
   * A Socket.IO connection to the Data API
   */
  private dataApi;

  /**
   * A callback to do something upon Data API connection
   */
  onConnect: () => Promise<void>;

  /**
   * A callback to do something when a Data API connection error occurs
   */
  onConnectError: (message: string) => Promise<void>;

  /**
   * The modal and iframe element to perform actions within the RethinkID context
   */
  private modal: HTMLDialogElement;
  private iframe: HTMLIFrameElement;

  constructor(
    options: APIOptions,
    onConnect: () => Promise<void>,
    onConnectError: (message: string) => Promise<void>,
  ) {
    if (options.rethinkIdUri) {
      this.rethinkIdUri = options.rethinkIdUri;
    }

    this.onConnect = onConnect;
    this.onConnectError = onConnectError;

    /**
     * Namespace local storage key names
     */
    const namespace = namespacePrefix + options.appId;
    this.tokenKeyName = `${namespace}_token`;

    // Make a connection to the Data API if logged in
    this.connect();

    // Initialize modal
    this.modal = document.createElement("dialog");
    this.modal.style.width = "min(700px, 100vw)";
    this.modal.style.borderWidth = "0";
    this.modal.style.padding = "0";
    this.modal.style.margin = "auto";

    const header = document.createElement("div");
    header.style.width = "100%";
    header.style.display = "flex";
    header.style.alignItems = "flex-end";
    this.modal.appendChild(header);

    const button = document.createElement("button");
    button.style.marginLeft = "auto";
    button.style.borderWidth = "0";
    button.style.backgroundColor = "white";
    button.innerHTML = "X";
    button.onclick = () => this.closeModal();
    header.appendChild(button);

    this.iframe = document.createElement("iframe");
    // Note: using a sandbox with allow-scripts and allow-same-origin
    // is unsecure like not having a sandbox.
    // We should strive to remove the allow-same-origin by
    // passing/using the auth token via other means
    // this.iframe.sandbox.add("allow-scripts"); // Required to run the RID page
    // this.iframe.sandbox.add("allow-same-origin"); // Required to read the token from local storage
    this.iframe.style.width = "100%";
    this.iframe.style.height = "min(700px, 100vh)";
    this.iframe.style.borderWidth = "0";
    this.modal.appendChild(this.iframe);

    document.body.appendChild(this.modal);
  }

  /**
   * Creates a Data API connection with an auth token
   */
  connect(): void {
    const token = localStorage.getItem(this.tokenKeyName);

    if (!token) {
      return;
    }

    this.dataApi = io(this.rethinkIdUri, {
      auth: { token },
    });

    this.dataApi.on("connect", () => {
      console.log("sdk: connected. dataApi.id:", this.dataApi.id);
      this.onConnect();
    });

    this.dataApi.on("connect_error", (error) => {
      let errorMessage = error.message;

      if (error.message.includes("Unauthorized")) {
        errorMessage = "Unauthorized";
      } else if (error.message.includes("TokenExpiredError")) {
        errorMessage = "Token expired";
      }

      this.onConnectError(errorMessage);
    });
  }

  /**
   * Make sure a connection to the Data API has been made.
   */
  private waitForConnection: () => Promise<true> = () => {
    return new Promise((resolve, reject) => {
      if (this.dataApi.connected) {
        resolve(true);
      } else {
        this.dataApi.on("connect", () => {
          resolve(true);
        });
        // Don't wait for connection indefinitely
        setTimeout(() => {
          reject(new Error("Timeout waiting for on connect"));
        }, 3000);
      }
    });
  };

  /**
   * Promisifies a dataApi.io emit event
   * @param event A dataApi.io event name, like `collections:create`
   * @param payload
   */
  private asyncEmit = async (event: string, payload: any) => {
    await this.waitForConnection();
    return new Promise((resolve, reject) => {
      this.dataApi.emit(event, payload, (response: any) => {
        if (response.error) {
          reject(new RethinkIDError(response.error.type, response.error.message));
        } else {
          resolve(response);
        }
      });
    });
  };

  //
  // Collection API
  //

  /**
   * Get a collection doc
   * @param {string} collectionName The name of the collection to read
   * @param {string} docId - The docId
   * @param {Object} [options={}] An optional object for specifying query options.
   * @param {string} [options.userId] - An optional user ID of the owner of the collection to read. Defaults to own ID.
   * @returns Specify a doc ID to get a specific doc, otherwise all docs are returned. Specify a user ID to operate on a collection owned by that user ID. Otherwise operates on a collection owned by the authenticated user.
   */
  async collectionGetOne<T extends Doc>(
    collectionName: string,
    docId: string,
    options: {
      userId?: string;
    } = {},
  ) {
    const payload = { collectionName, docId };
    Object.assign(payload, options);
    return this.asyncEmit(this.version + ":collection:getOne", payload) as Promise<{ data: T | null }>;
  }

  /**
   * Get all collection docs for a given filter
   * @param {string} collectionName The name of the collection to read
   * @param {Object} [options={}] An optional object for specifying query options.
   * @param {number} [options.startOffset] - An optional start offset. Default 0 (including)
   * @param {number} [options.endOffset] - An optional end offset. Default null (excluding)
   * @param {OrderBy} [options.orderBy] - An optional OrderBy object
   * @param {FilterObject} [options.filter] - An optional Filter object
   * @param {string} [options.userId] - An optional user ID of the owner of the collection to read. Defaults to own ID.
   * @returns Specify a doc ID to get a specific doc, otherwise all docs are returned. Specify a user ID to operate on a collection owned by that user ID. Otherwise operates on a collection owned by the authenticated user.
   */
  async collectionGetAll<T extends Doc>(
    collectionName: string,
    options: {
      startOffset?: number;
      endOffset?: number;
      orderBy?: OrderBy;
      filter?: FilterObject;
      userId?: string;
    } = {},
  ) {
    const payload = { collectionName };
    Object.assign(payload, options);
    return this.asyncEmit(this.version + ":collection:getAll", payload) as Promise<{ data: T[] }>;
  }

  /**
   * Subscribe to doc changes.
   * @param {string} collectionName The name of the collection to subscribe to
   * @param {string} docId - The docId
   * @param {Object} [options={}] An optional object for specifying query options.
   * @param {string} [options.userId] - An optional user ID of the owner of the collection to read. Defaults to own ID.
   * @returns An unsubscribe function
   */
  async collectionSubscribeOne<T extends Doc>(
    collectionName: string,
    docId: string,
    options: { userId?: string } = {},
    listener: SubscribeListener<T>,
  ) {
    const payload = { collectionName, docId };
    Object.assign(payload, options);

    const response = (await this.asyncEmit(this.version + ":collection:subscribeOne", payload)) as { data: string }; // where data is the subscription handle
    const subscriptionHandle = response.data;

    this.dataApi.on(subscriptionHandle, listener);

    return async () => {
      this.dataApi.off(subscriptionHandle, listener);
      const resp = (await this.asyncEmit(this.version + ":collection:unsubscribe", subscriptionHandle)) as Message;
      return resp.message;
    };
  }

  /**
   * Subscribe to collection changes. Private by default, or public with read permission.
   * @param {string} collectionName The name of the collection to subscribe to
   * @param {Object} [options={}] An optional object for specifying query options.
   * @param {FilterObject} [options.filter] - An optional Filter object
   * @param {string} [options.userId] - An optional user ID of the owner of the collection to read. Defaults to own ID.
   * @returns An unsubscribe function
   */
  async collectionSubscribeAll<T extends Doc>(
    collectionName: string,
    options: { filter?: FilterObject; userId?: string } = {},
    listener: SubscribeListener<T>,
  ) {
    const payload = { collectionName };
    Object.assign(payload, options);

    const response = (await this.asyncEmit(this.version + ":collection:subscribeAll", payload)) as { data: string }; // where data is the subscription handle
    const subscriptionHandle = response.data;

    this.dataApi.on(subscriptionHandle, listener);

    return async () => {
      this.dataApi.off(subscriptionHandle, listener);
      const resp = (await this.asyncEmit(this.version + ":collection:unsubscribe", subscriptionHandle)) as Message;
      return resp.message;
    };
  }

  /**
   * Insert a collection doc.
   * @param collectionName The name of the collection to operate on.
   * @param doc The doc to insert.
   * @param options An optional object for specifying a user ID. Specify a user ID to operate on a collection owned by that user ID. Otherwise operates on a collection owned by the authenticated user.
   * @returns Where `data` is the array of new doc IDs (only generated IDs)
   */
  async collectionInsertOne(collectionName: string, doc: object, options: { userId?: string } = {}) {
    const payload = { collectionName, doc };
    Object.assign(payload, options);

    return this.asyncEmit(this.version + ":collection:insertOne", payload) as Promise<{ data: string }>;
  }

  /**
   * Update all collection docs, or a single doc if doc ID exists.
   * @param collectionName The name of the collection to operate on.
   * @param docId - ID of document to update
   * @param doc Document changes
   * @param options An optional object for specifying a user ID. Specify a user ID to operate on a collection owned by that user ID. Otherwise operates on a collection owned by the authenticated user.
   */
  async collectionUpdateOne(collectionName: string, docId: string, doc: object, options: { userId?: string } = {}) {
    const payload = { collectionName, docId, doc };
    Object.assign(payload, options);

    return this.asyncEmit(this.version + ":collection:updateOne", payload) as Promise<Message>;
  }

  /**
   * Replace a collection doc. Private by default, or public with insert, update, delete permissions.
   * @param collectionName The name of the collection to operate on.
   * @param docId - ID of document to replace
   * @param doc The new doc
   * @param options An optional object for specifying a user ID. Specify a user ID to operate on a collection owned by that user ID. Otherwise operates on a collection owned by the authenticated user.
   */
  async collectionReplaceOne(collectionName: string, docId: string, doc: object, options: { userId?: string } = {}) {
    const payload = { collectionName, docId, doc };
    Object.assign(payload, options);

    return this.asyncEmit(this.version + ":collection:replaceOne", payload) as Promise<Message>;
  }

  /**
   * Deletes a doc
   * @param collectionName The name of the collection to operate on.
   * @param docId - ID of document to delete
   * @param options An optional object for specifying a doc ID and/or user ID. Specify a doc ID to delete a specific doc, otherwise all docs are deleted. Specify a user ID to operate on a collection owned by that user ID. Otherwise operates on a collection owned by the authenticated user.
   */
  async collectionDeleteOne(collectionName: string, docId: string, options: { userId?: string } = {}) {
    const payload = { collectionName, docId };
    Object.assign(payload, options);

    return this.asyncEmit(this.version + ":collection:deleteOne", payload) as Promise<Message>;
  }

  /**
   * Deletes all collection docs matching an optional filter.
   * @param collectionName The name of the collection to operate on.
   * @param options An optional object for specifying a doc ID and/or user ID. Specify a doc ID to delete a specific doc, otherwise all docs are deleted. Specify a user ID to operate on a collection owned by that user ID. Otherwise operates on a collection owned by the authenticated user.
   */
  async collectionDeleteAll(collectionName: string, options: { filter?: FilterObject; userId?: string } = {}) {
    const payload = { collectionName };
    Object.assign(payload, options);

    return this.asyncEmit(this.version + ":collection:deleteAll", payload) as Promise<Message>;
  }

  //
  // Collections API
  //

  /**
   * Create a collection.
   */
  async collectionsCreate(collectionName: string) {
    return this.asyncEmit(this.version + ":collections:create", { collectionName }) as Promise<Message>;
  }

  /**
   * Drop a collection.
   */
  async collectionsDrop(collectionName: string) {
    return this.asyncEmit(this.version + ":collections:drop", { collectionName }) as Promise<Message>;
  }

  /**
   * List all collection names.
   * @returns Where `data` is an array of collection names
   */
  async collectionsList() {
    return this.asyncEmit(this.version + ":collections:list", null) as Promise<{ data: string[] }>;
  }

  //
  // Sharing API (permissions, links, granted_permissions)
  //

  /**
   * List permissions.
   * @param options If no optional params are set, all permissions for the user are returned.
   * @returns All permissions matching options.
   */
  async permissionsList(
    options: {
      collectionName?: string;
      userId?: string;
      type?: PermissionType;
    } = {},
  ) {
    return this.asyncEmit(this.version + ":permissions:list", options) as Promise<{ data: Permission[] }>;
  }

  /**
   * Create a permission.
   */
  async permissionsCreate(permission: NewPermission) {
    console.log("this", this);
    return this.asyncEmit(this.version + ":permissions:create", { permission }) as Promise<{ id: string }>;
  }

  /**
   * Delete a permission.
   * @param permissionId The permission ID to delete.
   */
  async permissionsDelete(permissionId: string) {
    return this.asyncEmit(this.version + ":permissions:delete", { permissionId }) as Promise<Message>;
  }

  /**
   * Create a permission link.
   */
  async linksCreate(permission: PermissionTemplate, limit: number = 0) {
    console.log("this", this);
    return this.asyncEmit(this.version + ":links:create", { permission, limit }) as Promise<{ data: BasicLink }>;
  }

  /**
   * List permission links.
   * @param options If no optional params are set, all links for the user/app are returned.
   * @returns All links are returned if no options are passed.
   */
  async linksList(
    options: {
      collectionName?: string;
      type?: PermissionType;
    } = {},
  ) {
    return this.asyncEmit(this.version + ":links:list", options) as Promise<{ data: BasicLink[] }>;
  }

  /**
   * Subscribe to link changes
   * @param {SubscribeListener} listener Function that handles the links updates
   * @returns An unsubscribe function
   */
  async linksSubscribe(
    options: {
      collectionName?: string;
      type?: PermissionType;
    } = {},
    listener: SubscribeListener<BasicLink>,
  ) {
    const response = (await this.asyncEmit(this.version + ":links:subscribe", options)) as {
      data: string;
    }; // where data is the subscription handle
    const subscriptionHandle = response.data;

    this.dataApi.on(subscriptionHandle, listener);

    return async () => {
      this.dataApi.off(subscriptionHandle, listener);
      return this.asyncEmit(this.version + ":links:unsubscribe", subscriptionHandle) as Promise<Message>;
    };
  }

  /**
   * Delete permission links.
   */
  async linksDelete(linkId: string) {
    return this.asyncEmit(this.version + ":links:delete", { linkId }) as Promise<Message>;
  }

  /**
   * List granted permissions
   * @returns a list of granted permissions
   */
  async grantedPermissionsList(
    options: {
      collectionName?: string;
      ownerId?: string;
      type?: PermissionType;
    } = {},
  ) {
    return this.asyncEmit(this.version + ":granted_permissions:list", options) as Promise<{
      data: GrantedPermission[];
    }>;
  }

  /**
   * Subscribe to granted permissions changes
   * @param {SubscribeListener} listener Function that handles the granted permissions updates
   * @returns An unsubscribe function
   */
  async grantedPermissionsSubscribe(
    options: {
      collectionName?: string;
      ownerId?: string;
      type?: PermissionType;
    } = {},
    listener: SubscribeListener<GrantedPermission>,
  ) {
    const response = (await this.asyncEmit(this.version + ":granted_permissions:subscribe", options)) as {
      data: string;
    }; // where data is the subscription handle
    const subscriptionHandle = response.data;

    this.dataApi.on(subscriptionHandle, listener);

    return async () => {
      this.dataApi.off(subscriptionHandle, listener);
      return this.asyncEmit(this.version + ":granted_permissions:unsubscribe", subscriptionHandle) as Promise<Message>;
    };
  }

  /**
   * Delete a granted permission
   * @param {string} grantedPermissionId The ID of the granted permission
   */
  async grantedPermissionsDelete(grantedPermissionId: string) {
    const payload = { grantedPermissionId };
    return this.asyncEmit(this.version + ":granted_permissions:delete", payload) as Promise<Message>;
  }

  //
  // Social API
  //

  /**
   * Add a user ID to your contacts
   * @param {string} userID The ID of the user
   */
  async usersGet(userId?: string) {
    let payload = {};
    if (userId) {
      payload = { userId };
    }
    return this.asyncEmit(this.version + ":users:get", payload) as Promise<{ data: User }>;
  }

  /**
   * List contacts
   * @returns a list of contacts
   */
  async contactsList() {
    const payload = {};
    return this.asyncEmit(this.version + ":contacts:list", payload) as Promise<{ data: Contact[] }>;
  }

  /**
   * Subscribe to granted permissions changes
   * @param {SubscribeListener} listener Function that handles the granted permissions updates
   * @returns An unsubscribe function
   */
  async contactsSubscribe(listener: SubscribeListener<Contact>) {
    const response = (await this.asyncEmit(this.version + ":contacts:subscribe", {})) as {
      data: string;
    }; // where data is the subscription handle
    const subscriptionHandle = response.data;

    this.dataApi.on(subscriptionHandle, listener);

    return async () => {
      this.dataApi.off(subscriptionHandle, listener);
      return this.asyncEmit(this.version + ":contacts:unsubscribe", subscriptionHandle) as Promise<Message>;
    };
  }

  //
  // Modal
  //

  private onModalMessage: (event: MessageEvent) => void;

  private closeModal() {
    if (this.onModalMessage) {
      window.removeEventListener("message", this.onModalMessage);
      this.onModalMessage = undefined;
    }
    this.modal.close();
  }

  /**
   * Open a modal
   */
  openModal(path: string, onMessage: ((msg: string) => void) | null = null) {
    this.iframe.src = this.rethinkIdUri + path;
    this.modal.showModal();
    if (onMessage) {
      this.onModalMessage = (event) => {
        // Only handle messages from our iframe
        if (this.iframe && event.source !== this.iframe.contentWindow) return;
        onMessage(event.data);
        this.closeModal();
      };
      window.addEventListener("message", this.onModalMessage);
    }
    return;
  }
}
