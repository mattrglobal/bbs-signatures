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

macro_rules! wasm_impl {
    (
    $(#[$meta:meta])+
    $name:ident,
    $($field:ident:$type:ident),+
    ) => {
        $(#[$meta])*
        pub struct $name {
            $(
                pub $field: $type,
            )*
        }

        try_from_impl!($name);
    };

    (
     $name:ident,
     $($field:ident:$type:ident),+) => {
        #[allow(non_snake_case)]
        #[derive(Debug, Deserialize, Serialize)]
        pub struct $name {
            $(
                pub $field: $type,
            )*
        }

        try_from_impl!($name);
    };

    (
     $(#[$meta:meta])+
     $name:ident,
     $($field:ident:$type:ty),*) => {
        $(#[$meta])*
        pub struct $name {
            $(
                pub $field: $type,
            )*
        }

        try_from_impl!($name);
    };
    (
     $name:ident,
     $($field:ident:$type:ty),*) => {
        #[allow(non_snake_case)]
        #[derive(Debug, Deserialize, Serialize)]
        pub struct $name {
            $(
                pub $field: $type,
            )*
        }

        try_from_impl!($name);
    };
}

macro_rules! map_err {
    ($st:expr) => {
        $st.map_err(|e| JsValue::from_str(&format!("{:?}", e)))
    };
}

macro_rules! try_from_impl {
    ($name:ident) => {
        impl std::convert::TryFrom<JsValue> for $name {
            type Error = JsValue;

            fn try_from(value: JsValue) -> Result<Self, Self::Error> {
                map_err!(serde_wasm_bindgen::from_value::<$name>(value))
            }
        }
    };
}
