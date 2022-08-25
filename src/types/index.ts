/**
 * RethinkID constructor options
 */
export type Options = {
  rethinkIdBaseUri?: string;
  appId: string;
  /**
   * The URI the auth server redirects to with an auth code, after successful approving a login request.
   */
  loginRedirectUri: string;
  /**
   * Provide a callback to handled failed data API connections. E.g. unauthorized, or expired token.
   * `this` is the RethinkID instance. So you could log out with `this.logOut()` for example.
   */
  dataAPIConnectErrorCallback?: (errorMessage: string) => void;
  /**
   * A callback function an app can specify to run when a user has successfully logged in.
   *
   * e.g. Set state, redirect, etc.
   */
  onLogin?: () => void;
};

export type Permission = {
  id?: string; // for permissionSet ID is present if updating, absent if inserting
  tableName: string;
  userId: string;
  type: PermissionType;
  // condition: object; // not yet implemented
};

export type PermissionType = "read" | "insert" | "update" | "delete";

/**
 * The possible login types. Default is "popup_fallback"
 *
 * "popup_fallback" - Do pop-up login, if the pop-up fails to open, fallback to redirect
 * "popup" - Do pop-up login only. Do not fallback to redirect
 * "redirect" - Do redirect login. Do not open a pop-up
 */
export type LoginType = "popup_fallback" | "popup" | "redirect";

export type IdTokenDecoded = {
  at_hash: string;
  aud: string[];
  auth_time: number; // timestamp
  exp: number; // timestamp
  iat: number; // timestamp
  iss: string;
  jti: string;
  rat: number; // timestamp
  sid: string;
  sub: string; // user ID
  // Open ID Connect scoped data
  // - 'email' scope
  email?: string;
  email_verified?: boolean;
  // - 'profile' scope
  name?: string;
};

export type SubscribeListener = (changes: { new_val: object; old_val: object }) => void;

export type MessageOrError = { message?: string; error?: string };
