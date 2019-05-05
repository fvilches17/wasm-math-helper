use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn greet() {
    let window = web_sys::window().expect("no global `window` exists");
    let document = window.document().expect("should have a document on window");
    let header = document.get_element_by_id("main-header").unwrap();
    header.set_inner_html("<h1>Hello from Rust!</h1>");
}
