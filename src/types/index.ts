import { RethinkID } from "..";
import type { API } from "../api/raw";

/**
 * Options for initializing a RethinkID instance
 * @beta
 */
export type RethinkIDOptions = {
  appId: string;

  /**
   * The URI the auth server redirects to with an auth code after login request approval.
   */
  loginRedirectUri: string;

  /**
   * Public URI for the API & OAuth server.
   */
  rethinkIdUri?: string;

  /**
   * Provide a callback to handle a successful login.
   *
   * e.g. Set state, redirect, etc.
   */
  onLogin?: (rid: RethinkID) => Promise<void>;

  /**
   * Provide a callback to handle a failed login. E.g. invalid authorization code.
   *
   * e.g. Set state, redirect, etc.
   */
  onLoginError?: (rid: RethinkID, message: string) => Promise<void>;

  /**
   * Provide a callback to handle API connections. Will be called after login and any subsequent re-connection.
   */
  onApiConnect?: (rid: RethinkID) => Promise<void>;

  /**
   * Provide a callback to handle failed data API connections. E.g. unauthorized, or expired token.
   */
  onApiConnectError?: (rid: RethinkID, message: string) => Promise<void>;
};

export type AuthOptions = Omit<RethinkIDOptions, "onLogin" | "onLoginError" | "onApiConnect" | "onApiConnectError">;

export type APIOptions = Omit<AuthOptions, "loginRedirectUri">;

/**
 * Represents a complete permission object which includes both the `id` field and `userId` for user association.
 * @beta
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
 * @beta
 */
export type NewPermission = Omit<Permission, "id">;

/**
 * Represents the foundational structure of a permission template.
 * It's derived from the {@link NewPermission} and does not include user association.
 * @beta
 */
export type PermissionTemplate = Omit<NewPermission, "userId">;

/**
 * @beta
 */
export enum PermissionType {
  READ = "read",
  INSERT = "insert",
  UPDATE = "update",
  DELETE = "delete",
}

/**
 * @beta
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
 * @beta
 */
export type Link = {
  id: string;
  permission: PermissionTemplate;
  limit: number;
  users: string[];
  url: string;
};

export type BasicLink = Omit<Link, "url">;

/**
 * The possible login types.
 * @beta
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
 * @beta
 */
export type Doc = {
  id: string;
};

/**
 * @beta
 */
export type AnyDoc = Doc & {
  [key: string | number | symbol]: any;
};

/**
 * @beta
 */
export type SubscribeListener<T extends Doc> = (changes: { newDoc: T | null; oldDoc: T | null }) => void;

/**
 * @beta
 */
export type RethinkIdMessage = { message: string };

/**
 * A FilterComparison is an object, that applies a set of comparison operators.
 * Multiple properties are combined with AND. Most comparison operators are self-explanatory
 * logical operators except for contains, which checks if an element is part of an array.
 * @beta
 */
export type FilterComparison = {
  $eq?: string | number;
  $ne?: string | number;
  $gt?: string | number;
  $ge?: string | number;
  $lt?: string | number;
  $le?: string | number;
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
 * @example
 * All fields in a FilterObject are combined with an AND.
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
 *
 * @beta
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
 *
 * @beta
 */
export type OrderBy = {
  [field: string]: OrderByType;
};

/**
 * @beta
 */
export enum OrderByType {
  ASC = "asc",
  DESC = "desc",
}

/**
 * @beta
 */
export type User = {
  id: string;
  name: string;
  email: string | undefined;
};

/**
 * @beta
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
