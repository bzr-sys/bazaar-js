import type { API } from "./raw";

/**
 * The class that encapsulates the organizations API
 * @internal
 */
export class OrganizationsAPI {
  private api: API;

  constructor(api: API) {
    this.api = api;
  }

  /**
   * Opens the org modal
   */
  openModal(withId: ((teamId: string) => void) | null = null, onClose: (() => void) | null = null) {
    if (withId && typeof withId === "function") {
      this.api.openModal("/m/org?hasOnMessage", withId, onClose);
      return;
    }
    this.api.openModal("/m/org", null, onClose);
    return;
  }

  /**
   * Lists organizations
   * @returns a list of teams user is part of
   */
  async list() {
    const res = await this.api.organizationsList();
    return res.data;
  }

  /**
   * Gets the organization info for a given ID or handle.
   * @param query - The ID or handle of the organization, requires one of the two.
   */
  async get(query: { orgId?: string; handle?: string } = {}) {
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
    list: async (query: { type?: "user" | "org" } = {}) => {
      const res = await this.api.teamsList(query);
      return res.data;
    },
  };
}
