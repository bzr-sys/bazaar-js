import { rethinkIdUri, sharingPath } from "../constants";
import { ListSharingOptions, Message, SharedWithMe, SubscribeListener } from "../types";
import { API } from "./raw";

/**
 * The class that encapsulates the Sharing API
 */
export class SharingAPI {
  private api: API;
  private sharingLinkUri: string;

  private onSharedWithMeUnsubscribe: () => Promise<Message>;

  constructor(api: API, uri: string) {
    this.api = api;
    this.sharingLinkUri = (uri || rethinkIdUri) + sharingPath;
  }

  /**
   * Share resource with another user
   * @param {string} userId The ID of the user
   * @param {Object} [resource] An optional resource that describes what is being shared
   */
  async withUser(userId: string, resource?: any) {
    return this.api.sharingUser(userId, resource);
  }

  /**
   * Create a sharing link
   * @param {number} [limit] An optional limit on how many times the link can be used
   * @param {Object} [resource] An optional resource that describes what is being shared
   */
  async createLink(limit?: number, resource?: any) {
    const linkId = await this.api.sharingLink(limit, resource);
    return this.sharingLinkUri + linkId.data;
  }

  /**
   * List sharings
   * @param {ListSharingOptions} [options] Options to select the sharing type
   * @returns a list of sharings
   */
  async list(options: ListSharingOptions = {}) {
    const resp = await this.api.sharingList();
    let sharings = resp.data;
    if (options.type) {
      sharings = sharings.filter((s) => {
        return s.type == options.type;
      });
    }

    sharings = sharings.map((s) => {
      // Add link
      if (s.linkId) {
        s.link = this.sharingLinkUri + s.linkId;
      }
      return s;
    });
    return sharings;
  }

  /**
   * Delete a sharing
   * @param {string} sharingId The ID of the sharing
   */
  async delete(sharingId: string) {
    return this.api.sharingDelete(sharingId);
  }


  /**
   * List shared with me
   * @returns a list of resources shared with me
   */
  async listSharedWithMe() {
    return this.api.sharedWithMeList();
  }

  /**
   * Subscribe to shared with me changes
   * @param {SubscribeListener} listener Function that handles the shared with me updates
   * @returns An unsubscribe function
   */
  async subscribeToSharedWithMe(listener: SubscribeListener) {
    return this.api.sharedWithMeSubscribe(listener);
  }

  /**
   * Handle a shared with me (mark it as seen)
   * @param {string} sharedId The ID of the shared with me
   */
  async handleSharedWithMe(sharedId: string) {
    return this.api.sharedWithMeHandle(sharedId);
  }

  /**
   * Delete a shared with me
   * @param {string} sharedId The ID of the shared with me
   */
  async deleteSharedWithMe(sharedId: string) {
    return this.api.sharedWithMeDelete(sharedId);
  }

  /**
   * Provide a callback to handle a new (unhandled) shared with me
   */
  async onSharedWithMe(f: (shared: SharedWithMe) => void) {
    if (this.onSharedWithMeUnsubscribe) {
      await this.onSharedWithMeUnsubscribe();
    }
    try {
      // Subscribe
      console.log("Subscribe onSharedWithMe");
      this.onSharedWithMeUnsubscribe = await this.api.sharedWithMeSubscribe(
        (changes: { new_val: SharedWithMe | null; old_val: object }) => {
          if (changes.new_val && changes.new_val.handled == false) {
            f(changes.new_val);
          }
        },
      );
      // List
      console.log("List onSharedWithMe");
      const resp = await this.api.sharedWithMeList();
      resp.data.forEach((s: SharedWithMe) => {
        if (s.handled == false){
          f(s);
        }
      });
    } catch (error) {
      // TODO what should we do
      console.log("onSharedWithMe error:", error);
    }
  }

  /**
   * Stop the onReceived callback
   */
  async stopOnSharedWithMe(): Promise<void> {
    if (!this.onSharedWithMeUnsubscribe) {
      return;
    }
    await this.onSharedWithMeUnsubscribe();
    this.onSharedWithMeUnsubscribe = undefined;
    return;
  }
}
