/**
 * The URI of the current Bazaar deployment
 */
export const bazaarUri = process.env.NODE_ENV == "development" ? "http://localhost:3377" : "https://api.bzr.dev";

/**
 * The URL path for sharing links
 */
export const linkPath = "/l/";

/**
 * The prefix when namespacing local storage variables
 */
export const namespacePrefix = "bazaar_";
