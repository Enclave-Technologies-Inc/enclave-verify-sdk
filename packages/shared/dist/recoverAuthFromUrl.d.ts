export declare function clearAuthParamsFromUrl(): void;
export declare function hasAuthParamsInUrl(): boolean;
export declare function recoverAuthSessionFromUrl(setSession: (tokens: {
    access_token: string;
    refresh_token: string;
}) => Promise<{
    error: Error | null;
}>, exchangeCode: (code: string) => Promise<{
    error: Error | null;
}>): Promise<boolean>;
//# sourceMappingURL=recoverAuthFromUrl.d.ts.map