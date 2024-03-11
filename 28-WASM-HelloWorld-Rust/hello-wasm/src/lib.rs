extern crate wasm_bindgen;

use serde::{Deserialize, Serialize};
use serde_json::Error;
use wasm_bindgen::prelude::*;
// 导入 'window.alert'
#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
    pub type SomeJsType;
}

#[derive(Debug, Deserialize)]
struct More {
    age: u8,
    sex: String,
    children: Vec<String>,
}
#[derive(Debug, Deserialize, Serialize, wasm_bindgen::Serialize)]
#[wasm_bindgen]
struct User {
    name: String,
    more: More,
}

// ...

#[wasm_bindgen]
pub fn helloworld(json_user: &str) -> Result<JsValue, JsValue> {
    match serde_json::from_str(json_user) {
        Ok(user) => {
            let user_js_value = user.into_serde(); // 将 User 转换为 JsValue
            Ok(user_js_value)
        }
        Err(e) => {
            let error_message = format!("Failed to parse JSON to User: {}", e);
            let error_js_value = JsValue::from(error_message);
            Err(error_js_value)
        }
    }
}
