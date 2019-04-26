'use strict';
import './app.css';

(async () => {
    const rustLibrary = await import('./rustlib/pkg/rustlib');
    const result = rustLibrary.add(4, 5);
    alert(result);
})();
