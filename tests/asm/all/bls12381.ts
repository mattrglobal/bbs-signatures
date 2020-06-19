import {
  DEFAULT_BLS12381_PRIVATE_KEY_LENGTH,
  DEFAULT_BLS12381_PUBLIC_KEY_LENGTH,
} from "../../../lib";

import { assert } from "./util";

function generateBls12381KeyPair(wasm: any) {
  const result = wasm.generateBls12381KeyPair();

  assert(result !== undefined, "Generated keypair is undefined");
  assert(typeof result === "object", "Generated keypair is not an object");
  assert(
    result.publicKey !== undefined,
    "Generated keypair has undefined publicKey"
  );
  assert(
    result.secretKey !== undefined,
    "Generated keypair has undefined secret key"
  );
  assert(
    result.secretKey.length === DEFAULT_BLS12381_PRIVATE_KEY_LENGTH,
    "Invalid secret key length"
  );
  assert(
    result.publicKey.length === DEFAULT_BLS12381_PUBLIC_KEY_LENGTH,
    "Invalid public key length"
  );
}

function generateBls12381KeyPairFromSeed(wasm: any) {
  const result = wasm.generateBls12381KeyPair(
    new Uint8Array(
      Buffer.from(
        "H297BpoOgkfpXcxr1fJyQRiNx1+ZekeQ+OU/AYV/lVxaPXXhFBIbxeIU8kIAAX68cwQ=",
        "base64"
      )
    )
  );

  assert(result !== undefined, "Generated keypair is undefined");
  assert(typeof result === "object", "Generated keypair is not an object");
  assert(
    result.publicKey !== undefined,
    "Generated keypair has undefined publicKey"
  );
  assert(
    result.secretKey !== undefined,
    "Generated keypair has undefined secret key"
  );
  assert(
    result.secretKey.length === DEFAULT_BLS12381_PRIVATE_KEY_LENGTH,
    "Invalid secret key length"
  );
  assert(
    result.publicKey.length === DEFAULT_BLS12381_PUBLIC_KEY_LENGTH,
    "Invalid public key length"
  );

  const publicKeyBuffer = Buffer.from(result.publicKey);
  const secretKeyBuffer = Buffer.from(result.secretKey);

  const expectedPublicKeyBuffer = Buffer.from(
    "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pb",
    "base64"
  );
  const expectedSecretKeyBuffer = Buffer.from(
    "YoASulEi3WV7yfJ+yWctJRCbHfr7WjK7JjcMrRqbL6E=",
    "base64"
  );

  // Buffer.compare returns 0 if equal
  assert(
    Buffer.compare(publicKeyBuffer, expectedPublicKeyBuffer) === 0,
    "Generated public key is not the expected public key"
  );
  assert(
    Buffer.compare(secretKeyBuffer, expectedSecretKeyBuffer) === 0,
    "Generated secret key is not the expected secret key"
  );
}

export default { generateBls12381KeyPair, generateBls12381KeyPairFromSeed };
