import { invitePath, rethinkIdUri } from "../constants";
import { AcceptedInvitation, ListInvitationsOptions, Message, ReceivedInvitation, SubscribeListener } from "../types";
import { API } from "./raw";

/**
 * The class that encapsulates the Invitations API
 */
export class InvitationsAPI {
  private api: API;
  private inviteLinkUri: string;

  private onReceivedUnsubscribe: () => Promise<Message>;
  private onAcceptedUnsubscribe: () => Promise<Message>;

  constructor(api: API, uri: string) {
    this.api = api;
    this.inviteLinkUri = (uri || rethinkIdUri) + invitePath;
  }

  /**
   * Invite another user to join you in the current app
   * @param {string} userId The ID of the user
   * @param {Object} [resource] An optional resource that describes the invitation
   */
  async inviteUser(userId: string, resource?: any) {
    return this.api.invitationsUser(userId, resource);
  }

  /**
   * Create an invitation link
   * @param {number} [limit] An optional limit on how many times the link can be used
   * @param {Object} [resource] An optional resource that describes the invitation
   */
  async createLink(limit?: number, resource?: any) {
    const linkId = await this.api.invitationsLink(limit, resource);
    return this.inviteLinkUri + linkId.data;
  }

  /**
   * List invitations
   * @param {ListInvitationsOptions} [options] Options to include accepted invitations and select the invitation type
   * @returns a list of invitations
   */
  async list(options: ListInvitationsOptions = {}) {
    const recInv = await this.api.invitationsList();
    let invites = recInv.data;
    if (options.type) {
      invites = invites.filter((i) => {
        return i.type == options.type;
      });
    }

    const recAcc = await this.api.acceptedInvitationsList();
    invites = invites.map((i) => {
      // Add link
      if (i.linkId) {
        i.link = this.inviteLinkUri + i.linkId;
      }

      // Add accepted
      i.accepted = recAcc.data.filter((a) => {
        return a.invitationId == i.id;
      });
      return i;
    });
    if (options.includeAccepted) {
      return invites;
    }
    invites = invites.filter((i) => {
      if (i.type == "link") {
        // TODO filter if limit is reached?
        return true;
      }
      return i.accepted.length == 0;
    });
    return invites;
  }

  /**
   * Delete an invitation
   * @param {string} invitationId The ID of the invitation
   */
  async delete(invitationId: string) {
    // TODO also delete all corresponding accepted_invitations entries
    return this.api.invitationsDelete(invitationId);
  }

  /**
   * Handle an accepted invitation
   * @param {string} invitationId The ID of the accepted invitation
   */
  async handleAccepted(invitationId: string) {
    return this.api.acceptedInvitationsHandle(invitationId);
  }

  /**
   * Provide a callback to handle accepted app invitations
   */
  async onAccepted(f: (invitation: AcceptedInvitation) => void) {
    if (this.onAcceptedUnsubscribe) {
      await this.onAcceptedUnsubscribe();
    }
    try {
      // Subscribe
      this.onAcceptedUnsubscribe = await this.api.acceptedInvitationsSubscribe(
        (changes: { new_val: AcceptedInvitation | null; old_val: object }) => {
          if (changes.new_val != null && !changes.new_val.handled) {
            f(changes.new_val);
          }
        },
      );
      // List
      let reqs = await this.api.acceptedInvitationsList();
      reqs.data.forEach((req: AcceptedInvitation) => {
        if (!req.handled) {
          f(req);
        }
      });
    } catch (error) {
      // TODO what should we do
      console.log("onAcceptedInvitation error:", error);
    }
  }

  /**
   * Stop the onReceived callback
   */
  async stopOnAccepted(): Promise<void> {
    if (!this.onAcceptedUnsubscribe) {
      return;
    }
    await this.onAcceptedUnsubscribe();
    this.onAcceptedUnsubscribe = undefined;
    return;
  }

  /**
   * Accept a received invitation
   * @param {string} invitationId The ID of the received invitation
   */
  async acceptReceived(invitationId: string) {
    return this.api.receivedInvitationsAccept(invitationId);
  }

  /**
   * Delete a received invitation
   * @param {string} invitationId The ID of the received invitation
   */
  async deleteReceived(invitationId: string) {
    return this.api.receivedInvitationsDelete(invitationId);
  }

  /**
   * Provide a callback to handle a received app invitation
   */
  async onReceived(f: (invitation: ReceivedInvitation) => void) {
    if (this.onReceivedUnsubscribe) {
      await this.onReceivedUnsubscribe();
    }
    try {
      // Subscribe
      console.log("Subscribe onReceivedInvitations");
      this.onReceivedUnsubscribe = await this.api.receivedInvitationsSubscribe(
        (changes: { new_val: object; old_val: object }) => {
          if (changes.new_val) {
            f(changes.new_val as ReceivedInvitation);
          }
        },
      );
      // List
      console.log("List onReceivedInvitations");
      let reqs = await this.api.receivedInvitationsList();
      reqs.data.forEach((req: ReceivedInvitation) => {
        f(req);
      });
    } catch (error) {
      // TODO what should we do
      console.log("onReceivedInvitation error:", error);
    }
  }

  /**
   * Stop the onReceived callback
   */
  async stopOnReceived(): Promise<void> {
    if (!this.onReceivedUnsubscribe) {
      return;
    }
    await this.onReceivedUnsubscribe();
    this.onReceivedUnsubscribe = undefined;
    return;
  }
}
