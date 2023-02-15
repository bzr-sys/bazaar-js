import { API } from "./raw";

/**
 * The class that encapsulates the users API
 */
export class UsersAPI {
  private api: API;

  constructor(api: API) {
    this.api = api;
  }

  /**
   * Add a user ID to your contacts
   * @param {string} userID The ID of the user
   */
  async getInfo(userId?: string) {
    const rec = await this.api.usersInfo(userId);
    return rec.data;
  }
}
