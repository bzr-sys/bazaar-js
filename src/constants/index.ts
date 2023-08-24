/**
 * The URI of the current RethinkID deployment
 */
export const rethinkIdUri =
  process.env.NODE_ENV == "development" ? "http://localhost:3377" : "https://id.rethinkdb.cloud";

/**
 * The URL path for sharing links
 */
export const linkPath = "/l/";

/**
 * The prefix when namespacing local storage variables
 */
export const namespacePrefix = "rethinkid_";
