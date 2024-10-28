import { EmailEvent, EmailMessage } from "../types";
import type { API } from "./raw";

/**
 * The class that encapsulates the email API
 *
 * @internal
 */
export class EmailAPI {
  private api: API;

  constructor(api: API) {
    this.api = api;
  }

  /**
   * Send a normal email
   */
  async sendMessage(emailMessage: EmailMessage) {
    return this.api.emailSendMessage(emailMessage);
  }

  /**
   * Send an email with a calendar invite
   */
  async sendEvent(emailEvent: EmailEvent) {
    return this.api.emailSendEvent(emailEvent);
  }
}
