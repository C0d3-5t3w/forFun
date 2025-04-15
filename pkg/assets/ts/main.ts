import { initMenu } from './Menu';
import { initAnimations } from './Animations';

document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initAnimations();
    console.log('Website initialized');
});
