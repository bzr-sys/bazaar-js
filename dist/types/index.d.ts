import { Options, TokenDecoded, IdTokenDecoded, Permission } from "./types";
/**
 * The primary class of the RethinkID JS SDK to help you more easily build web apps with RethinkID.
 */
export declare class RethinkID {
    #private;
    socket: any;
    constructor(options: Options);
    /**
     * Creates a SocketIO connection with an auth token
     */
    private socketConnect;
    /**
     * Generate a URI to sign up a user, creating a RethinkID account
     */
    signUpUri(): string;
    /**
     * Generate a URI to log in a user to RethinkID and authorize your app.
     * Uses the Authorization Code Flow for single page apps with PKCE code verification.
     * Requests an authorization code.
     */
    logInUri(): Promise<string>;
    /**
     * Takes an authorization code and exchanges it for an access token and ID token
     * An authorization code is received after a successfully calling logInUri() and
     * approving the log in request.
     * Stores the access token and ID token in local storage as `token` and `idToken` respectively.
     */
    getTokens(): Promise<{
        error?: string;
        errorDescription?: string;
        tokenDecoded?: TokenDecoded;
        idTokenDecoded?: IdTokenDecoded;
    }>;
    /**
     * A utility function to check if the user is logged in.
     * i.e. if an access token and ID token are in local storage.
     * Returns the decoded ID token for convenient access to user information.
     */
    isLoggedIn(): {
        idTokenDecoded?: IdTokenDecoded;
        error?: string;
    } | false;
    /**
     * A utility function to log a user out.
     * Deletes the access token and ID token from local storage and reloads the page.
     */
    logOut(): void;
    /**
     * Makes sure a socket has connected.
     */
    private _waitForConnection;
    /**
     * Promisifies a socket.io emit event
     * @param event A socket.io event name, like `tables:create`
     * @param payload
     */
    private _asyncEmit;
    /**
     * Creates a table
     */
    tablesCreate(tableName: string): Promise<{
        message: string;
    }>;
    /**
     * Drops, or deletes, a table
     */
    tablesDrop(tableName: string): Promise<{
        message: string;
    }>;
    /**
     * Lists all table names
     */
    tablesList(): Promise<{
        data: object;
    }>;
    /**
     * Gets permissions for a user. At least one of the parameters must be provided.
     */
    permissionsGet(tableName?: string, userId?: string, permission?: "read" | "insert" | "update" | "delete"): Promise<{
        data: Permission[];
    }>;
    /**
     * Sets permissions for a user
     */
    permissionsSet(permissions: Permission[]): Promise<{
        message: string;
    }>;
    /**
     * Sets permissions for a user
     */
    permissionsDelete(rowId: string): Promise<{
        message: string;
    }>;
    /**
     * Get all rows from a table, or a single row if rowId is provided
     */
    tableRead(tableName: string, rowId?: string): Promise<{
        data: object;
    }>;
    /**
     * Subscribe to table changes. Returns a handle to receive for changes,
     * to be used with {@link socket}.
     *
     * @example
     * ```js
     *   const rid = new RethinkID(options);
     *   rid.socket.on(socketTableHandle, (changes) => {
     *     console.log("Received emitted changes", changes);
     *     if (changes.new_val && changes.old_val === null) {
     *         console.log("Received new message");
     *     }
     *     if (changes.new_val === null && changes.old_val) {
     *         console.log("Received deleted message");
     *     }
     *     if (changes.new_val && changes.old_val) {
     *         console.log("Received updated message");
     *     }
     * });
     * ```
     */
    tableSubscribe(tableName: string, userId?: string): Promise<{
        data: string;
    }>;
    /**
     * Unsubscribe from table changes
     * After having subscribed with {@link tableSubscribe}
     */
    tableUnsubscribe(tableName: string, userId?: string): Promise<{
        message: string;
    }>;
    /**
     * Inserts a row into a table
     */
    tableInsert(tableName: string, row: object, userId?: string): Promise<{
        message: string;
    }>;
    /**
     * Updates a row in a table
     */
    tableUpdate(tableName: string, row: object, userId?: string): Promise<{
        message: string;
    }>;
    /**
     * Replaces a row in a table
     */
    tableReplace(tableName: string, row: object, userId?: string): Promise<{
        message: string;
    }>;
    /**
     * Deletes a row from a table
     */
    tableDelete(tableName: string, rowId: string, userId?: string): Promise<{
        message: string;
    }>;
}
