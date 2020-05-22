export { bls12381ToBbs } from "./bls12381ToBbs"
export { bls_generate_key as generateBls12381KeyPair} from "./wasm"

export interface BlsKeyPair {
    /**
     * Raw public key value for the key pair
     */
    readonly publicKey: Uint8Array;
    /**
     * Raw secret/private key value for the key pair
     */
    readonly secretKey?: Uint8Array;
}
  
/**
 * Converts a BLS12-381 key to a BBS+ public key
 */
export interface Bls12381ToBbsRequest {
    /**
     * The BLS 12-381 key pair to convert
     */
    readonly keyPair: BlsKeyPair;
    /**
     * The number of messages for the BBS+ key
     */
    readonly messageCount: number;
}

/**
 * A BBS+ key pair
 */
export interface BbsKeyPair {
    /**
     * Raw public key value for the key pair
     */
    readonly publicKey: Uint8Array;
    /**
     * Raw secret/private key value for the key pair
     */
    readonly secretKey?: Uint8Array;
    /**
     * Number of messages that can be sign
     */
    readonly messageCount: number;
}
