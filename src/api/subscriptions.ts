import type {} from "../types";
import { API } from "./raw";

type Plan = {
  id: string;
  userId: string;
  appId: string;

  cost: number;
  name: string;
  description: string;

  // only visible in backend
  stripeId: string;
};

type NewPlan = Omit<Plan, "id" | "userId" | "appId">;

type Subscription = {
  id: string;
  userId: string;
  appId: string;

  // plan info
  planOwnerId: string;
  planId: string;

  started: Date;
  nextInvoice: Date;

  // only visible in backend
  stripeId: string;
};

type NewSubscription = Omit<Subscription, "id" | "userId" | "appId">;

/**
 * The class that encapsulates the subscriptions API
 * @internal
 */
export class SubscriptionsAPI {
  private api: API;

  constructor(api: API) {
    this.api = api;
  }

  /**
   * Creates subscription for a given user, app, plan.
   */
  async create(subscription: NewSubscription) {
    return this.api.subscriptionsCreate(subscription);
  }

  /**
   * Lists subscriptions for my plans in current app.
   * @returns All subscriptions
   */
  async list() {
    const res = await this.api.subscriptionsList(options);
    return res.data;
  }

  /**
   * Cancels subscription with a given ID
   * Note: must be a subscription belonging to calling user and app
   * @param subscriptionId - ID of the subscription to delete
   */
  async cancel(subscriptionId: string) {
    return this.api.subscriptionsCancel(subscriptionId);
  }

  /**
   * Plans
   */
  public plans = {
    /**
     * Creates a plan
     */
    create: async (plan: NewPlan) => {
      return await this.api.plansCreate(plan);
    },

    /**
     * Lists plans
     */
    list: async (
      options: {
        userId?: string; // defaults to calling user
        // appId?: string; // TODO needed? Only accept for current app?
      } = {},
    ) => {
      return await this.api.plansList(options);
    },

    /**
     * Deletes plan
     */
    delete: async (planId: string) => {
      return this.api.plansDelete(planId);
    },
  };
}
