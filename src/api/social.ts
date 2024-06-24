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
   * Gets the user info for a given ID or handle.
   * @param query - The ID or handle of the user, defaults to logged in user's ID.
   */
  async getUser(query: { userId?: string; handle?: string } = {}) {
    const res = await this.api.usersGet(query);
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
      if (listener.onInitial) {
        const contacts = await this.contacts.list();
        for (const contact of contacts) {
          listener.onInitial(contact);
        }
      }
      return this.api.contactsSubscribe(listener);
    },
  };
}
