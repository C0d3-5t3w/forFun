interface Quote {
    readonly text: string;
    readonly author: string;
}

interface Feature {
    init(): void;
}

interface ClockWidgetConfig {
    readonly id: string;
    readonly updateInterval: number;
}

interface Theme {
    readonly name: string;
    readonly backgroundColor: string;
    readonly textColor: string;
}

interface MobileMenuConfig {
    readonly buttonId: string;
    readonly navSelector: string;
}

class FadeInFeature implements Feature {
    private readonly threshold: number = 0.1;

    public init(): void {
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
            { threshold: this.threshold }
        );
        fadeInElements.forEach((el: HTMLElement): void => observer.observe(el));
    }
}

class BackToTopFeature implements Feature {
    private readonly buttonId: string = 'back-to-top';
    private readonly buttonText: string = '↑Top↑';
    private readonly scrollThreshold: number = 300;

    public init(): void {
        const backToTopButton: HTMLButtonElement = document.createElement('button');
        backToTopButton.id = this.buttonId;
        backToTopButton.innerText = this.buttonText;
        document.body.appendChild(backToTopButton);
        
        backToTopButton.addEventListener('click', (): void => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        window.addEventListener('scroll', (): void => {
            if (window.pageYOffset > this.scrollThreshold) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
    }
}

class QuoteOfDayFeature implements Feature {
    private readonly quotes: readonly Quote[] = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
        { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
        { text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
        { text: "What we think, we become.", author: "Buddha" }
    ];
    private readonly elementId: string = 'quote-of-day';

    public init(): void {
        const randomQuote: Quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        const quoteEl: HTMLElement = document.createElement('div');
        quoteEl.id = this.elementId;
        quoteEl.innerHTML = `<blockquote>"${randomQuote.text}"</blockquote><cite>— ${randomQuote.author}</cite>`;
        document.body.appendChild(quoteEl);
    }
}

class ClockFeature implements Feature {
    private readonly config: ClockWidgetConfig;

    constructor(config: ClockWidgetConfig) {
        this.config = config;
    }

    public init(): void {
        const clockEl: HTMLElement = document.createElement('div');
        clockEl.id = this.config.id;
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
        setInterval(updateClock, this.config.updateInterval);
    }
}

class ThemeSwitcherFeature implements Feature {
    private readonly themes: readonly Theme[] = [
        { name: 'light', backgroundColor: 'var(--color-octonary)', textColor: 'var(--color-septenary)' },
        { name: 'dark', backgroundColor: '#2c3e50', textColor: '#ecf0f1' }
    ];
    private readonly buttonId: string = 'theme-switcher';
    private currentThemeIndex: number = 0;

    public init(): void {
        const themeButton: HTMLButtonElement = document.createElement('button');
        themeButton.id = this.buttonId;
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
        themeButton.addEventListener('click', (): void => this.switchTheme());
    }

    private switchTheme(): void {
        this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
        const theme: Theme = this.themes[this.currentThemeIndex];
        document.body.style.backgroundColor = theme.backgroundColor;
        document.body.style.color = theme.textColor;
    }
}

class MobileMenuFeature implements Feature {
    private readonly config: MobileMenuConfig;

    constructor(config: MobileMenuConfig) {
        this.config = config;
    }

    public init(): void {
        const navMenu: HTMLElement | null = document.querySelector(this.config.navSelector);
        if (!navMenu) return;
        
        const menuButton: HTMLButtonElement = document.createElement('button');
        menuButton.id = this.config.buttonId;
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
        
        menuButton.addEventListener('click', (): void => {
            navMenu.classList.toggle('active');
        });
    }
}

class App {
    private readonly features: Feature[] = [];

    constructor() {
        this.registerFeatures();
    }

    private registerFeatures(): void {
        const clockConfig: ClockWidgetConfig = {
            id: 'live-clock',
            updateInterval: 1000
        };

        const mobileMenuConfig: MobileMenuConfig = {
            buttonId: 'mobile-menu-button',
            navSelector: 'nav.site-nav'
        };

        this.features.push(
            new FadeInFeature(),
            new BackToTopFeature(),
            new QuoteOfDayFeature(),
            new ClockFeature(clockConfig),
            new ThemeSwitcherFeature(),
            new MobileMenuFeature(mobileMenuConfig)
        );
    }

    public init(): void {
        console.log('Cool animation initialized!');
        this.features.forEach(feature => feature.init());
    }
}

window.addEventListener('DOMContentLoaded', (): void => {
    const app = new App();
    app.init();
});

export {};