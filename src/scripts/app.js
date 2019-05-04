import '../styles/app.scss';
import { KeyboardKeyCodes } from './keyboard-key-codes';
import * as JsNumberHelper from './js-number-helper';
let isPrimeNumberWasmFunction = undefined;

async function getPrimeNumberResults(number, instructionFormat) {
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
                const { is_prime_number } = await import(/* webpackChunkName: "../rustlib" */ '../rust/build');
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

function displayMessage(target, message, classList) {
    if (classList) target.classList.add(...classList);
    target.innerText = message;
}

function displayResult(target, result) {
    const message = `${result.isPrimeNumber} (${result.timeElapsedInMilliseconds}ms)`;
    const classList = ['math-result', (result.isPrimeNumber ? 'math-result-correct' : 'math-result-incorrect')];
    displayMessage(target, message, classList);
}

async function handleMathExampleClickEvent(event) {
    event.preventDefault();
    const button = event.target;
    const parentElement = button.parentElement;
    const input = parentElement.querySelector('input');
    const number = Number.parseInt(input.value);
    if (!number) return;

    const resultDisplayArea = parentElement.querySelector('.math-result');
    displayMessage(resultDisplayArea, 'loading...');

    try {
        const result = await getPrimeNumberResults(number, button.dataset.instructionFormat);
        displayResult(resultDisplayArea, result);
    }
    catch (error) {
        displayMessage(resultDisplayArea, error);
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

document.querySelectorAll('.math-example button').forEach(button => button.onclick = handleMathExampleClickEvent);
document.querySelectorAll('.math-example input').forEach(input => input.addEventListener('keyup', processKeyUpEvent));
