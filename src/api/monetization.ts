import type { NewProduct, PurchaseType } from "../types";
import { API } from "./raw";

/**
 * The class that encapsulates the monetization API
 * @internal
 */
export class MonetizationAPI {
  private api: API;
  private appId: string;

  constructor(api: API, appId: string) {
    this.api = api;
    this.appId = appId;
  }

  /**
   * Opens the monetization modal
   * TODO: does not make sense to be modal, do a redirect
   */
  openModal(onClose: (() => void) | null = null) {
    this.api.openModal("/m/monetization", null, onClose);
    return;
  }

  public url: ".../monetization";

  enabled() {
    // get user and check
    return true;
  }

  /**
   * Purchases
   */
  public purchases = {
    /**
     * Opens the create purchase modal to purchase a product
     */
    make: (productId: string, onClose: (() => void) | null = null) => {
      this.api.openModal(`/m/create-purchase?product=${productId}`, null, onClose);
      return;
    },

    /**
     * Opens the manage purchases modal to change a subscription
     */
    manage: (purchaseId: string | undefined = undefined, onClose: (() => void) | null = null) => {
      if (purchaseId) {
        this.api.openModal(`/m/manage-purchases?purchase=${purchaseId}`, null, onClose);
        return;
      }
      // This requires an app ID
      this.api.openModal(`/m/manage-purchases?app=${this.appId}`, null, onClose);
      return;
    },

    /**
     * Opens the purchases modal to buy products or buy/change/cancel subscriptions
     */
    openModal: (
      options: { productId: string } | { purchaseId: string } | { sellerId: string; group: string },
      onClose: (() => void) | null = null,
    ) => {
      if ("productId" in options) {
        this.api.openModal(`/m/purchase?product=${options.productId}`, null, onClose);
        return;
      }
      if ("purchaseId" in options) {
        this.api.openModal(`/m/purchase?purchase=${options.purchaseId}`, null, onClose);
        return;
      }
      if ("sellerId" in options && "group" in options) {
        this.api.openModal(`/m/purchase?app=${this.appId}&seller=${options.sellerId}&${options.group}`, null, onClose);
        return;
      }
      // TODO should we allow this (choosing any product for this app)
      // this.api.openModal(`/m/manage-purchases?app=${this.appId}`, null, onClose);
      // return;
    },

    /**
     * Lists purchases
     */
    list: async (
      query: {
        type?: PurchaseType;
      } = {},
    ) => {
      const res = await this.api.purchasesList(query);
      return res.data;
    },
  };

  /**
   * Products
   */
  public products = {
    /**
     * Creates a product
     */
    create: async (product: NewProduct) => {
      const res = await this.api.productsCreate(product);
      return res.data;
    },

    // /**
    //  * Update a product
    //  */
    // update: async (product: ProductUpdate) => {
    //   return await this.api.productsUpdate(product);
    // },

    /**
     * Lists products
     */
    list: async (
      query: {
        sellerId?: string; // defaults to calling user
        group?: string; // arbitrary product group
      } = {},
    ) => {
      const res = await this.api.productsList(query);
      return res.data;
    },

    /**
     * Deletes product
     */
    delete: async (productId: string) => {
      return this.api.productsDelete(productId);
    },
  };

  public config = {
    // configure your monetization behaviour?
  };
}
