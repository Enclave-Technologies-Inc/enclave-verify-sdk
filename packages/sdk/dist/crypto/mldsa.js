import { ml_dsa65 } from "@noble/post-quantum/ml-dsa.js";
import { randomBytes } from "@noble/post-quantum/utils.js";
export function generateKeypair(seed) {
    const keys = ml_dsa65.keygen(seed ?? randomBytes(32));
    return {
        publicKey: keys.publicKey,
        secretKey: keys.secretKey,
    };
}
export function sign(secretKey, message) {
    return ml_dsa65.sign(message, secretKey);
}
export function verify(publicKey, message, signature) {
    return ml_dsa65.verify(signature, message, publicKey);
}
export const ALGORITHM = "ML-DSA-65";
//# sourceMappingURL=mldsa.js.map