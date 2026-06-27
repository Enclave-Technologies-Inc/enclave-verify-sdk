import assert from "node:assert/strict";
import { test } from "node:test";
import { buildTree, generateProof, verifyProof } from "./merkle.js";
import { hashClaim } from "./shake256.js";
import { generateKeypair, sign, verify } from "./mldsa.js";
import { issueCredential } from "../credential/issue.js";
import { buildPresentation } from "../credential/present.js";
import { verifyPresentation } from "../verify/verify.js";
import { base64UrlToBytes, bytesToBase64Url } from "../utils/encoding.js";

test("merkle proof round-trip", () => {
  const leaves = [
    hashClaim("age_18_plus", true),
    hashClaim("identity_verified", true),
  ];
  const { root } = buildTree(leaves);
  const proof = generateProof(leaves, 0);
  assert.equal(verifyProof(root, leaves[0]!, proof), true);
  assert.equal(verifyProof(root, leaves[1]!, generateProof(leaves, 1)), true);
});

test("issue, present, and verify credential", async () => {
  const keys = generateKeypair();
  const issued = await issueCredential(
    "user-123",
    { age_18_plus: true, identity_verified: true },
    keys.secretKey,
    "test-key-1",
  );

  const storedLeaves = issued.leaves.map(bytesToBase64Url);
  const leaves = storedLeaves.map(base64UrlToBytes);

  const presentation = buildPresentation(
    issued.credential,
    leaves,
    issued.claimsOrder,
    ["age_18_plus"],
    { age_18_plus: true },
    "cert-test-1",
  );

  const result = verifyPresentation({
    credential: issued.credential,
    merkleProofs: presentation.merkleProofs.map((proof) => ({
      claimKey: "age_18_plus",
      claimValue: true,
      proof,
    })),
    publicKey: keys.publicKey,
  });

  assert.equal(result.valid, true);

  const badSig = sign(keys.secretKey, new Uint8Array(32));
  assert.equal(verify(keys.publicKey, issued.merkleRoot, badSig), false);
});
