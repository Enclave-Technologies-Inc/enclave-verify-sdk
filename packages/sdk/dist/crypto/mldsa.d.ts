export interface MlDsaKeypair {
    publicKey: Uint8Array;
    secretKey: Uint8Array;
}
export declare function generateKeypair(seed?: Uint8Array): MlDsaKeypair;
export declare function sign(secretKey: Uint8Array, message: Uint8Array): Uint8Array;
export declare function verify(publicKey: Uint8Array, message: Uint8Array, signature: Uint8Array): boolean;
export declare const ALGORITHM: "ML-DSA-65";
//# sourceMappingURL=mldsa.d.ts.map