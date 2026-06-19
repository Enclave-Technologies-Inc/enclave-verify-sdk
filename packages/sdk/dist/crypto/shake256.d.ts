/** SHAKE256 leaf for empty padding slots (RFC-style Merkle padding). */
export declare function paddingLeafHash(): Uint8Array;
export declare function hashClaim(claimKey: string, claimValue: unknown): Uint8Array;
export declare function hashPair(left: Uint8Array, right: Uint8Array): Uint8Array;
export declare function hashUserId(userId: string): Uint8Array;
//# sourceMappingURL=shake256.d.ts.map