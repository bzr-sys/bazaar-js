import { type Doc, GranteeType, type SubscribeListener } from "../types";

/**
 * Constant of all the error types
 *
 */
export enum ErrorTypes {
  Unspecified = 1,
  NoPermission = 2,
  ReservedCollectionName = 3,
  CollectionDoesNotExist = 4,
  DatabaseDoesNotExist = 5,
}

/**
 *
 */
export class BazaarError extends Error {
  type: number;

  constructor(type: number, ...params) {
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BazaarError);
    }

    this.name = "BazaarError";
    this.type = type;
  }
}

export function isNoAppUserError(e: unknown) {
  return e instanceof BazaarError && e.type === ErrorTypes.DatabaseDoesNotExist;
}

export function isNoPermissionError(e: unknown) {
  return e instanceof BazaarError && e.type === ErrorTypes.NoPermission;
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

export function arrayMirrorSubscribeListener<T extends Doc>(data: T[], listener?: SubscribeListener<T>) {
  // Clear the array before returning the listener
  data.length = 0;
  return {
    onInitial: (doc: T) => {
      data.push(doc);
      if (listener && listener.onInitial) {
        listener.onInitial(doc);
      }
    },
    onAdd: (doc: T) => {
      data.push(doc);
      if (listener && listener.onAdd) {
        listener.onAdd(doc);
      }
    },
    onChange: (oldDoc: T, newDoc: T) => {
      const idx = data.findIndex((d) => d.id === oldDoc.id);
      if (idx > -1) {
        data[idx] = newDoc;
      } else {
        // It is missing for some reason, add it.
        data.push(newDoc);
      }
      if (listener && listener.onChange) {
        listener.onChange(oldDoc, newDoc);
      }
    },
    onDelete: (doc: T) => {
      const idx = data.findIndex((d) => d.id === doc.id);
      if (idx > -1) {
        data.splice(idx, 1);
      }
      if (listener && listener.onDelete) {
        listener.onDelete(doc);
      }
    },
  };
}

export function objectMirrorSubscribeListener<T extends Doc>(data: T | undefined, listener?: SubscribeListener<T>) {
  return {
    onInitial: (doc: T) => {
      data = doc;
      if (listener && listener.onInitial) {
        listener.onInitial(doc);
      }
    },
    onAdd: (doc: T) => {
      data = doc;
      if (listener && listener.onAdd) {
        listener.onAdd(doc);
      }
    },
    onChange: (oldDoc: T, newDoc: T) => {
      data = newDoc;
      if (listener && listener.onChange) {
        listener.onChange(oldDoc, newDoc);
      }
    },
    onDelete: (doc: T) => {
      data = undefined;
      if (listener && listener.onDelete) {
        listener.onDelete(doc);
      }
    },
  };
}

export function grantee(type?: GranteeType, id?: string): string {
  switch (type) {
    case GranteeType.ANY:
      return type;
    case GranteeType.GROUP:
      return `${type}${id}`;
    case GranteeType.ORG:
    case GranteeType.USER:
    default:
      // if (!id) {
      //   console.log("Permission user ID missing");
      // }
      return id;
  }
}
