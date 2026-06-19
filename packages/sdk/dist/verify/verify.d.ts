import type { EnclaveCredential, SerializedMerkleProof } from "../credential/schema.js";
export interface VerifyPresentationInput {
    credential: EnclaveCredential;
    merkleProofs: Array<{
        claimKey: string;
        claimValue: unknown;
        proof: SerializedMerkleProof;
    }>;
    publicKey: Uint8Array;
}
export interface VerifyPresentationResult {
    valid: boolean;
    reason?: "proof_invalid" | "signature_invalid" | "expired";
    algorithm: "ML-DSA-65";
}
export declare function verifyPresentation(input: VerifyPresentationInput): VerifyPresentationResult;
export { verifyProof } from "../crypto/merkle.js";
//# sourceMappingURL=verify.d.ts.map