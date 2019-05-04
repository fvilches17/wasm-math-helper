use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn is_prime_number(number: i32) -> bool {
    if number < 1 {
        return false;
    }

    let is_number_even: bool = number % 2 == 0;
    if is_number_even {
        return false;
    }

    let mut index: i32 = 3;

    while index < number {
        let is_divisible: bool = number % index == 0;
        if is_divisible {
            return false;
        }

        index += 2;
    }

    return true;
}