import { type SubscribeListener, CreateNotification, Notification } from "../types";
import { API } from "./raw";

/**
 * The class that encapsulates the notification API
 * @internal
 */
export class NotificationsAPI {
  private api: API;

  constructor(api: API) {
    this.api = api;
  }

  /**
   * Creates notification for a target user.
   */
  async create(notification: CreateNotification) {
    return this.api.notificationsCreate(notification);
  }

  /**
   * Lists notifications.
   * @returns All notifications for this app and user
   */
  async list(
    options: {
      includeHidden?: boolean;
      senderId?: string;
      startTs?: Date;
      endTs?: Date;
    } = {},
  ) {
    const res = await this.api.notificationsList(options);
    return res.data;
  }

  async subscribe(
    options: {
      includeHidden?: boolean;
      senderId?: string;
      startTs?: Date;
      endTs?: Date;
    } = {},
    listener: SubscribeListener<Notification>,
  ) {
    return this.api.notificationsSubscribe(options, listener);
  }

  /**
   * Hides notification with a given ID
   * @param notificationId - ID of the notification to hide
   */
  async hide(notificationId: string) {
    return this.api.notificationsHide(notificationId);
  }

  /**
   * Deletes notification with a given ID
   * @param notificationId - ID of the notification to delete
   */
  async delete(notificationId: string) {
    return this.api.notificationsDelete(notificationId);
  }
}
