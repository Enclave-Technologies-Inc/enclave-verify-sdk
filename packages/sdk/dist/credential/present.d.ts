import { type ClaimKey, type ClaimSet, type EnclaveCredential, type PresentationPackage } from "./schema.js";
export declare function buildPresentation(credential: EnclaveCredential, storedLeaves: Uint8Array[], claimsOrder: string[], claimsToDisclose: ClaimKey[], disclosedValues: ClaimSet, certificateId: string): PresentationPackage;
//# sourceMappingURL=present.d.ts.map