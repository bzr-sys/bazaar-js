/**
 * RethinkID constructor options
 */
export type CommonOptions = {
  appId: string;
  /**
   * Public URI for the API & OAuth authorization server.
   * Will set AuthOptions.oAuthUri & ApiOptions.dataApiUri
   */
  rethinkIdUri?: string;
};

export type AuthOptions = {
  /**
   * The URI the auth server redirects to with an auth code, after successful approving a login request.
   */
  loginRedirectUri: string;
};

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

export enum PermissionType {
  READ = "read",
  INSERT = "insert",
  UPDATE = "update",
  DELETE = "delete",
}

export type GrantedPermission = {
  id: string;
  userId: string;
  appId: string;
  ownerId: string;
  permissionId: string;
  permission: Permission;
};

export type Link = {
  id: string;
  userId: string;
  appId: string;
  permission: PermissionTemplate;
  limit: number;
  users: string[];
  url: string | undefined;
};

/**
 * The possible login types. Default is "popup_fallback"
 *
 * "popup_fallback" - Do pop-up login, if the pop-up fails to open, fallback to redirect
 * "popup" - Do pop-up login only. Do not fallback to redirect
 * "redirect" - Do redirect login. Do not open a pop-up
 */
export type LoginType = "popup_fallback" | "popup" | "redirect";

export type Doc = {
  id: any;
  [key: string]: any;
};

export type SubscribeListener = (changes: { newDoc: Doc | null; oldDoc: Doc | null }) => void;

export type Message = { message: string };

/**
 * A FilterComparison is an object, that applies a set of comparison operators.
 * Multiple properties are combined with AND. Most comparison operators are self-explanatory
 * logical operators except for contains, which checks if an element is part of an array.
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
 * would result in "((height > 80 AND height < 140) OR (weight > 10 AND weight < 25)) AND (age < 12)"
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
 * Example: { height: "desc", age: "asc" }
 */
export type OrderBy = {
  [field: string]: "asc" | "desc";
};

export type User = {
  id: string;
  name: string | undefined;
  email: string | undefined;
  status: "self" | "stranger" | "contact" | "connected";
};

export type Contact = {
  id: string;
  userId: string;
  contactId: string;
  connected: boolean; // flag to signal if contact is connected (you are trusted by this contact)
  requested: boolean; // flag to signal if a connection request has been sent already
};

export type CollectionOptions = {
  onCreate?: () => Promise<void>;
  userId?: string;
};
