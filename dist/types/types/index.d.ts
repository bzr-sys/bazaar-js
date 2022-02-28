export declare type Options = {
    appId: string;
    signUpRedirectUri: string;
    logInRedirectUri: string;
};
export declare type Permission = {
    id: string;
    tableName: string;
    userId: string;
    permission: string;
};
export declare type TokenDecoded = {
    aud: string[];
    client_id: string;
    exp: number;
    ext: object;
    iat: number;
    iss: string;
    jti: string;
    nbf: number;
    scp: string[];
    sub: string;
};
export declare type IdTokenDecoded = {
    at_hash: string;
    aud: string[];
    auth_time: number;
    exp: number;
    iat: number;
    iss: string;
    jti: string;
    rat: number;
    sid: string;
    sub: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
};
