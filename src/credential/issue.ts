import { buildTree } from "../crypto/merkle.js";
import { ALGORITHM, sign } from "../crypto/mldsa.js";
import { hashClaim, hashUserId } from "../crypto/shake256.js";
import {
  bytesToBase64Url,
  bytesToHex,
  sortedClaimKeys,
} from "../utils/encoding.js";
import {
  ISSUER,
  PROOF_TYPE,
  VC_CONTEXT,
  type ClaimSet,
  type EnclaveCredential,
  type IssuedCredentialRecord,
} from "./schema.js";

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24 * 365 * 2;

export interface IssueCredentialOptions {
  ttlMs?: number;
}

export async function issueCredential(
  userId: string,
  claims: ClaimSet,
  signingKey: Uint8Array,
  publicKeyId: string,
  options: IssueCredentialOptions = {},
): Promise<IssuedCredentialRecord> {
  const claimsOrder = sortedClaimKeys(claims);
  const leaves = claimsOrder.map((key) => hashClaim(key, claims[key]));
  const { root } = buildTree(leaves);

  const signature = sign(signingKey, root);
  const now = new Date();
  const issuanceDate = now.toISOString();
  const expirationDate = new Date(
    now.getTime() + (options.ttlMs ?? DEFAULT_TTL_MS),
  ).toISOString();

  const credential: EnclaveCredential = {
    "@context": [...VC_CONTEXT],
    type: ["VerifiableCredential", "EnclaveVerifyCredential"],
    issuer: ISSUER,
    issuanceDate,
    expirationDate,
    credentialSubject: {
      id: bytesToHex(hashUserId(userId)),
      merkleRoot: bytesToHex(root),
      claimCount: claimsOrder.length,
    },
    proof: {
      type: PROOF_TYPE,
      created: issuanceDate,
      verificationMethod: `https://verify.enclave.talk/.well-known/mldsa-public-key.json#${publicKeyId}`,
      proofValue: bytesToBase64Url(signature),
    },
  };

  return {
    credential,
    leaves,
    claimsOrder,
    merkleRoot: root,
    proofAlgorithm: ALGORITHM,
    proofValue: signature,
    publicKeyId,
  };
}
