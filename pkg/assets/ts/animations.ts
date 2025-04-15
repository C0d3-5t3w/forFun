export function initAnimations() {
    console.log('Animations initialized');

    // Apply fade-in animation to the main heading
    const mainHeading = document.querySelector('h1') as HTMLElement;
    if (mainHeading) {
        fadeIn(mainHeading, 1500);
    }

    // Apply flashing animation to the navigation links
    const navLinks = document.querySelectorAll('.menu a') as NodeListOf<HTMLElement>;
    navLinks.forEach((link) => {
        flash(link, 2, 1000);
    });
}

export function fadeIn(element: HTMLElement, duration: number = 1000) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    setTimeout(() => {
        element.style.opacity = '1';
    }, 10);
}

export function flash(element: HTMLElement, times: number = 3, duration: number = 500) {
    let count = 0;
    const interval = setInterval(() => {
        element.style.visibility = element.style.visibility === 'hidden' ? 'visible' : 'hidden';
        count++;
        if (count >= times * 2) {
            clearInterval(interval);
            element.style.visibility = 'visible';
        }
    }, duration / 2);
}
