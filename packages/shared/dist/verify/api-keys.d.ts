export type BusinessApiKey = {
    id: string;
    keyPrefix: string;
    label: string | null;
    active: boolean;
    createdAt: string;
    lastUsedAt: string | null;
};
export declare function generateBusinessApiKey(enclaveUserId: string): Promise<{
    rawKey: string;
    keyPrefix: string;
} | null>;
export declare function listBusinessApiKeys(enclaveUserId: string): Promise<BusinessApiKey[]>;
export declare function revokeBusinessApiKey(enclaveUserId: string, keyId: string): Promise<{
    ok: true;
} | {
    ok: false;
    reason: string;
}>;
export declare function rotateBusinessApiKey(enclaveUserId: string): Promise<{
    ok: true;
    rawKey: string;
    keyPrefix: string;
} | {
    ok: false;
    reason: string;
}>;
//# sourceMappingURL=api-keys.d.ts.map