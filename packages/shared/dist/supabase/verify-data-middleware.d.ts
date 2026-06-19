export type VerifyAccountType = "business" | "individual";
export type VerifyAccountRow = {
    account_type: VerifyAccountType;
};
export declare function getVerifyAccountForMiddleware(enclaveUserId: string, accountAccessToken?: string): Promise<VerifyAccountRow | null>;
//# sourceMappingURL=verify-data-middleware.d.ts.map