import { BazaarApp } from "..";
import type { API } from "../api/raw";

/**
 * Options for initializing a BazaarApp instance
 */
export type BazaarOptions = {
  appId: string;

  /**
   * The URI the auth server redirects to with an auth code after login request approval.
   */
  loginRedirectUri: string;

  /**
   * Public URI for the API & OAuth server.
   */
  bazaarUri?: string;

  /**
   * Provide a callback to handle a successful login.
   *
   * e.g. Set state, redirect, etc.
   */
  onLogin?: (bzr: BazaarApp) => Promise<void>;

  /**
   * Provide a callback to handle a failed login. E.g. invalid authorization code.
   *
   * e.g. Set state, redirect, etc.
   */
  onLoginError?: (bzr: BazaarApp, message: string) => Promise<void>;

  /**
   * Provide a callback to handle API connections. Will be called after login and any subsequent re-connection.
   */
  onApiConnect?: (bzr: BazaarApp) => Promise<void>;

  /**
   * Provide a callback to handle failed data API connections. E.g. unauthorized, or expired token.
   */
  onApiConnectError?: (bzr: BazaarApp, message: string) => Promise<void>;
};

export type AuthOptions = Omit<BazaarOptions, "onLogin" | "onLoginError" | "onApiConnect" | "onApiConnectError">;

export type APIOptions = Omit<AuthOptions, "loginRedirectUri">;

/**
 * Represents a complete permission object which includes both the `id` field and `userId` for user association.
 */
export type Permission = {
  id: string;
  collectionName: string;
  userId: string;
  types: PermissionType[];
  filter?: FilterObject;
};

/**
 * Represents a permission object that is yet to be persisted.
 * It has the same structure as {@link Permission} but without the `id` field.
 */
export type NewPermission = Omit<Permission, "id">;

/**
 * Represents the foundational structure of a permission template.
 * It's derived from the {@link NewPermission} and does not include user association.
 */
export type PermissionTemplate = Omit<NewPermission, "userId">;

/**
 *
 */
export enum PermissionType {
  READ = "read",
  INSERT = "insert",
  UPDATE = "update",
  DELETE = "delete",
}

/**
 * Represents the options for sending notifications.
 */
export enum SendNotification {
  /**
   * Send an invitation if the target user does not use the app
   */
  INVITE_ONLY = "invite-only",
  /**
   * Always send an invitation to the target user
   */
  ALWAYS = "always",
  /**
   * Never send an invitation to the target user
   */
  NEVER = "never",
}

/**
 *
 */
export type SharingNotification = {
  createNotification: boolean;
  sendMessage: SendNotification;
  /**
   * Defaults to "X shared something with you in app Y"
   */
  message?: string;
};

/**
 *
 */
export type Notification = {
  id: string;
  //userId: string;
  //appId: string;
  senderId: string;
  message: string;
  ts: Date;
  hidden: boolean;
};

/**
 *
 */
export type CreateNotification = {
  userId: string;
  sendMessage?: SendNotification; // Defaults to never
  message: string; // max 250 chars
};

/**
 *
 */
export type GrantedPermission = {
  id: string;
  /**
   * ID of the resource owner (the sharer)
   */
  ownerId: string;
  permission: Permission;
};

/**
 *
 */
export type Link = {
  id: string;
  permission: PermissionTemplate;
  limit: number;
  description: string; // max 30 chars
  users: string[];
  url: string;
};

export type BasicLink = Omit<Link, "url">;

/**
 * The possible login types.
 */
export enum LoginType {
  /**
   * Default login type.
   * Do pop-up login, if the pop-up fails to open, fallback to redirect.
   */
  POPUP_FALLBACK = "popup_fallback",
  /**
   * Do pop-up login only. Do not fallback to redirect.
   */
  POPUP = "popup",
  /**
   * Do redirect login. Do not open a pop-up.
   */
  REDIRECT = "redirect",
}

/**
 *
 */
export type Doc = {
  id: string;
};

/**
 *
 */
export type AnyDoc = Doc & {
  [key: string | number | symbol]: any;
};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object | undefined
    ? DeepPartial<T[P]>
    : T[P];
};

/**
 *
 */
export type RawSubscribeListener<T extends Doc> = (changes: { newDoc: T | null; oldDoc: T | null }) => void;

/**
 *
 */
export type SubscribeListener<T extends Doc> = {
  onAdd?: (doc: T) => void;
  onChange?: (oldDoc: T, newDoc: T) => void;
  onDelete?: (doc: T) => void;
};

/**
 *
 */
export type BazaarMessage = { message: string };

/**
 * A FilterComparison is an object, that applies a set of comparison operators.
 * Multiple properties are combined with AND. Most comparison operators are self-explanatory
 * logical operators except for contains, which checks if an element is part of an array.
 */
export type FilterComparison = {
  /** Equal */
  $eq?: string | number;
  /** Not equal */
  $ne?: string | number;
  /** Greater than */
  $gt?: string | number;
  /** Greater than or equal */
  $ge?: string | number;
  /** Less than */
  $lt?: string | number;
  /** Less than or equal */
  $le?: string | number;
  /** Selects docs where an array field contains the specified value. */
  $contains?: string | number;
};

/**
 * A FilterObject is an object that either maps
 * - string keys to string | number | boolean | null. This corresponds to an equality operation
 * - string keys to FilterComparison. This corresponds to the operation defined in FilterComparison
 * - $and to FilterObject[]. This combines the result of each FilterObject in the array with AND
 * - $or to FilterObject[]. This combines the result of each FilterObject in the array with OR
 * - $not to FilterObject. This applies NOT to the result of the FilterObject
 *
 * All fields in a FilterObject are combined with an AND.
 *
 * @example
 * The FilterObject
 * ```
 * {
 *   $or: [
 *     {
 *       height: {
 *         $gt: 80,
 *         $lt: 140,
 *       },
 *     },
 *     {
 *       weight: {
 *         $gt: 10,
 *         $lt: 25,
 *       },
 *     },
 *   ],
 *   age: { $lt: 12 },
 * }
 * ```
 * would result in "((height \> 80 AND height \< 140) OR (weight \> 10 AND weight \< 25)) AND (age \< 12)"
 */
export type FilterObject = {
  $and?: FilterObject[];
  $or?: FilterObject[];
  $not?: FilterObject;
  // Arbitrary fields cannot be FilterObject or FilterObject[]. These types are declared as options because typescript requires it.
  [field: string]: FilterComparison | string | number | boolean | null | FilterObject | FilterObject[];
};

/**
 * An OrderBy object specifies orderings of results.
 * @example
 * ```
 * { height: "desc", age: "asc" }
 * ```
 */
export type OrderBy = {
  [field: string]: OrderByType;
};

/**
 *
 */
export enum OrderByType {
  ASC = "asc",
  DESC = "desc",
}

/**
 *
 */
export type User = {
  id: string;
  name: string;
  handle: string;
  email: string | undefined;
};

/**
 *
 */
export type Contact = {
  id: string;
  /**
   * Flag to signal if contact is connected (you are trusted by this contact)
   */
  connected: boolean;
  /**
   * The resolved user object
   */
  user: User;
};

export type CollectionOptions = {
  onCreate?: () => Promise<void>;
  userId?: string;
};

/**
 * Options for several methods in {@link API}
 */
export type CollectionCommonOptions = {
  /** An optional user ID of the owner of the collection to read. Defaults to own ID. */
  userId?: string;
};

/**
 * Options for {@link API.collectionGetAll}
 */
export type CollectionGetAllOptions = {
  /** An optional start offset. Default is 0 (inclusive). */
  startOffset?: number;
  /** An optional end offset. Default is `null` (exclusive). */
  endOffset?: number;
  orderBy?: OrderBy;
  filter?: FilterObject;
  /** An optional user ID of the owner of the collection to read. Defaults to own ID. */
  userId?: string;
};

/**
 * Options for {@link API.collectionSubscribeAll} and {@link API.collectionDeleteAll}
 */
export type CollectionCommonAllOptions = {
  filter?: FilterObject;
  /** An optional user ID of the owner of the collection to read. Defaults to own ID. */
  userId?: string;
};
