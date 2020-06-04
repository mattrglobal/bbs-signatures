# BBS+ Signatures

BBS+ is a pairing-based cryptographic signature used for signing 1 or more messages. As described in the
[BBS+ spec](https://eprint.iacr.org/2016/663.pdf), BBS+ keys function in the following way:

1. A a prime field _&integers;<sub>p</sub>_
1. A bilinear pairing-friendly curve _E_ with three groups _&#x1D53E;<sub>1</sub>, &#x1D53E;<sub>2</sub>,
   &#x1D53E;<sub>T</sub>_ of prime order _p_.
1. A type-3 pairing function _e_ such that _e : &#x1D53E;<sub>1</sub> X &#x1D53E;<sub>2</sub> &xrarr;
   &#x1D53E;<sub>T</sub>_. More requirements for this can be found in section 4.1 in the
   [BBS+ spec](https://eprint.iacr.org/2016/663.pdf)
1. A base generator _g<sub>1</sub> &isin; &#x1D53E;<sub>1</sub>_ for curve _E_
1. A base generator _g<sub>2</sub> &isin; &#x1D53E;<sub>2</sub>_ for curve _E_
1. _L_ messages to be signed
1. **Key Generation**
   1. Inputs (_L_)
   1. Generate a random generator for each message _(h<sub>1</sub>, ... , h<sub>L</sub>) &xlarr;
      &#x1D53E;<sub>1</sub><sup>L+1</sup>_
   1. Generate a random generator used for blinding factors _h<sub>0</sub> &xlarr; &#x1D53E;<sub>1</sub>_
   1. Generate random _x &xlarr; &integers;<sub>p</sub>_
   1. Compute _w &xlarr; g<sub>2</sub><sup>x</sup>_
   1. Secret key is _x_ and public _p<sub>k</sub>_ is _(w, h<sub>0</sub>, h<sub>1</sub>, ... , h<sub>L</sub>)_
   1. Output (_p<sub>k</sub>_, _x_)
1. **Signature**
   1. Inputs (_p<sub>k</sub>, x, { M<sub>1</sub>, ... , M<sub>L</sub> }_)
   1. Each message _M_ is converted to integers _(m<sub>1</sub>, ..., m<sub>L</sub>) &isin; &integers;<sub>p</sub>_
   1. Generate random numbers _&epsi;, s &xlarr; &integers;<sub>p</sub>_
   1. Compute _B &xlarr; g<sub>1</sub>h<sub>0</sub><sup>s</sup> &prod;<sub>i=1</sub><sup>L</sup>
      h<sub>i</sub><sup>m<sub>i</sub></sup>_
   1. Compute _A &xlarr;B<sup>1&frasl;<sub>x+&epsi;</sub></sup>_
   1. Output signature _&sigma; &xlarr; (A, &epsi;, s)_
1. **Verification**
   1. Inputs _(p<sub>k</sub>, &sigma;, { M<sub>1</sub>, ..., M<sub>L</sub> })_
   1. Each message _M_ is converted to integers _(m<sub>1</sub>, ..., m<sub>L</sub>) &isin; &integers;<sub>p</sub>_
   1. Check _e(A, wg<sub>2</sub><sup>&epsi;</sup>) &#x225f; e(B, g<sub>2</sub>)_
1. **Zero-Knowledge Proof Generation**
   1. To create a signature proof of knowledge where certain messages are disclosed and others remain hidden
   1. _A<sub>D</sub>_ is the set of disclosed attributes
   1. _A<sub>H</sub>_ is the set of hidden attributes
   1. Inputs _(p<sub>k</sub>, A<sub>D</sub>, A<sub>H</sub>, &sigma;)_
   1. Generate random numbers _r<sub>1</sub>, r<sub>2</sub> &xlarr; &integers;<sub>p</sub>_
   1. Compute _B_ as done in the signing phase
   1. Compute _A' &xlarr; A<sup>r<sub>1</sub></sup>_
   1. Compute _A&#773; &xlarr; A'<sup>-&epsi;</sup>B<sup>r<sub>1</sub></sup>_
   1. Compute _d &xlarr; B<sup>r<sub>1</sub></sup>h<sub>0</sub><sup>-r<sub>2</sub></sup>_
   1. Compute _r<sub>3</sub> &xlarr; 1&frasl;<sub>r<sub>1</sub></sub>_
   1. Compute _s' &xlarr; s - r<sub>2</sub> r<sub>3</sub>_
   1. Compute _&pi;<sub>1</sub> &xlarr; A'<sup>-&epsi;</sup> h<sub>0</sub><sup>r<sub>2</sub></sup>_
   1. Compute for all hidden attributes _&pi;<sub>2</sub> &xlarr;
      d<sup>r<sub>3</sub></sup>h<sub>0</sub><sup>-s'</sup>&prod;<sub>i=1</sub><sup>A<sub>H</sub></sup>
      h<sub>i</sub><sup>m<sub>i</sub></sup>_
1. **Zero-Knowledge Proof Verification**
   1. Check signature _e(A', w) &#x225f; e(A&#773;, g<sub>2</sub>)_
   1. Check hidden attributes _A&#773;&frasl;<sub>d</sub> &#x225f; &pi;<sub>1</sub>_
   1. Check revealed attributes _g<sub>1</sub>&prod;<sub>i=1</sub><sup>A<sub>D</sub></sup>
      h<sub>i</sub><sup>m<sub>i</sub></sup> &#x225f; &pi;<sub>2</sub>_

The BBS+ spec does not specify when the generators _(h<sub>0</sub>, h<sub>1</sub>, ..., h<sub>L</sub>)_, only that they
are random generators. Generally in cryptography, public keys are created entirely during the key generation step.
However, Notice the only value in the public key _p<sub>k</sub>_ that is tied to the private key _x_ is _w_. If we
isolate this value as the public key _p<sub>k</sub>_, this is identical to the
[BLS signature keys](https://crypto.stanford.edu/~dabo/pubs/papers/BLSmultisig.html) or ECDSA. The remaining values
could be computed at a later time, say during signing, verification, proof generation and verification. This means key
generation and storage is much smaller at the expense of computing the generators when they are needed. Creating the
remaining generators in this manner will require that all parties are able to arrive at the same values otherwise
signatures and proofs will not validate. In this Spec, we describe an efficient and secure method for computing the
public key generators on-the-fly.

## Proposal

In a prime field, any non-zero element in a prime order group generates the whole group, and ability to solve the
discrete log relatively to a specific generator is equivalent to ability to solve it for any other. As long as the
generators are valid elliptic curve points, then any point should be secure. To compute generators, we propose using
IETF's [Hash to Curve](https://datatracker.ietf.org/doc/draft-irtf-cfrg-hash-to-curve/?include_text=1) algorithm which
is also constant time combined with known inputs. This method allows any party to compute generators that can be used in
the BBS+ signature scheme.

## Algorithm

Using these changes, the API changes to be identical to ECDSA and BLS except signing and verification can include any
number of messages vs a single message.

The API's change in the following way and compute the message specific generators by doing the following

1. _H2C_ is the hash to curve algorithm
1. _I2OSP_ Thise function is used to convert a byte string to a non-negative integer as described in
   [RFC8017](https://tools.ietf.org/html/rfc8017#section-4.1).
1. Compute _h<sub>0</sub> &xlarr; H2C( w || I2OSP(0, 1) || I2OSP(L, 4) )_
1. Compute _h<sub>i</sub> &xlarr; H2C( h<sub>i-1</sub> || I2OSP(0, 1) || I2OSP(i, 4) )_

1. **Key Generation**
   1. Inputs _()_
   1. Generate random _x &xlarr; &integers;<sub>p</sub>_
   1. Compute _w &xlarr; g<sub>2</sub><sup>x</sup>_
   1. Secret key is _x_ and public _p<sub>k</sub>_ is _w_
   1. Output _(p<sub>k</sub>, x)_
1. **Signature**
   1. Inputs _(x, \{M<sub>1</sub>, ..., M<sub>L</sub>)_
   1. Compute _w &xlarr; g<sub>2</sub><sup>x</sup>_
   1. Compute message specific generators.
   1. Same as before
1. **Verification**
   1. Inputs _(p<sub>k</sub>, \{M<sub>1</sub>, ..., M<sub>L</sub>, &sigma;)_
   1. Compute message specific generators.
   1. Verify as before
