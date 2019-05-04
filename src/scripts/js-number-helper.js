
//Constants
export const MAX_32_BIT_NUMBER = 2147483647;
export const MIN_32_BIT_NUMBER = -2147483647;

/**
* @param {number} number
* @returns {boolean}
*/
export function isPrimeNumber(number) {
    if (number < 1) return false;

    const isNumberEven = number % 2 == 0;
    if (isNumberEven) return false;

    let index = 3;
    while(index < number) {
        const isDivisible = number % index == 0;
        if (isDivisible) return false;

        index += 2;
    }

    return true;
}

/**
 * Will throw an error if not a 32Bit integer
 * @param {number} number 
 */
export function validate32BitInteger(number) {
    if (number > MAX_32_BIT_NUMBER || number < MIN_32_BIT_NUMBER) {
        const errorMessage = `Number too large. 
                MAX: ${MAX_32_BIT_NUMBER} 
                MIN: ${MIN_32_BIT_NUMBER}`;
        throw new Error(errorMessage);
    }
}
