import { ml_dsa65 } from "@noble/post-quantum/ml-dsa.js";
import { randomBytes } from "@noble/post-quantum/utils.js";

export interface MlDsaKeypair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}

export function generateKeypair(seed?: Uint8Array): MlDsaKeypair {
  const keys = ml_dsa65.keygen(seed ?? randomBytes(32));
  return {
    publicKey: keys.publicKey,
    secretKey: keys.secretKey,
  };
}

export function sign(secretKey: Uint8Array, message: Uint8Array): Uint8Array {
  return ml_dsa65.sign(message, secretKey);
}

export function verify(
  publicKey: Uint8Array,
  message: Uint8Array,
  signature: Uint8Array,
): boolean {
  return ml_dsa65.verify(signature, message, publicKey);
}

export const ALGORITHM = "ML-DSA-65" as const;
