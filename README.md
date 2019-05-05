wasm-math-helper
================
A math app demonstrating how Rust and WebAssembly can be integrated in web projects. The app compares performance between JS and Wasm by providing the same math functions but written in their respective language.

<img src="website-display.PNG" />

## Pre-Requisites
1. Install NodeJs. https://nodejs.org/en/download/
2. Install the Rust toolchain (for compiling programs to WebAssembly). https://www.rust-lang.org/tools/install
3. Install Wasm-Pack. https://rustwasm.github.io/wasm-pack/installer/

## Getting Started
1. In the Workspace directory run the command npm install
2. In the Workspace directory run the command npm start or npm run start-in-prod-mode*.

*Npm Start compiles the Rust code in debug mode and starts webpack-dev-server, whereas npm run start-in-prod-mode does the same but compiles the Rust code in release code. The Wasm generated in release mode is more performant of course.

## Authors
Francisco Vilches - https://github.com/fvilches17
