export type ClaimKey =
  | "identity_verified"
  | "age_18_plus"
  | "age_21_plus"
  | "name_verified"
  | "nationality"
  | "document_type";

export type ClaimSet = Record<string, string | boolean>;

export const VC_CONTEXT = [
  "https://www.w3.org/ns/credentials/v2",
  "https://verify.enclave.talk/contexts/v1",
] as const;

export const PROOF_TYPE = "MLDSASignature2024" as const;
export const ISSUER = "verify.enclave.talk" as const;

export interface EnclaveCredential {
  "@context": string[];
  type: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: {
    id: string;
    merkleRoot: string;
    claimCount: number;
  };
  proof: {
    type: typeof PROOF_TYPE;
    created: string;
    verificationMethod: string;
    proofValue: string;
  };
}

export interface SerializedMerkleProof {
  leafIndex: number;
  siblings: string[];
}

export interface PresentationPackage {
  certificateId: string;
  disclosedClaims: ClaimSet;
  merkleProofs: SerializedMerkleProof[];
  credential: EnclaveCredential;
  presentedAt: string;
}

export interface IssuedCredentialRecord {
  credential: EnclaveCredential;
  leaves: Uint8Array[];
  claimsOrder: string[];
  merkleRoot: Uint8Array;
  proofAlgorithm: "ML-DSA-65";
  proofValue: Uint8Array;
  publicKeyId: string;
}
