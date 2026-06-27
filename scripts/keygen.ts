#!/usr/bin/env tsx
import { generateKeypair } from "../src/crypto/mldsa.js";
import { bytesToBase64Url } from "../src/utils/encoding.js";

const keys = generateKeypair();
const keyId = new Date().toISOString().slice(0, 10);

const publicKeyDocument = {
  "@context": "https://verify.enclave.talk/contexts/mldsa/v1",
  issuer: "verify.enclave.talk",
  keys: [
    {
      id: `https://verify.enclave.talk/.well-known/mldsa-public-key.json#${keyId}`,
      type: "ML-DSA-65",
      algorithm: "ML-DSA-65",
      publicKey: bytesToBase64Url(keys.publicKey),
      created: new Date().toISOString(),
      status: "active",
    },
  ],
};

console.log("=== ML-DSA-65 keypair generated ===\n");
console.log("Public key document (publish to .well-known/mldsa-public-key.json):\n");
console.log(JSON.stringify(publicKeyDocument, null, 2));
console.log("\n--- Store these in your secrets manager ---\n");
console.log(`ENCLAVE_MLDSA_PUBLIC_KEY_ID=${keyId}`);
console.log(`ENCLAVE_MLDSA_PUBLIC_KEY=${bytesToBase64Url(keys.publicKey)}`);
console.log(`ENCLAVE_MLDSA_SECRET_KEY=${bytesToBase64Url(keys.secretKey)}`);
