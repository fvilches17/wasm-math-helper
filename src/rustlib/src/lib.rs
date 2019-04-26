use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(x: i32, y: i32) -> i32 {
    x + y
}

#[wasm_bindgen]
pub fn subtract(x: i32, y: i32) -> i32 {
    x - y
}

#[wasm_bindgen]
pub fn multiply(x: i32, y: i32) -> i32 {
    x * y
}