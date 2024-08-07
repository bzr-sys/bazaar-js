import type { Contact, SubscribeListener } from "../types";
import type { API } from "./raw";

/**
 * The class that encapsulates the organization API
 * @internal
 */
export class OrganizationAPI {
  private api: API;

  constructor(api: API) {
    this.api = api;
  }

  /**
   * Gets the organization info for a given ID or handle.
   * @param query - The ID or handle of the organization, requires one of the two.
   */
  async getOrg(query: { orgId?: string; handle?: string } = {}) {
    const res = await this.api.organizationsGet(query);
    return res.data;
  }

  /**
   * Teams
   */
  public teams = {
    /**
     * Lists teams
     * @returns a list of teams user is part of
     */
    list: async () => {
      const res = await this.api.teamsList();
      return res.data;
    },
  };
}
