import { generateProof } from "../crypto/merkle.js";
import { hashClaim } from "../crypto/shake256.js";
import { bytesToBase64Url } from "../utils/encoding.js";
import {
  type ClaimKey,
  type ClaimSet,
  type EnclaveCredential,
  type PresentationPackage,
  type SerializedMerkleProof,
} from "./schema.js";

export function buildPresentation(
  credential: EnclaveCredential,
  storedLeaves: Uint8Array[],
  claimsOrder: string[],
  claimsToDisclose: ClaimKey[],
  disclosedValues: ClaimSet,
  certificateId: string,
): PresentationPackage {
  const merkleProofs: SerializedMerkleProof[] = [];

  for (const claimKey of claimsToDisclose) {
    const leafIndex = claimsOrder.indexOf(claimKey);
    if (leafIndex < 0) {
      throw new Error(`claim_not_in_certificate: ${claimKey}`);
    }

    const expectedLeaf = hashClaim(claimKey, disclosedValues[claimKey]);
    const storedLeaf = storedLeaves[leafIndex];
    if (!storedLeaf || !bytesEqual(storedLeaf, expectedLeaf)) {
      throw new Error(`claim_value_mismatch: ${claimKey}`);
    }

    const proof = generateProof(storedLeaves, leafIndex);
    merkleProofs.push({
      leafIndex: proof.leafIndex,
      siblings: proof.siblings.map(bytesToBase64Url),
    });
  }

  return {
    certificateId,
    disclosedClaims: Object.fromEntries(
      claimsToDisclose.map((key) => [key, disclosedValues[key]!]),
    ),
    merkleProofs,
    credential,
    presentedAt: new Date().toISOString(),
  };
}

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a[i]! ^ b[i]!;
  }
  return mismatch === 0;
}
