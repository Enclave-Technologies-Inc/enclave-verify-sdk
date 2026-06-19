export declare const SUPPORTED_CLAIMS: readonly ["identity_verified", "age_18_plus", "age_21_plus", "name_verified", "nationality", "document_type"];
export type SupportedClaim = (typeof SUPPORTED_CLAIMS)[number];
export declare const claimLabels: Record<string, string>;
export declare function formatClaimLabel(claim: string): string;
export declare function mapRequestStatusForApi(status: string): string;
export type VerificationRequestStatus = "pending" | "consented" | "denied" | "expired";
export declare function effectiveRequestStatus(status: string, expiresAt: string): VerificationRequestStatus;
export declare function formatRequestStatusLabel(status: VerificationRequestStatus): string;
//# sourceMappingURL=claims.d.ts.map