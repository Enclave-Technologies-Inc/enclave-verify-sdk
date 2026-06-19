export type VerifyCertificate = {
    id: string;
    enclave_user_id: string;
    document_type: string;
    issuing_country: string;
    issued_at: string;
    expires_at: string;
    revoked: boolean;
    revoked_at: string | null;
    claims: Record<string, unknown>;
    signature: string;
    verification_method: string;
};
export declare function getUserCertificates(): Promise<VerifyCertificate[]>;
//# sourceMappingURL=certificates.d.ts.map