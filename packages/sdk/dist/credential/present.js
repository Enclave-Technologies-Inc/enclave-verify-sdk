import { generateProof } from "../crypto/merkle.js";
import { hashClaim } from "../crypto/shake256.js";
import { bytesToBase64Url } from "../utils/encoding.js";
export function buildPresentation(credential, storedLeaves, claimsOrder, claimsToDisclose, disclosedValues, certificateId) {
    const merkleProofs = [];
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
        disclosedClaims: Object.fromEntries(claimsToDisclose.map((key) => [key, disclosedValues[key]])),
        merkleProofs,
        credential,
        presentedAt: new Date().toISOString(),
    };
}
function bytesEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    let mismatch = 0;
    for (let i = 0; i < a.length; i++) {
        mismatch |= a[i] ^ b[i];
    }
    return mismatch === 0;
}
//# sourceMappingURL=present.js.map