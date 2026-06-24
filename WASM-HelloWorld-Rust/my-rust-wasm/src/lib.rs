use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct User {
    name: String,
    more: More,
}

#[wasm_bindgen]
pub struct More {
    age: u32,
    sex: String,
    children: Vec<String>,
}

#[wasm_bindgen]
impl More {
    #[wasm_bindgen(constructor)]
    pub fn new(age: u32, sex: String, children: Vec<String>) -> More {
        More { age, sex, children }
    }
}

#[wasm_bindgen]
impl User {
    #[wasm_bindgen(constructor)]
    pub fn new(name: String, more: More) -> User {
        User { name, more }
    }

    #[wasm_bindgen]
    pub fn hello_world(user: User) -> String {
        format!(
            "Name: {}, Age: {}, Sex: {}, Children: {}",
            user.name,
            user.more.age,
            user.more.sex,
            user.more.children.join(", ")
        )
    }
}
#[wasm_bindgen]
pub fn hello_world(user: User) -> String {
    format!(
        "Name: {}, Age: {}, Sex: {}, Children: {}",
        user.name,
        user.more.age,
        user.more.sex,
        user.more.children.join(", ")
    )
}
