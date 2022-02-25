export type Options = { appId: string; signUpRedirectUri: string; logInRedirectUri: string };

export type Permission = {
  id: string;
  tableName: string;
  userId: string;
  permission: string;
  // condition: object; // not yet implemented
};

export type TokenDecoded = {
  aud: string[];
  client_id: string; // app ID
  exp: number; // timestamp
  ext: object;
  iat: number; // timestamp
  iss: string;
  jti: string;
  nbf: number; // timestamp
  scp: string[]; // scopes
  sub: string; // user ID
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
