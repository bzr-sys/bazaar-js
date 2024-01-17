/**
 * Enum of all the error types
 * @internal
 */
export const ErrorTypes = {
  Unspecified: 1,
  NoPermission: 2,
  ReservedCollectionName: 3,
  CollectionDoesNotExist: 4,
  DatabaseDoesNotExist: 5,
};

/**
 * @internal
 */
export class RethinkIDError extends Error {
  type: number;

  constructor(type: number, ...params) {
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RethinkIDError);
    }

    this.name = "RethinkIDError";
    this.type = type;
  }
}

/**
 * Generates a secure random string using the browser crypto functions
 */
export function generateRandomString(): string {
  const array = new Uint32Array(28);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => ("0" + dec.toString(16)).slice(-2)).join("");
}

/**
 * Opens and centers pop-up on specific window to account for multiple monitors
 * @param url url to open
 * @param windowName name to identify pop-up window
 * @param win the parent/opener window
 * @returns `Window` if successful, `null` if blocked by a built-in browser pop-up blocker. Otherwise fails silently I think...
 */
export function popupWindow(url: string, windowName: string, win: Window): Window | null {
  const w = 500;
  const h = 608;
  const y = win.top.outerHeight / 2 + win.top.screenY - h / 2;
  const x = win.top.outerWidth / 2 + win.top.screenX - w / 2;
  return win.open(url, windowName, `popup=yes, width=${w}, height=${h}, top=${y}, left=${x}`);
}
