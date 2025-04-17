interface Vector {
    x: number;
    y: number;
}

interface PhysicsObject {
    position: Vector;
    velocity: Vector;
    radius: number;
    mass: number;
    color: string;
}

interface SimulationConfig {
    gravity: Vector;
    wind: Vector;
    drag: number;
    friction: number;
    restitution: number;
    canvasWidth: number;
    canvasHeight: number;
}

interface PhysicsEffects {
    gravityEnabled: boolean;
    windEnabled: boolean;
    dragEnabled: boolean;
}

class PhysicsSimulation {
    private canvas!: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null = null;
    private objects: PhysicsObject[] = [
        this.createBall({ x: 100, y: 100 }, { x: 4, y: -2 }, 20, 1, '#e74c3c'),
        this.createBall({ x: 300, y: 50 }, { x: -3, y: 3 }, 15, 1, '#2ecc71')
    ];
    private config: SimulationConfig = {
        gravity: { x: 0, y: 0.5 },
        wind: { x: 0.1, y: 0 },
        drag: 0.995,
        friction: 0.99,
        restitution: 0.9,
        canvasWidth: 600,
        canvasHeight: 400,
    };
    private effects: PhysicsEffects = {
        gravityEnabled: true,
        windEnabled: true,
        dragEnabled: true,
    };

    private randomColor(): string {
        const hex: string = Math.floor(Math.random() * 16777215).toString(16);
        return '#' + ('000000' + hex).slice(-6);
    }

    private createBall(position: Vector, velocity: Vector, radius: number, mass: number, color: string): PhysicsObject {
        return { position, velocity, radius, mass, color };
    }

    public initTesting(): void {
        const canvasElem = document.getElementById('physics-canvas');
        if (!(canvasElem instanceof HTMLCanvasElement)) {
            console.error("Canvas element not found or of wrong type");
            return;
        }
        this.canvas = canvasElem;
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error("Failed to obtain 2D rendering context");
            return;
        }
        this.canvas.width = this.config.canvasWidth;
        this.canvas.height = this.config.canvasHeight;

        this.canvas.addEventListener('click', (e: MouseEvent): void => {
            const rect = this.canvas.getBoundingClientRect();
            const clickPos: Vector = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            const newVelocity: Vector = { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8 };
            const newRadius = Math.random() * 15 + 10;
            this.objects.push(this.createBall(clickPos, newVelocity, newRadius, 1, this.randomColor()));
        });

        window.addEventListener('keydown', (e: KeyboardEvent): void => {
            const key = e.key.toLowerCase();
            if (key === 'arrowup') {
                this.applyForce({ x: 0, y: -2 });
            } else if (key === 'arrowdown') {
                this.applyForce({ x: 0, y: 2 });
            } else if (key === 'arrowleft') {
                this.applyForce({ x: -2, y: 0 });
            } else if (key === 'arrowright') {
                this.applyForce({ x: 2, y: 0 });
            } else if (key === 'r') {
                this.objects.length = 0;
                this.objects.push(
                    this.createBall({ x: 100, y: 100 }, { x: 4, y: -2 }, 20, 1, '#e74c3c'),
                    this.createBall({ x: 300, y: 50 }, { x: -3, y: 3 }, 15, 1, '#2ecc71')
                );
            } else if (key === 'g') {
                this.effects.gravityEnabled = !this.effects.gravityEnabled;
                console.log(`Gravity enabled: ${this.effects.gravityEnabled}`);
            } else if (key === 'w') {
                this.effects.windEnabled = !this.effects.windEnabled;
                console.log(`Wind enabled: ${this.effects.windEnabled}`);
            } else if (key === 'd') {
                this.effects.dragEnabled = !this.effects.dragEnabled;
                console.log(`Drag enabled: ${this.effects.dragEnabled}`);
            }
        });

        const controlButtons = [
            { id: 'force-up',    force: { x: 0, y: -2 } },
            { id: 'force-down',  force: { x: 0, y: 2 } },
            { id: 'force-left',  force: { x: -2, y: 0 } },
            { id: 'force-right', force: { x: 2, y: 0 } }
        ];
        controlButtons.forEach(control => {
            const btn = document.getElementById(control.id);
            if (btn) {
                btn.addEventListener('click', () => this.applyForce(control.force));
            }
        });

        const toggleButtons = [
            { id: 'toggle-gravity', action: () => { this.effects.gravityEnabled = !this.effects.gravityEnabled; console.log(`Gravity: ${this.effects.gravityEnabled}`); } },
            { id: 'toggle-wind',    action: () => { this.effects.windEnabled    = !this.effects.windEnabled;    console.log(`Wind: ${this.effects.windEnabled}`); } },
            { id: 'toggle-drag',    action: () => { this.effects.dragEnabled    = !this.effects.dragEnabled;    console.log(`Drag: ${this.effects.dragEnabled}`); } }
        ];
        toggleButtons.forEach(control => {
            const btn = document.getElementById(control.id);
            if (btn) {
                btn.addEventListener('click', control.action);
            }
        });

        this.update();
    }

    private update(): void {
        const context = this.ctx; 
        if (!context) return;
        context.clearRect(0, 0, this.config.canvasWidth, this.config.canvasHeight);
        this.handleCollisions();

        this.objects.forEach((obj: PhysicsObject) => {
            const gravity = this.effects.gravityEnabled ? this.config.gravity : { x: 0, y: 0 };
            const wind    = this.effects.windEnabled    ? this.config.wind    : { x: 0, y: 0 };
            obj.velocity.x += gravity.x + wind.x;
            obj.velocity.y += gravity.y + wind.y;

            obj.position.x += obj.velocity.x;
            obj.position.y += obj.velocity.y;

            const dragFactor = this.effects.dragEnabled ? this.config.drag : 1;
            obj.velocity.x *= dragFactor;
            obj.velocity.y *= dragFactor;

            if (obj.position.x + obj.radius > this.config.canvasWidth) {
                obj.position.x = this.config.canvasWidth - obj.radius;
                obj.velocity.x = -obj.velocity.x * this.config.friction;
            } else if (obj.position.x - obj.radius < 0) {
                obj.position.x = obj.radius;
                obj.velocity.x = -obj.velocity.x * this.config.friction;
            }

            if (obj.position.y + obj.radius > this.config.canvasHeight) {
                obj.position.y = this.config.canvasHeight - obj.radius;
                obj.velocity.y = -obj.velocity.y * this.config.friction;
            } else if (obj.position.y - obj.radius < 0) {
                obj.position.y = obj.radius;
                obj.velocity.y = -obj.velocity.y * this.config.friction;
            }

            context.beginPath();
            context.arc(obj.position.x, obj.position.y, obj.radius, 0, Math.PI * 2);
            context.fillStyle = obj.color;
            context.fill();
            context.closePath();
        });
        requestAnimationFrame(() => this.update());
    }

    private handleCollisions(): void {
        for (let i = 0; i < this.objects.length; i++) {
            for (let j = i + 1; j < this.objects.length; j++) {
                const obj1 = this.objects[i];
                const obj2 = this.objects[j];
                const dx = obj2.position.x - obj1.position.x;
                const dy = obj2.position.y - obj1.position.y;
                const distance = Math.hypot(dx, dy);
                if (distance < obj1.radius + obj2.radius) {
                    this.resolveCollision(obj1, obj2);

                    const overlap = obj1.radius + obj2.radius - distance;
                    const correctionX = (overlap * (dx / distance)) / 2;
                    const correctionY = (overlap * (dy / distance)) / 2;
                    obj1.position.x -= correctionX;
                    obj1.position.y -= correctionY;
                    obj2.position.x += correctionX;
                    obj2.position.y += correctionY;
                }
            }
        }
    }

    private resolveCollision(obj1: PhysicsObject, obj2: PhysicsObject): void {
        const dx = obj2.position.x - obj1.position.x;
        const dy = obj2.position.y - obj1.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance === 0) return;
        const nx = dx / distance;
        const ny = dy / distance;
        const dvx = obj1.velocity.x - obj2.velocity.x;
        const dvy = obj1.velocity.y - obj2.velocity.y;
        const dot = dvx * nx + dvy * ny;

        if (dot > 0) return;
        const impulse = (-(1 + this.config.restitution) * dot) / ((1 / obj1.mass) + (1 / obj2.mass));
        obj1.velocity.x += (impulse * nx) / obj1.mass;
        obj1.velocity.y += (impulse * ny) / obj1.mass;
        obj2.velocity.x -= (impulse * nx) / obj2.mass;
        obj2.velocity.y -= (impulse * ny) / obj2.mass;
    }

    private applyForce(force: Vector): void {
        this.objects.forEach((obj: PhysicsObject) => {
            obj.velocity.x += force.x;
            obj.velocity.y += force.y;
        });
    }
}

const sim = new PhysicsSimulation();
(window as any).initTesting = () => sim.initTesting();
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => sim.initTesting());
} else {
    sim.initTesting();
}

export {};
