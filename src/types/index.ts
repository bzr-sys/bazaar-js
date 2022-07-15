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
};

export type Permission = {
  id?: string; // for permissionSet ID is present if updating, absent if inserting
  tableName: string;
  userId: string;
  type: "read" | "insert" | "update" | "delete";
  // condition: object; // not yet implemented
};

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
