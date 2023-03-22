import { ConnectionRequest, Message, SubscribeListener } from "../types";
import { API } from "./raw";

/**
 * The class that encapsulates the Contacts API
 */
export class ContactsAPI {
  private api: API;

  private onConnectionRequestUnsubscribe: () => Promise<Message>;

  constructor(api: API) {
    this.api = api;
  }

  /**
   * Add a user ID to your contacts
   * @param {string} userID The ID of the user
   */
  async add(userId: string) {
    return this.api.contactsAdd(userId);
  }

  /**
   * Remove a user ID from your contacts
   * @param {string} userID The ID of the user
   */
  async remove(userId: string) {
    return this.api.contactsRemove(userId);
  }

  /**
   * List contacts
   * @returns a list of contacts
   */
  async list() {
    const rec = await this.api.contactsList();
    return rec.data;
  }

  /**
   * Subscribe to contact changes
   * @param {SubscribeListener} listener Function that handles the contact updates
   * @returns An unsubscribe function
   */
  async subscribe(listener: SubscribeListener) {
    return this.api.contactsSubscribe(listener);
  }

  /**
   * Connect with another user (both, initiate and accept a connection)
   * @param {string} userId The ID of the user
   */
  async connect(userId: string) {
    return this.api.contactsConnect(userId);
  }

  /**
   * Disconnect from another user
   * @param {string} userID The ID of the user
   */
  async disconnect(userId: string) {
    return this.api.contactsDisconnect(userId);
  }

  /**
   * Delete a connection request
   * @param {string} requestId The ID of the user
   */
  async deleteConnectionRequest(requestId: string) {
    return this.api.connectionRequestsDelete(requestId);
  }

  /**
   * Provide a callback to handle an incoming contact connection request
   */
  async onConnectionRequest(f: (request: ConnectionRequest) => void) {
    if (this.onConnectionRequestUnsubscribe) {
      await this.onConnectionRequestUnsubscribe();
    }
    try {
      // Subscribe
      this.onConnectionRequestUnsubscribe = await this.api.connectionRequestsSubscribe(
        (changes: { new_val: object; old_val: object }) => {
          if (changes.new_val) {
            f(changes.new_val as ConnectionRequest);
          }
        },
      );
      // List
      let reqs = await this.api.connectionRequestsList();
      reqs.data.forEach((req: ConnectionRequest) => {
        f(req);
      });
    } catch (error) {
      // TODO what should we do
      console.log("onConnectionRequest error:", error);
    }
  }

  /**
   * Stop the onReceived callback
   */
  async stopOnConnectionRequest(): Promise<void> {
    if (!this.onConnectionRequestUnsubscribe) {
      return;
    }
    await this.onConnectionRequestUnsubscribe();
    this.onConnectionRequestUnsubscribe = undefined;
    return;
  }
}
