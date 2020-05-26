macro_rules! wasm_object_impl {
    (
     $(#[$meta:meta])+
     $name:ident,
     $($field:ident:$type:ident),+) => {
        $(#[$meta])*
        pub struct $name {
            $(
                $field: $type,
            )*
        }

        #[allow(non_snake_case)]
        impl $name {
            pub fn new(
                $($field: $type,)*
            ) -> Self {
                Self {
                    $($field,)*
                }
            }
        }
    };

    (
     $name:ident,
     $($field:ident:$type:ident),+) => {
        #[allow(non_snake_case)]
        #[wasm_bindgen]
        pub struct $name {
            $(
                $field: $type,
            )*
        }

        #[allow(non_snake_case)]
        impl $name {
            pub fn new(
                $($field: $type,)*
            ) -> Self {
                Self {
                    $($field,)*
                }
            }
        }
    };

    (
     $(#[$meta:meta])+
     $name:ident,
     $($field:ident:$type:ty),*) => {
        $(#[$meta])*
        pub struct $name {
            $(
                $field: $type,
            )*
        }

        #[allow(non_snake_case)]
        impl $name {
            pub fn new(
                $($field: $type,)*
            ) -> Self {
                Self {
                    $($field,)*
                }
            }
        }
    };
    (
     $name:ident,
     $($field:ident:$type:ty),*) => {
        #[allow(non_snake_case)]
        #[wasm_bindgen]
        pub struct $name {
            $(
                $field: $type,
            )*
        }

        #[allow(non_snake_case)]
        impl $name {
            pub fn new(
                $($field: $type,)*
            ) -> Self {
                Self {
                    $($field,)*
                }
            }
        }
    };
}

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
