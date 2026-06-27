import { verifyProof, type MerkleProof } from "../crypto/merkle.js";
import { verify as verifyMlDsa } from "../crypto/mldsa.js";
import { hashClaim } from "../crypto/shake256.js";
import { base64UrlToBytes, hexToBytes } from "../utils/encoding.js";
import type {
  EnclaveCredential,
  SerializedMerkleProof,
} from "../credential/schema.js";

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

export function verifyPresentation(
  input: VerifyPresentationInput,
): VerifyPresentationResult {
  const root = hexToBytes(input.credential.credentialSubject.merkleRoot);

  for (const entry of input.merkleProofs) {
    const leaf = hashClaim(entry.claimKey, entry.claimValue);
    const proof: MerkleProof = {
      leafIndex: entry.proof.leafIndex,
      siblings: entry.proof.siblings.map(base64UrlToBytes),
    };

    if (!verifyProof(root, leaf, proof)) {
      return { valid: false, reason: "proof_invalid", algorithm: "ML-DSA-65" };
    }
  }

  const signature = base64UrlToBytes(input.credential.proof.proofValue);
  const sigValid = verifyMlDsa(input.publicKey, root, signature);
  if (!sigValid) {
    return {
      valid: false,
      reason: "signature_invalid",
      algorithm: "ML-DSA-65",
    };
  }

  if (new Date(input.credential.expirationDate) < new Date()) {
    return { valid: false, reason: "expired", algorithm: "ML-DSA-65" };
  }

  return { valid: true, algorithm: "ML-DSA-65" };
}

export { verifyProof } from "../crypto/merkle.js";
