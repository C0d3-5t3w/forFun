import { initMenu } from './menu';
import { initAnimations } from './animations';

document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initAnimations();
    console.log('Website initialized');
});
