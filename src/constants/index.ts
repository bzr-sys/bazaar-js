/**
 * The URI of the current Bazaar deployment
 */
export const bazaarUri = process.env.NODE_ENV === "development" ? "http://localhost:3377" : "https://cloud.bzr.dev";

/**
 * The URL path for sharing links
 */
export const linkPath = "/l/";

/**
 * The prefix when namespacing local storage variables
 */
export const namespacePrefix = "bazaar_";

/**
 * The key name of the JWT token
 */
export const tokenKeyName = `${namespacePrefix}token`;
