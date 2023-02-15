/**
 * RethinkID constructor options
 */
export type CommonOptions = {
  appId: string;
};

export type AuthOptions = {
  /**
   * The URI the auth server redirects to with an auth code, after successful approving a login request.
   */
  loginRedirectUri: string;

  /**
   * Optionally set an alternative to the default URI. e.g. A development URI like http://localhost:4444
   */
  oAuthUri?: string;
};

export type ApiOptions = {
  /**
   * Optionally set an alternative to the default URI. e.g. A development URI like http://localhost:4000
   */
  dataApiUri?: string;
};

export type Permission = {
  id?: string; // for permissionSet ID is present if updating, absent if inserting
  tableName: string;
  userId: string;
  type: PermissionType;
  condition?: PermissionCondition;
};

export type PermissionType = "read" | "insert" | "update" | "delete";

export type PermissionCondition = {
  rowId?: string; // Permission applies to a specific row ID
  matchUserId?: string; // Permission applies if specified field matches or contains the user's ID
};

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

export type Message = { message: string };

export type Filter = {
  [field: string]: {
    $eq?: string | number;
    $ne?: string | number;
    $gt?: string | number;
    $ge?: string | number;
    $lt?: string | number;
    $le?: string | number;
  };
};

export type User = {
  id: string;
  name: string | undefined;
  email: string | undefined;
};

export type Contact = {
  id: string;
  userId: string;
  contactId: string;
  connected: boolean; // flag to signal if contact is connected (you are trusted by this contact)
};
export type ConnectionRequest = {
  id: string;
  userId: string;
  contactId: string;
};

export type Invitation = {
  id: string;
  type: "user" | "link";
  userId: string | undefined; // ID of invited user (if type='user')
  limit: number | undefined; // the amount of times the invitation can be used (0 = unlimited, if type='link')
  resource: any;
  accepted: AcceptedInvitation[] | undefined;
};

export type ReceivedInvitation = {
  id: string;
  userId: string;
  hostId: string;
  appId: string;
  invitationId: string;
};

export type AcceptedInvitation = {
  id: string;
  invitationId: string;
  userId: string;
  handled: boolean;
};

export type TableOptions = {
  onCreate?: () => Promise<void>;
  userId?: string;
};

export type ListInvitationsOptions = {
  includeAccepted?: boolean;
  type?: string;
};
