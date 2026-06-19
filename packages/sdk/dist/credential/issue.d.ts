import { type ClaimSet, type IssuedCredentialRecord } from "./schema.js";
export interface IssueCredentialOptions {
    ttlMs?: number;
}
export declare function issueCredential(userId: string, claims: ClaimSet, signingKey: Uint8Array, publicKeyId: string, options?: IssueCredentialOptions): Promise<IssuedCredentialRecord>;
//# sourceMappingURL=issue.d.ts.map