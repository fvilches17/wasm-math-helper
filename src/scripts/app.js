import '../styles/app.scss';
import { KeyboardKeyCodes } from './keyboard-key-codes';

async function handleMathExampleClickEvent(event) {
    event.preventDefault();
    const button = event.target;
    const parentElement = button.parentElement;
    const input = parentElement.querySelector('input');
    const number = Number.parseInt(input.value);
    if (!number) return;

    const resultDisplayArea = parentElement.querySelector('.math-result');
    clearResultDisplayArea(resultDisplayArea);

    const loader = parentElement.querySelector('.loader');
    loader.style.visibility = 'visible';

    const worker = new Worker('./mathWorker.js', { type: 'module' });
    const instructionFormat = button.dataset.instructionFormat;

    worker.postMessage({ number, instructionFormat /*JS or WASM*/ });

    worker.onmessage = function (e) {
        loader.style.visibility = 'hidden';
        resultDisplayArea.classList.add(e.data.isPrime ? 'math-result-correct' : 'math-result-incorrect');
        resultDisplayArea.innerText = `${e.data.isPrime} (${e.data.timeElapsedInMilliseconds}ms)`;
    };

    worker.onerror = function (e) {
        loader.style.visibility = 'hidden';
        resultDisplayArea.innerText = e.data;
    };
}

function clearResultDisplayArea(target) {
    target.className = 'math-result';
    target.innerText = '...';
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
