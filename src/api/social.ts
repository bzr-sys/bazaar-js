import { Contact, SubscribeListener } from "../types";
import { API } from "./raw";

/**
 * The class that encapsulates the social API
 */
export class SocialAPI {
  private api: API;

  constructor(api: API) {
    this.api = api;
  }

  /**
   * Open the social modal
   */
  openModal(withId: ((userId: string) => void) | null = null) {
    // this.modal.showModal();
    this.api.openModal("/m/social", withId);
    return;
  }

  /**
   * Get the user info for a given ID.
   * @param {string} userID The ID of the user, defaults to logged in user's ID.
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
     * List contacts
     * @returns a list of contacts
     */
    list: async () => {
      const res = await this.api.contactsList();
      return res.data;
    },

    /**
     * Subscribe to contacts
     * @returns an unsubscribe function
     */
    subscribe: async (listener: SubscribeListener<Contact>) => {
      return this.api.contactsSubscribe(listener);
    },
  };
}
