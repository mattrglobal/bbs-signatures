import {bls_public_key_to_bbs_key, bls_secret_key_to_bbs_key} from "./wasm";
import {BbsKeyPair, Bls12381ToBbsRequest} from "./index";

/**
 * Converts a BLS12-381 key to a BBS+ key
 * @param request Request for the key conversion
 *
 * @returns A BbsKeyPair
 */
export const bls12381ToBbs = (request: Bls12381ToBbsRequest): BbsKeyPair => {
    try {
        if (request.keyPair.secretKey) {
            return bls_secret_key_to_bbs_key({
                secretKey: request.keyPair.secretKey.buffer,
                messageCount: request.messageCount,
            });
        } else {
            return bls_public_key_to_bbs_key({
                publicKey: request.keyPair.publicKey.buffer,
                messageCount: request.messageCount,
            });
        }
    } catch {
        throw new Error("Failed to convert key");
    }
};
