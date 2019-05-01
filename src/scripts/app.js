'use strict';
import '../styles/app.scss';

const worker = new Worker('./mathWorker.js', { type: 'module' });

async function handleMathExampleClickEvent(event) {

    event.preventDefault();
    const button = event.target;
    const input = button.parentElement.querySelector('input');
    const loader = button.parentElement.querySelector('.loader');

    loader.style.visibility = 'visible';

    worker.onmessage = function (e) {
        loader.style.visibility = 'hidden';
        alert(JSON.stringify(e.data));
    };

    worker.onerror = function (e) {
        loader.style.visibility = 'hidden';
        alert(e.data);
    };

    const number = Number.parseInt(input.value);
    const instructionFormat = button.dataset.instructionFormat;
    worker.postMessage({ number, instructionFormat });
}

document.querySelectorAll('.math-example button').forEach(button => button.onclick = handleMathExampleClickEvent);  
