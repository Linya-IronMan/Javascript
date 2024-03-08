extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;
// 导入 'window.alert'
#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

// 导出一个 'helloworld' 函数
#[wasm_bindgen]
pub fn helloworld(name: &str) {
    alert(&format!("Hello World : {}!", name));
}
