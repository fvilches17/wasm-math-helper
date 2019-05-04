import '../styles/app.scss';
import { KeyboardKeyCodes } from './keyboard-key-codes';
import * as JsNumberHelper from './js-number-helper';

let isPrimeNumberWasmFunction = undefined;
let greetWasmFunction = undefined;

async function getPrimeNumberCheckResult(number, instructionFormat) {
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
                const { is_prime_number } = await import('../rust/build');
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

function displayResult(target, result) {
    const message = `${result.isPrimeNumber} (${result.timeElapsedInMilliseconds}ms)`;
    target.classList.toggle('math-result-correct', result.isPrimeNumber);
    target.classList.toggle('math-result-incorrect', !result.isPrimeNumber);
    target.innerText = message;
}

async function handleMathExampleClickEvent(event) {
    event.preventDefault();
    const button = event.target;
    const parentElement = button.parentElement;
    const input = parentElement.querySelector('input');
    const previousValue = input.dataset.previousVal;
    const number = Number.parseInt(input.value);
    if (!number || number == previousValue) return;
    input.dataset.previousVal = number;

    const resultDisplayArea = parentElement.querySelector('.math-result');
    resultDisplayArea.innerText = 'loading...';

    try {
        const result = await getPrimeNumberCheckResult(number, button.dataset.instructionFormat);
        displayResult(resultDisplayArea, result);
    }
    catch (error) {
        resultDisplayArea.innerText = error;
    }
}

function processKeyUpEvent(event) {
    event.preventDefault();

    if (event.keyCode === KeyboardKeyCodes.ENTER) {
        const parentElement = event.target.parentElement;
        const button = parentElement.querySelector('button');
        button.click();
    }
}

async function handleHeaderClickEvent(event) {
    event.preventDefault();
    const { greet } = await import('../rust/build');
    if (!greetWasmFunction) {
        greetWasmFunction = greet;
    }

    greetWasmFunction('Hello from WASM (built with Rust)!');
}

document.querySelectorAll('.math-example button').forEach(button => button.onclick = handleMathExampleClickEvent);
document.querySelectorAll('.math-example input').forEach(input => input.addEventListener('keyup', processKeyUpEvent));
document.querySelector('header').onclick = handleHeaderClickEvent;
