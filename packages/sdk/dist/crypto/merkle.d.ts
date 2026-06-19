export interface MerkleProof {
    leafIndex: number;
    siblings: Uint8Array[];
}
export interface MerkleTree {
    root: Uint8Array;
    /** Bottom-up layers; layers[0] is the padded leaf row. */
    layers: Uint8Array[][];
}
export declare function buildTree(leaves: Uint8Array[]): MerkleTree;
export declare function generateProof(leaves: Uint8Array[], leafIndex: number): MerkleProof;
export declare function verifyProof(root: Uint8Array, leaf: Uint8Array, proof: MerkleProof): boolean;
//# sourceMappingURL=merkle.d.ts.map