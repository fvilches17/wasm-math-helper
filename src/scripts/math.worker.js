import * as JsNumberHelper from './js-number-helper';

let isPrimeNumberWasmFunction = undefined;
async function getPrimeNumberResult(number, instructionFormat) {

    JsNumberHelper.validate32BitInteger(number);
    let isPrimeNumber = undefined;
    let startTime = undefined;
    let timeElapsedInMilliseconds = undefined;
    switch (instructionFormat) {
        case 'JS':
            startTime = Date.now();
            isPrimeNumber = JsNumberHelper.isPrimeNumber(number);
            timeElapsedInMilliseconds = Date.now() - startTime;
            break;

        case 'WASM':
            if (!isPrimeNumberWasmFunction) {
                const { is_prime_number } = await import('../rust/mathlib/build');
                isPrimeNumberWasmFunction = is_prime_number;
            }
            startTime = Date.now();
            isPrimeNumber = isPrimeNumberWasmFunction(number);
            timeElapsedInMilliseconds = Date.now() - startTime;
            break;

        default:
            throw new Error(`Invalid instruction format: '${instructionFormat}'`);
    }
    return { isPrimeNumber, timeElapsedInMilliseconds };
}

onmessage = async event => {

    let data = undefined;
    const operation = event.data.operation;
    switch (operation) {
        case 'CheckIfPrimeNumber': {
            data = await getPrimeNumberResult(event.data.number, event.data.instructionFormat);
            break;
        }

        default:
            throw new Error(`Invalid math operation: '${operation}'`);
    }
    postMessage(data);
}
