import io from "socket.io-client";

import {
  CommonOptions,
  ApiOptions,
  Permission,
  SubscribeListener,
  Message,
  FilterObject,
  AcceptedInvitation,
  ReceivedInvitation,
  Invitation,
  ConnectionRequest,
  Contact,
  User,
  OrderBy,
} from "../types";
import { RethinkIDError } from "../utils";
import { rethinkIdUri, namespacePrefix } from "../constants";

/**
 * The class that encapsulates the low level data API
 */
export class API {
  /**
   * URI for the Data API, RethinkID's realtime data storage service.
   * Currently implemented with Socket.IO + RethinkDB
   *
   * In local development requires a port value and is different than {@link oAuthUri }
   */
  private dataApiUri = rethinkIdUri;

  /**
   * Local storage key names, namespaced in the constructor
   */
  private tokenKeyName: string;

  /**
   * A Socket.IO connection to the Data API
   */
  private dataApi;

  /**
   * A callback to do something when a Data API connection error occurs
   */
  private onConnectError: (message: string) => void;

  constructor(options: CommonOptions & ApiOptions, onConnectError: (message: string) => void) {
    if (options.dataApiUri) {
      this.dataApiUri = options.dataApiUri;
    }

    this.onConnectError = onConnectError;

    /**
     * Namespace local storage key names
     */
    const namespace = namespacePrefix + options.appId;
    this.tokenKeyName = `${namespace}_token`;

    // Make a connection to the Data API if logged in
    this._connect();
  }

  /**
   * Creates a Data API connection with an auth token
   */
  _connect(): void {
    const token = localStorage.getItem(this.tokenKeyName);

    if (!token) {
      return;
    }

    this.dataApi = io(this.dataApiUri, {
      auth: { token },
    });

    this.dataApi.on("connect", () => {
      console.log("sdk: connected. dataApi.id:", this.dataApi.id);
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
  private _waitForConnection: () => Promise<true> = () => {
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
   * @param event A dataApi.io event name, like `tables:create`
   * @param payload
   */
  private _asyncEmit = async (event: string, payload: any) => {
    await this._waitForConnection();
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

  /**
   * Create a table.
   */
  async tablesCreate(tableName: string) {
    return this._asyncEmit("tables:create", { tableName }) as Promise<Message>;
  }

  /**
   * Drop a table.
   */
  async tablesDrop(tableName: string) {
    return this._asyncEmit("tables:drop", { tableName }) as Promise<Message>;
  }

  /**
   * List all table names.
   * @returns Where `data` is an array of table names
   */
  async tablesList() {
    return this._asyncEmit("tables:list", null) as Promise<{ data: string[] }>;
  }

  /**
   * Get permissions for a table.
   * @param options If no optional params are set, all permissions for the user are returned.
   * @returns All permissions are returned if no options are passed.
   */
  async permissionsGet(
    options: {
      tableName?: string;
      userId?: string;
      type?: "read" | "insert" | "update" | "delete";
    } = {},
  ) {
    return this._asyncEmit("permissions:get", options) as Promise<{ data: Permission[] }>;
  }

  /**
   * Set (insert/update) permissions for a table.
   */
  async permissionsSet(permissions: Permission[]) {
    console.log("this", this);
    return this._asyncEmit("permissions:set", permissions) as Promise<Message>;
  }

  /**
   * Delete permissions for a table.
   * @param options An optional object for specifying a permission ID to delete. All permissions are deleted if no permission ID option is passed.
   */
  async permissionsDelete(options: { permissionId?: string } = {}) {
    return this._asyncEmit("permissions:delete", options) as Promise<Message>;
  }

  /**
   * Read all table rows, or a single row if row ID passed. Private by default, or public with read permission.
   * @param {string} tableName The name of the table to read
   * @param {Object} [options={}] An optional object for specifying query options.
   * @param {string} [options.rowId] - The rowId
   * @param {number} [options.startOffset] - An optional start offset. Default 0 (including)
   * @param {number} [options.endOffset] - An optional end offset. Default null (excluding)
   * @param {OrderBy} [options.orderBy] - An optional OrderBy object
   * @param {FilterObject} [options.filter] - An optional Filter object
   * @param {string} [options.userId] - An optional user ID of the owner of the table to read. Defaults to own ID.
   * @returns Specify a row ID to get a specific row, otherwise all rows are returned. Specify a user ID to operate on a table owned by that user ID. Otherwise operates on a table owned by the authenticated user.
   */
  async tableRead(
    tableName: string,
    options: {
      rowId?: string;
      startOffset?: number;
      endOffset?: number;
      orderBy?: OrderBy;
      filter?: FilterObject;
      userId?: string;
    } = {},
  ) {
    const payload = { tableName };
    Object.assign(payload, options);
    return this._asyncEmit("table:read", payload) as Promise<{ data: any[] | object }>;
  }

  /**
   * Subscribe to table changes. Private by default, or public with read permission.
   * @param {string} tableName The name of the table to subscribe to
   * @param {Object} [options={}] An optional object for specifying query options.
   * @param {string} [options.rowId] - The rowId
   * @param {FilterObject} [options.filter] - An optional Filter object
   * @param {string} [options.userId] - An optional user ID of the owner of the table to read. Defaults to own ID.
   * @returns An unsubscribe function
   */
  async tableSubscribe(
    tableName: string,
    options: { rowId?: string; filter?: FilterObject; userId?: string },
    listener: SubscribeListener,
  ) {
    const payload = { tableName };
    Object.assign(payload, options);

    const response = (await this._asyncEmit("table:subscribe", payload)) as { data: string }; // where data is the subscription handle
    const subscriptionHandle = response.data;

    this.dataApi.on(subscriptionHandle, listener);

    return async () => {
      this.dataApi.off(subscriptionHandle, listener);
      return this._asyncEmit("table:unsubscribe", subscriptionHandle) as Promise<Message>;
    };
  }

  /**
   * Insert a table row. Private by default, or public with insert permission
   * @param tableName The name of the table to operate on.
   * @param rowOrRows The row or rows to insert.
   * @param options An optional object for specifying a user ID. Specify a user ID to operate on a table owned by that user ID. Otherwise operates on a table owned by the authenticated user.
   * @returns Where `data` is the array of new row IDs (only generated IDs)
   */
  async tableInsert(tableName: string, rowOrRows: object | object[], options: { userId?: string } = {}) {
    const payload = { tableName, rowOrRows };
    Object.assign(payload, options);

    return this._asyncEmit("table:insert", payload) as Promise<{ data: string[] }>;
  }

  /**
   * Update all table rows, or a single row if row ID exists. Private by default, or public with update permission
   * @param tableName The name of the table to operate on.
   * @param row Note! If row.id not present, updates all rows
   * @param options An optional object for specifying a user ID. Specify a user ID to operate on a table owned by that user ID. Otherwise operates on a table owned by the authenticated user.
   */
  async tableUpdate(tableName: string, row: object, options: { userId?: string } = {}) {
    const payload = { tableName, row };
    Object.assign(payload, options);

    return this._asyncEmit("table:update", payload) as Promise<Message>;
  }

  /**
   * Replace a table row. Private by default, or public with insert, update, delete permissions.
   * @param tableName The name of the table to operate on.
   * @param row Must contain a row ID.
   * @param options An optional object for specifying a user ID. Specify a user ID to operate on a table owned by that user ID. Otherwise operates on a table owned by the authenticated user.
   */
  async tableReplace(tableName: string, row: object, options: { userId?: string } = {}) {
    const payload = { tableName, row };
    Object.assign(payload, options);

    return this._asyncEmit("table:replace", payload) as Promise<Message>;
  }

  /**
   * Deletes all table rows, or a single row if row ID passed. Private by default, or public with delete permission.
   * @param tableName The name of the table to operate on.
   * @param options An optional object for specifying a row ID and/or user ID. Specify a row ID to delete a specific row, otherwise all rows are deleted. Specify a user ID to operate on a table owned by that user ID. Otherwise operates on a table owned by the authenticated user.
   */
  async tableDelete(tableName: string, options: { rowId?: string; userId?: string } = {}) {
    const payload = { tableName };
    Object.assign(payload, options);

    return this._asyncEmit("table:delete", payload) as Promise<Message>;
  }

  /**
   * Add a user ID to your contacts
   * @param {string} userID The ID of the user
   */
  async usersInfo(userId?: string) {
    let payload = {};
    if (userId) {
      payload = { userId };
    }
    return this._asyncEmit("users:info", payload) as Promise<{ data: User }>;
  }

  /**
   * Add a user ID to your contacts
   * @param {string} userID The ID of the user
   */
  async contactsAdd(userId: string) {
    const payload = { userId };
    return this._asyncEmit("contacts:add", payload) as Promise<Message>;
  }

  /**
   * Remove a user ID from your contacts
   * @param {string} userID The ID of the user
   */
  async contactsRemove(userId: string) {
    const payload = { userId };
    return this._asyncEmit("contacts:remove", payload) as Promise<Message>;
  }

  /**
   * List contacts
   * @returns a list of contacts
   */
  async contactsList() {
    const payload = {};
    return this._asyncEmit("contacts:list", payload) as Promise<{ data: Contact[] }>;
  }

  /**
   * Subscribe to contact changes
   * @param {SubscribeListener} listener Function that handles the contact updates
   * @returns An unsubscribe function
   */
  async contactsSubscribe(listener: SubscribeListener) {
    const payload = {};

    const response = (await this._asyncEmit("contacts:subscribe", payload)) as { data: string }; // where data is the subscription handle
    const subscriptionHandle = response.data;

    this.dataApi.on(subscriptionHandle, listener);

    return async () => {
      this.dataApi.off(subscriptionHandle, listener);
      return this._asyncEmit("contacts:unsubscribe", subscriptionHandle) as Promise<Message>;
    };
  }

  /**
   * Connect with another user (both, initiate and accept a connection)
   * @param {string} userId The ID of the user
   */
  async contactsConnect(userId: string) {
    const payload = { userId };
    return this._asyncEmit("contacts:connect", payload) as Promise<Message>;
  }

  /**
   * Disconnect from another user
   * @param {string} userID The ID of the user
   */
  async contactsDisconnect(userId: string) {
    const payload = { userId };
    return this._asyncEmit("contacts:disconnect", payload) as Promise<Message>;
  }

  /**
   * List connection requests
   * @returns a list of connection requests
   */
  async connectionRequestsList() {
    const payload = {};
    return this._asyncEmit("connection_requests:list", payload) as Promise<{ data: ConnectionRequest[] }>;
  }

  /**
   * Subscribe to connection requests changes
   * @param {SubscribeListener} listener Function that handles the connection request updates
   * @returns An unsubscribe function
   */
  async connectionRequestsSubscribe(listener: SubscribeListener) {
    const payload = {};

    const response = (await this._asyncEmit("connection_requests:subscribe", payload)) as { data: string }; // where data is the subscription handle
    const subscriptionHandle = response.data;

    this.dataApi.on(subscriptionHandle, listener);

    return async () => {
      this.dataApi.off(subscriptionHandle, listener);
      return this._asyncEmit("connection_requests:unsubscribe", subscriptionHandle) as Promise<Message>;
    };
  }

  /**
   * Delete a connection request
   * @param {string} requestId The ID of the user
   */
  async connectionRequestsDelete(requestId: string) {
    const payload = { requestId };
    return this._asyncEmit("connection_requests:delete", payload) as Promise<Message>;
  }

  /**
   * Connect with another user (both, initiate and accept a connection)
   * @param {string} userId The ID of the user
   * @param {Object} [resource] An optional resource that describes the invitation
   */
  async invitationsUser(userId: string, resource: any) {
    const payload = { userId, resource };
    return this._asyncEmit("invitations:user", payload) as Promise<Message>;
  }

  /**
   * Connect with another user (both, initiate and accept a connection)
   * @param {string} [limit] The amount of times this link can be redeemed, defaults to 0 (unlimited)
   * @param {Object} [resource] An optional resource that describes the invitation
   */
  async invitationsLink(limit: number, resource: any) {
    const payload = { limit, resource };
    return this._asyncEmit("invitations:link", payload) as Promise<{ data: string }>;
  }

  /**
   * List invitations
   * @returns a list of invitations
   */
  async invitationsList() {
    const payload = {};
    return this._asyncEmit("invitations:list", payload) as Promise<{ data: Invitation[] }>;
  }

  /**
   * Delete an invitation
   * @param {string} invitationId The ID of the invitation
   */
  async invitationsDelete(invitationId: string) {
    const payload = { invitationId };
    return this._asyncEmit("invitations:delete", payload) as Promise<Message>;
  }

  /**
   * List received invitations
   * @returns a list of received invitations
   */
  async receivedInvitationsList() {
    const payload = {};
    return this._asyncEmit("received_invitations:list", payload) as Promise<{ data: ReceivedInvitation[] }>;
  }

  /**
   * Subscribe to received invitation changes
   * @param {SubscribeListener} listener Function that handles the received invitation updates
   * @returns An unsubscribe function
   */
  async receivedInvitationsSubscribe(listener: SubscribeListener) {
    const payload = {};

    const response = (await this._asyncEmit("received_invitations:subscribe", payload)) as { data: string }; // where data is the subscription handle
    const subscriptionHandle = response.data;

    this.dataApi.on(subscriptionHandle, listener);

    return async () => {
      this.dataApi.off(subscriptionHandle, listener);
      return this._asyncEmit("received_invitations:unsubscribe", subscriptionHandle) as Promise<Message>;
    };
  }

  /**
   * Accept a received invitation
   * @param {string} invitationId The ID of the received invitation
   */
  async receivedInvitationsAccept(invitationId: string) {
    const payload = { invitationId };
    return this._asyncEmit("received_invitations:accept", payload) as Promise<Message>;
  }

  /**
   * Delete a received invitation
   * @param {string} invitationId The ID of the received invitation
   */
  async receivedInvitationsDelete(invitationId: string) {
    const payload = { invitationId };
    return this._asyncEmit("received_invitations:delete", payload) as Promise<Message>;
  }

  /**
   * List accepted invitations
   * @returns a list of accepted invitations
   */
  async acceptedInvitationsList() {
    const payload = {};
    return this._asyncEmit("accepted_invitations:list", payload) as Promise<{ data: AcceptedInvitation[] }>;
  }

  /**
   * Subscribe to accepted invitation changes
   * @param {SubscribeListener} listener Function that handles the accepted invitation updates
   * @returns An unsubscribe function
   */
  async acceptedInvitationsSubscribe(listener: SubscribeListener) {
    const payload = {};

    const response = (await this._asyncEmit("accepted_invitations:subscribe", payload)) as { data: string }; // where data is the subscription handle
    const subscriptionHandle = response.data;

    this.dataApi.on(subscriptionHandle, listener);

    return async () => {
      this.dataApi.off(subscriptionHandle, listener);
      return this._asyncEmit("accepted_invitations:unsubscribe", subscriptionHandle) as Promise<Message>;
    };
  }

  /**
   * Handle an accepted invitation
   * @param {string} invitationId The ID of the accepted invitation
   */
  async acceptedInvitationsHandle(invitationId: string) {
    const payload = { invitationId };
    return this._asyncEmit("accepted_invitations:handle", payload) as Promise<Message>;
  }
}
