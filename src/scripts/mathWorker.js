import { isPrimeNumber as isPrimeNumberJsFunction, validate32BitInteger } from './numberHelper';

let isPrimeNumberWasmFunction = undefined;

const checkPrimeNumber = function (number, callback) {
    validate32BitInteger(number);
    const startTime = Date.now();
    const result = callback(number);
    const timeElapsedInMilliseconds = Date.now() - startTime;
    return { isPrime: result, timeElapsedInMilliseconds };
}

self.onmessage = async function (e) {
    let result = undefined;
    switch (e.data.instructionFormat) {
        case 'JS':
            result = checkPrimeNumber(e.data.number, isPrimeNumberJsFunction);
            break;

        case 'WASM':
            if (!isPrimeNumberWasmFunction) {
                let { is_prime_number } = await import(/* webpackChunkName: "../2" */ '../rust/build'); //TODO: HACK! Refactor
                isPrimeNumberWasmFunction = is_prime_number;
            }

            result = checkPrimeNumber(e.data.number, isPrimeNumberWasmFunction);
            break;

        default:
            throw new Error(`Invalid instruction format: '${e.data.instructionFormat}'`);
    }

    postMessage(result);
}
