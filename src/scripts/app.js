import '../styles/app.scss';
import { KeyboardKeyCodes } from './keyboard-key-codes';

function displayResult(target, result) {
    const message = `${result.isPrimeNumber} (${result.timeElapsedInMilliseconds}ms)`;
    target.classList.toggle('math-result-correct', result.isPrimeNumber);
    target.classList.toggle('math-result-incorrect', !result.isPrimeNumber);
    target.innerText = message;
}

function displayMessage(target, message) {
    target.className = '';
    target.classList.add('math-result');
    target.innerText = message;
}

const mathWorker = new Worker('./math.worker.js', { type: 'module' });

async function handleMathExampleClickEvent(event) {
    event.preventDefault();
    const button = event.target;
    const parentElement = button.parentElement;
    const input = parentElement.querySelector('input');
    const number = Number.parseInt(input.value);
    if (!number) return;

    const resultDisplayArea = parentElement.querySelector('.math-result');
    displayMessage(resultDisplayArea, 'loading...');

    const loader = parentElement.querySelector('.loader');
    loader.style.visibility = 'visible';

    mathWorker.onmessage = event => {
        displayResult(resultDisplayArea, event.data);
        loader.style.visibility = 'hidden';
    };

    mathWorker.onerror = event => {
        displayMessage(resultDisplayArea, event.data);
        loader.style.visibility = 'hidden';
    };

    mathWorker.postMessage({
        operation: 'CheckIfPrimeNumber',
        number,
        instructionFormat: button.dataset.instructionFormat
    });
}

function processKeyUpEvent(event) {
    event.preventDefault();

    if (event.keyCode === KeyboardKeyCodes.ENTER) {
        const parentElement = event.target.parentElement;
        const button = parentElement.querySelector('button');
        button.click();
    }
}


let greetWasmFunction = undefined;
async function handleHeaderClickEvent(event) {
    event.preventDefault();

    const { greet } = await import(/* webpackChunkName: "greetinglib" */'../rust/greetinglib/build');
    if (!greetWasmFunction) {
        greetWasmFunction = greet;
    }

    greetWasmFunction();
}

document.querySelectorAll('.math-example button').forEach(button => button.onclick = handleMathExampleClickEvent);
document.querySelectorAll('.math-example input').forEach(input => input.addEventListener('keyup', processKeyUpEvent));
document.querySelector('header').onclick = handleHeaderClickEvent;
