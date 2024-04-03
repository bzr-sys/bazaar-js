import type { Contact, SubscribeListener } from "../types";
import type { API } from "./raw";

/**
 * The class that encapsulates the social API
 * @internal
 */
export class SocialAPI {
  private api: API;

  constructor(api: API) {
    this.api = api;
  }

  /**
   * Opens the social modal
   */
  openModal(withId: ((userId: string) => void) | null = null) {
    if (withId && typeof withId === "function") {
      this.api.openModal("/m/social?hasOnMessage", withId);
      return;
    }
    this.api.openModal("/m/social");
    return;
  }

  /**
   * Gets the user info for a given ID.
   * @param userId - The ID of the user, defaults to logged in user's ID.
   */
  async getUser(userId?: string) {
    const res = await this.api.usersGet(userId);
    return res.data;
  }

  /**
   * Contacts
   */
  public contacts = {
    /**
     * Lists contacts
     * @returns a list of contacts
     */
    list: async () => {
      const res = await this.api.contactsList();
      return res.data;
    },

    /**
     * Subscribes to contacts
     * @returns an unsubscribe function
     */
    subscribe: async (listener: SubscribeListener<Contact>) => {
      return this.api.contactsSubscribe(listener);
    },
  };
}
