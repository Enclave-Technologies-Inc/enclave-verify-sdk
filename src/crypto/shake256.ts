import { shake256 } from "@noble/hashes/sha3";

const encoder = new TextEncoder();

/** SHAKE256 leaf for empty padding slots (RFC-style Merkle padding). */
export function paddingLeafHash(): Uint8Array {
  return shake256(new Uint8Array([0x00]), { dkLen: 32 });
}

export function hashClaim(claimKey: string, claimValue: unknown): Uint8Array {
  const input = JSON.stringify({ [claimKey]: claimValue });
  return shake256(encoder.encode(input), { dkLen: 32 });
}

export function hashPair(left: Uint8Array, right: Uint8Array): Uint8Array {
  const combined = new Uint8Array(left.length + right.length);
  combined.set(left);
  combined.set(right, left.length);
  return shake256(combined, { dkLen: 32 });
}

export function hashUserId(userId: string): Uint8Array {
  return shake256(encoder.encode(userId), { dkLen: 32 });
}
