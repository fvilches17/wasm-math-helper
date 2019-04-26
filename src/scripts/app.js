'use strict';
import '../styles/app.scss';

(async () => {

    const { add, subtract, multiply } = await import('../rustlib/build/rustlib');
    
    alert(add(1, 2));
    alert(subtract(1, 2));
    alert(multiply(1, 2));

})();
