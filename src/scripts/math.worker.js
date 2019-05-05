import * as JsNumberHelper from './js-number-helper';

let isPrimeNumberWasmFunction = undefined;
let calculateNumberOfPrimesWasmFunction = undefined;

async function getPrimeNumberResult(number, instructionFormat) {

    JsNumberHelper.validate32BitInteger(number);

    switch (instructionFormat) {
        case 'JS': {
            const startTime = Date.now();
            const isPrimeNumber = JsNumberHelper.isPrimeNumber(number);
            const timeElapsedInMilliseconds = Date.now() - startTime;
            return { isPrimeNumber, timeElapsedInMilliseconds };
        }


        case 'WASM': {
            const startTime = Date.now();
            const isPrimeNumber = isPrimeNumberWasmFunction(number);
            const timeElapsedInMilliseconds = Date.now() - startTime;
            return { isPrimeNumber, timeElapsedInMilliseconds };
        }

        default:
            throw new Error(`Invalid instruction format: '${instructionFormat}'`);
    }
}

async function getNumberOfPrimes(upperLimit, instructionFormat) {

    JsNumberHelper.validate32BitInteger(upperLimit);

    switch (instructionFormat) {
        case 'JS': {
            const startTime = Date.now();
            const numberOfPrimes = JsNumberHelper.calculateNumberOfPrimes(upperLimit);
            const timeElapsedInMilliseconds = Date.now() - startTime;
            return { numberOfPrimes, timeElapsedInMilliseconds };
        }


        case 'WASM': {
            const startTime = Date.now();
            const numberOfPrimes = calculateNumberOfPrimesWasmFunction(upperLimit);
            const timeElapsedInMilliseconds = Date.now() - startTime;
            return { numberOfPrimes, timeElapsedInMilliseconds };
        }

        default:
            throw new Error(`Invalid instruction format: '${instructionFormat}'`);
    }
}

onmessage = async event => {

    //Cache Wasm functions
    if (!isPrimeNumberWasmFunction) {
        const { 
            is_prime_number, 
            calculate_number_of_primes 
        } = await import(/* webpackChunkName: "mathlib" */'../rust/mathlib/build');

        isPrimeNumberWasmFunction = is_prime_number;
        calculateNumberOfPrimesWasmFunction = calculate_number_of_primes;
    }

    let data = undefined;
    const operation = event.data.operation;

    switch (operation) {
        case 'IsPrime': {
            data = await getPrimeNumberResult(event.data.number, event.data.instructionFormat);
            break;
        }

        case 'HowManyPrimes': {
            data = await getNumberOfPrimes(event.data.number, event.data.instructionFormat);
            break;
        }

        default:
            throw new Error(`Invalid math operation: '${operation}'`);
    }

    postMessage(data);
}
