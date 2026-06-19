import { hashPair, paddingLeafHash } from "./shake256.js";

export interface MerkleProof {
  leafIndex: number;
  siblings: Uint8Array[];
}

export interface MerkleTree {
  root: Uint8Array;
  /** Bottom-up layers; layers[0] is the padded leaf row. */
  layers: Uint8Array[][];
}

function nextPowerOfTwo(n: number): number {
  let size = 1;
  while (size < n) {
    size *= 2;
  }
  return size;
}

function padLeaves(leaves: Uint8Array[]): Uint8Array[] {
  if (leaves.length === 0) {
    const pad = paddingLeafHash();
    return [pad, pad];
  }

  const target = nextPowerOfTwo(leaves.length);
  const padded = [...leaves];
  const pad = paddingLeafHash();
  while (padded.length < target) {
    padded.push(pad);
  }
  return padded;
}

function hashLayer(nodes: Uint8Array[]): Uint8Array[] {
  const next: Uint8Array[] = [];
  for (let i = 0; i < nodes.length; i += 2) {
    const left = nodes[i]!;
    const right = i + 1 < nodes.length ? nodes[i + 1]! : left;
    next.push(hashPair(left, right));
  }
  return next;
}

export function buildTree(leaves: Uint8Array[]): MerkleTree {
  const layers: Uint8Array[][] = [];
  let layer = padLeaves(leaves);
  layers.push(layer);

  while (layer.length > 1) {
    layer = hashLayer(layer);
    layers.push(layer);
  }

  return { root: layer[0]!, layers };
}

export function generateProof(
  leaves: Uint8Array[],
  leafIndex: number,
): MerkleProof {
  const { layers } = buildTree(leaves);
  const siblings: Uint8Array[] = [];
  let index = leafIndex;

  for (let level = 0; level < layers.length - 1; level++) {
    const currentLayer = layers[level]!;
    const siblingIndex = index % 2 === 0 ? index + 1 : index - 1;
    siblings.push(currentLayer[siblingIndex] ?? currentLayer[index]!);
    index = Math.floor(index / 2);
  }

  return { leafIndex, siblings };
}

export function verifyProof(
  root: Uint8Array,
  leaf: Uint8Array,
  proof: MerkleProof,
): boolean {
  let computed = leaf;
  let index = proof.leafIndex;

  for (const sibling of proof.siblings) {
    computed =
      index % 2 === 0
        ? hashPair(computed, sibling)
        : hashPair(sibling, computed);
    index = Math.floor(index / 2);
  }

  if (computed.length !== root.length) {
    return false;
  }

  let mismatch = 0;
  for (let i = 0; i < computed.length; i++) {
    mismatch |= computed[i]! ^ root[i]!;
  }
  return mismatch === 0;
}
