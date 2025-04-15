interface Quote {
    text: string;
    author: string;
}

const quotes: Quote[] = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
    { text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
    { text: "What we think, we become.", author: "Buddha" }
];

const initFadeIn = (): void => {
    const fadeInElements: NodeListOf<HTMLElement> = document.querySelectorAll('.fade-in');
    const observer: IntersectionObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void => {
            entries.forEach((entry: IntersectionObserverEntry): void => {
                if (entry.isIntersecting) {
                    (entry.target as HTMLElement).classList.add('appear');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );
    fadeInElements.forEach((el: HTMLElement): void => observer.observe(el));
};

const initBackToTop = (): void => {
    const backToTopButton: HTMLButtonElement = document.createElement('button');
    backToTopButton.id = 'back-to-top';
    backToTopButton.innerText = '↑Top↑';
    document.body.appendChild(backToTopButton);
    backToTopButton.addEventListener('click', (e: MouseEvent): void => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', (e: Event): void => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
};

const initQuoteOfDay = (): void => {
    const randomQuote: Quote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteEl: HTMLElement = document.createElement('div');
    quoteEl.id = 'quote-of-day';
    quoteEl.innerHTML = `<blockquote>"${randomQuote.text}"</blockquote><cite>— ${randomQuote.author}</cite>`;
    document.body.appendChild(quoteEl);
};

interface ClockWidget {
    id: string;
    updateInterval: number; 
}

const clockWidget: ClockWidget = {
    id: 'live-clock',
    updateInterval: 1000
};

const initClock = (): void => {
    const clockEl: HTMLElement = document.createElement('div');
    clockEl.id = clockWidget.id;
    clockEl.style.position = 'fixed';
    clockEl.style.top = '10px';
    clockEl.style.right = '10px';
    clockEl.style.padding = '8px 12px';
    clockEl.style.backgroundColor = 'var(--color-quaternary)';
    clockEl.style.color = '#fff';
    clockEl.style.borderRadius = '4px';
    document.body.appendChild(clockEl);

    const updateClock = (): void => {
        const now: Date = new Date();
        clockEl.innerText = now.toLocaleTimeString();
    };

    updateClock();
    setInterval(updateClock, clockWidget.updateInterval);
};

interface Theme {
    name: string;
    backgroundColor: string;
    textColor: string;
}

const themes: Theme[] = [
    { name: 'light', backgroundColor: 'var(--color-octonary)', textColor: 'var(--color-septenary)' },
    { name: 'dark', backgroundColor: '#2c3e50', textColor: '#ecf0f1' }
];

let currentThemeIndex = 0;

const switchTheme = (): void => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const theme: Theme = themes[currentThemeIndex];
    document.body.style.backgroundColor = theme.backgroundColor;
    document.body.style.color = theme.textColor;
};

const initThemeSwitcher = (): void => {
    const themeButton: HTMLButtonElement = document.createElement('button');
    themeButton.id = 'theme-switcher';
    themeButton.innerText = 'Switch Theme';
    themeButton.style.position = 'fixed';
    themeButton.style.bottom = '70px';
    themeButton.style.right = '30px';
    themeButton.style.padding = '10px 15px';
    themeButton.style.backgroundColor = 'var(--color-primary)';
    themeButton.style.color = '#fff';
    themeButton.style.border = 'none';
    themeButton.style.borderRadius = '4px';
    themeButton.style.cursor = 'pointer';
    document.body.appendChild(themeButton);
    themeButton.addEventListener('click', (e: MouseEvent): void => switchTheme());
};

interface MobileMenu {
    buttonId: string;
    navSelector: string;
}

const mobileMenu: MobileMenu = {
    buttonId: 'mobile-menu-button',
    navSelector: 'nav.site-nav'
};

const initMobileMenu = (): void => {
    const navMenu: HTMLElement | null = document.querySelector(mobileMenu.navSelector);
    if (!navMenu) return;
    const menuButton: HTMLButtonElement = document.createElement('button');
    menuButton.id = mobileMenu.buttonId;
    menuButton.innerText = '☰';
    menuButton.style.position = 'fixed';
    menuButton.style.top = '10px';
    menuButton.style.left = '10px';
    menuButton.style.padding = '10px';
    menuButton.style.backgroundColor = 'var(--color-primary)';
    menuButton.style.color = '#fff';
    menuButton.style.border = 'none';
    menuButton.style.borderRadius = '4px';
    menuButton.style.zIndex = '1001';
    document.body.appendChild(menuButton);
    menuButton.addEventListener('click', (e: MouseEvent): void => {
        navMenu.classList.toggle('active');
    });
};

const initBuild = (): void => {
    console.log('Cool animation initialized!');
    initFadeIn();
    initBackToTop();
    initQuoteOfDay();
    initClock();
    initThemeSwitcher();
    initMobileMenu();
};

window.addEventListener('DOMContentLoaded', initBuild);

export {};