class Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;

    constructor(x: number, y: number, size: number, speedX: number, speedY: number, color: string) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(canvas: HTMLCanvasElement) {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.speedX *= -1;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.speedY *= -1;
        }
    }
}

function initParticles() {
    const container = document.getElementById('particle-container') as HTMLElement;
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    const particles: Particle[] = [];
    for (let i = 0; i < 100; i++) {
        const size = Math.random() * 5 + 2;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = (Math.random() - 0.5) * 2;
        const speedY = (Math.random() - 0.5) * 2;
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        particles.push(new Particle(x, y, size, speedX, speedY, color));
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((particle) => {
            particle.update(canvas);
            particle.draw(ctx);
        });
        requestAnimationFrame(animate);
    }

    animate();
}

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
});
