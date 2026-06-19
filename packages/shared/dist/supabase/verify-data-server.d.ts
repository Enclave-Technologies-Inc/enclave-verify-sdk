import { type SupabaseClient } from "@supabase/supabase-js";
export type VerifyAccountType = "business" | "individual";
export type VerifyAccountRow = {
    account_type: VerifyAccountType;
};
export declare function exchangeAccountTokenForVerifyData(accountAccessToken: string): Promise<string | null>;
export declare function createVerifyDataClientFromAccountSession(): Promise<SupabaseClient>;
export declare function getVerifyAccountByUserId(enclaveUserId: string, accountAccessToken?: string): Promise<VerifyAccountRow | null>;
//# sourceMappingURL=verify-data-server.d.ts.map