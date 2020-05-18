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
