/**
 * The URI of the current RethinkID deployment
 */
export const rethinkIdUri =
  process.env.NODE_ENV == "development" ? "http://localhost:3377" : "https://id.rethinkdb.cloud";

/**
 * The URL path for link invitations
 */
export const invitePath = "/i/";

/**
 * The URL path for link sharing
 */
 export const sharingPath = "/s/";

/**
 * The prefix when namespacing local storage variables
 */
export const namespacePrefix = "rethinkid_";
