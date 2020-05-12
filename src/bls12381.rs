
use bbs::prelude::*;
use wasm_bindgen::prelude::*;

/// Generate a BLS 12-381 key pair.
///
/// * seed: UIntArray with 32 element
///
/// returned vector is the concatenation of first the private key (32 bytes)
/// followed by the public key (96) bytes.
#[wasm_bindgen]
pub fn bls12381_generate_key_pair() -> Vec<u8> {

	//TODO support seed generation
	//let (pk, _) = DeterministicPublicKey::new(Some(KeyGenOption::UseSeed(seed.to_vec())));
	let (pk, _) = DeterministicPublicKey::new(None);
	
    //TODO need to return private key too
	pk.to_bytes_compressed_form()[..].to_vec()
}

#[cfg(test)]
pub mod tests {
	extern crate rand;

    use super::*;
    
	fn generate_random_seed() -> Vec<u8> {
		(0..32).map(|_| rand::random::<u8>() ).collect()
	}

	#[test]
	fn can_create_keypair() {
		//let seed = generate_random_seed();
		let keypair = bls12381_generate_key_pair();

        //TODO fix this
		assert!(keypair.len() > 0);
    }
}