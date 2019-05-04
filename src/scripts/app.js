import '../styles/app.scss';
import { KeyboardKeyCodes } from './keyboard-key-codes';
import * as JsNumberHelper from './js-number-helper';
let isPrimeNumberWasmFunction = undefined;

const checkPrimeNumber = function (number, callback) {
    JsNumberHelper.validate32BitInteger(number);
    const startTime = Date.now();
    const result = callback(number);
    const timeElapsedInMilliseconds = Date.now() - startTime;
    return { isPrime: result, timeElapsedInMilliseconds };
}

function displayMessage(target, message, classList) {
    if (classList) target.classList.add(...classList);
    target.innerText = message;
}

function displayResult(target, result) {
    const message = `${result.isPrime} (${result.timeElapsedInMilliseconds}ms)`;
    const classList = ['math-result', (result.isPrime ? 'math-result-correct' : 'math-result-incorrect')];
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
        let result = undefined;
        const instructionFormat = button.dataset.instructionFormat;

        switch (instructionFormat) {
            case 'JS': {
                result = checkPrimeNumber(number, JsNumberHelper.isPrimeNumber);
                break;
            }
            case 'WASM': {
                if (!isPrimeNumberWasmFunction) {
                    const { is_prime_number } = await import(/* webpackChunkName: "../rustlib" */ '../rust/build/rustlib');
                    isPrimeNumberWasmFunction = is_prime_number;
                }

                result = checkPrimeNumber(number, isPrimeNumberWasmFunction);
                break;
            }
            default:
                throw new Error(`Invalid instruction format: '${instructionFormat}'`);
        }

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
