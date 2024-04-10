import { linkPath, bazaarUri } from "../constants";
import { type SubscribeListener, NotificationTemplate, Notification } from "../types";
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
  async create(notification: NotificationTemplate) {
    return this.api.notificationsCreate(notification);
  }

  /**
   * Lists notifications.
   * @returns All notifications for this app and user
   */
  async list() {
    const res = await this.api.notificationsList();
    return res.data;
  }

  async subscribe(listener: SubscribeListener<Notification>) {
    return this.api.notificationsSubscribe(listener);
  }

  /**
   * Hides notification with a given ID
   * @param notificationId - ID of the notification to hide
   */
  async hide(notificationId: string) {
    return this.api.notificationsHide(permissionId);
  }

  /**
   * Deletes notification with a given ID
   * @param notificationId - ID of the notification to delete
   */
  async delete(notificationId: string) {
    return this.api.notificationsDelete(permissionId);
  }
}
