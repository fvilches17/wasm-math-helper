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

#[wasm_bindgen]
pub fn calculate_number_of_primes(upperLimit: i32) -> i32 {
    if upperLimit < 1 {
        return 0;
    }

    if upperLimit == 2 {
        return 1;
    }

    let mut count: i32 = 0;
    let mut index: i32 = 1;
    
    while index <= upperLimit {
        if is_prime_number(index) {
            count += 1;
        }

        index += 2;
    }

    return count;
}