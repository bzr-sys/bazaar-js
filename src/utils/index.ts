/**
 * Generates a secure random string using the browser crypto functions
 */
export function generateRandomString(): string {
  const array = new Uint32Array(28);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => ("0" + dec.toString(16)).slice(-2)).join("");
}

/**
 * Calculates the SHA256 hash of the input text.
 * @param input A random string
 */
function sha256(input: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  if (!window.crypto.subtle) {
    console.error(
      "The RethinkID JS SDK works with https or localhost. Possibly you're trying to use it with http. Reason: window.crypto.subtle requires https in most browsers.",
    );
  }
  return window.crypto.subtle.digest("SHA-256", data);
}

/**
 * Base64-url encodes an input string
 * @param arrayBuffer the result of a random string hashed by sha256()
 */
function base64UrlEncode(arrayBuffer: ArrayBuffer): string {
  // Convert the ArrayBuffer to string using Uint8 array to convert to what btoa accepts.
  // btoa accepts chars only within ascii 0-255 and base64 encodes them.
  // Then convert the base64 encoded to base64url encoded
  // (replace + with -, replace / with _, trim trailing =)
  return btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Return the base64-url encoded sha256 hash for the PKCE challenge
 * @param codeVerifier A random string
 */
export async function pkceChallengeFromVerifier(codeVerifier: string): Promise<string> {
  const hashed = await sha256(codeVerifier);
  return base64UrlEncode(hashed);
}
