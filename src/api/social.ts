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
  openModal() {
    // this.modal.showModal();
    this.api.openModal("/m/social");
    return;
  }

  /**
   * Get the user info for a given ID.
   * @param {string} userID The ID of the user, defaults to logged in user's ID.
   */
  async getUser(userId?: string) {
    const rec = await this.api.usersGet(userId);
    return rec.data;
  }

  /**
   * List contacts
   * @returns a list of contacts
   */
  async listContacts() {
    const rec = await this.api.contactsList();
    return rec.data;
  }
}
