/*
 * Copyright 2020 - MATTR Limited
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[macro_use]
extern crate arrayref;

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[macro_use]
mod macros;
mod utils;
pub mod bbs_plus;
pub mod bls12381;

wasm_impl!(BbsVerifyResponse, verified: bool, error: Option<String>);

pub mod prelude {
    pub use crate::bbs_plus::*;
    pub use crate::bls12381::*;
}
