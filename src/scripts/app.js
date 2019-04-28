'use strict';
import '../styles/app.scss';

(async () => {

    const { is_prime_number } = await import('../rust/build');
    const answer = prompt("Enter nummber > ");
    const number = Number.parseInt(answer);
    alert(`Is Prime: ${is_prime_number(number)}`);

})();
