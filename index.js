import { JobsApp } from './js/app.js';

console.log('Index.js cargado');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado');
    const app = new JobsApp();
    app.init();
});