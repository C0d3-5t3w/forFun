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

const SIM_CONFIG: SimulationConfig = {
    gravity: { x: 0, y: 0.5 },
    wind: { x: 0.1, y: 0 },
    drag: 0.995,
    friction: 0.99,
    restitution: 0.9,
    canvasWidth: 600,
    canvasHeight: 400,
};

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;

const randomColor = (): string => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

const createBall = (position: Vector, velocity: Vector, radius: number, mass: number, color: string): PhysicsObject => ({
    position,
    velocity,
    radius,
    mass,
    color
});

const objects: PhysicsObject[] = [
    createBall({ x: 100, y: 100 }, { x: 4, y: -2 }, 20, 1, '#e74c3c'),
    createBall({ x: 300, y: 50 }, { x: -3, y: 3 }, 15, 1, '#2ecc71')
];

const resolveCollision = (obj1: PhysicsObject, obj2: PhysicsObject): void => {
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
    const impulse = (-(1 + SIM_CONFIG.restitution) * dot) / ((1 / obj1.mass) + (1 / obj2.mass));
    obj1.velocity.x += (impulse * nx) / obj1.mass;
    obj1.velocity.y += (impulse * ny) / obj1.mass;
    obj2.velocity.x -= (impulse * nx) / obj2.mass;
    obj2.velocity.y -= (impulse * ny) / obj2.mass;
};

const handleCollisions = (): void => {
    for (let i = 0; i < objects.length; i++) {
        for (let j = i + 1; j < objects.length; j++) {
            const obj1 = objects[i];
            const obj2 = objects[j];
            const dx = obj2.position.x - obj1.position.x;
            const dy = obj2.position.y - obj1.position.y;
            const distance = Math.hypot(dx, dy);
            if (distance < obj1.radius + obj2.radius) {
                resolveCollision(obj1, obj2);

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
};

interface PhysicsEffects {
    gravityEnabled: boolean;
    windEnabled: boolean;
    dragEnabled: boolean;
}

const PHYSICS_EFFECTS: PhysicsEffects = {
    gravityEnabled: true,
    windEnabled: true,
    dragEnabled: true,
};

const update = (): void => {
    const context = ctx; 
    if (!context) return;
    context.clearRect(0, 0, SIM_CONFIG.canvasWidth, SIM_CONFIG.canvasHeight);
    handleCollisions();

    objects.forEach((obj: PhysicsObject) => {
        
        const gravity = PHYSICS_EFFECTS.gravityEnabled ? SIM_CONFIG.gravity : { x: 0, y: 0 };
        const wind    = PHYSICS_EFFECTS.windEnabled    ? SIM_CONFIG.wind    : { x: 0, y: 0 };
        obj.velocity.x += gravity.x + wind.x;
        obj.velocity.y += gravity.y + wind.y;

        obj.position.x += obj.velocity.x;
        obj.position.y += obj.velocity.y;

        
        const dragFactor = PHYSICS_EFFECTS.dragEnabled ? SIM_CONFIG.drag : 1;
        obj.velocity.x *= dragFactor;
        obj.velocity.y *= dragFactor;

        if (obj.position.x + obj.radius > SIM_CONFIG.canvasWidth) {
            obj.position.x = SIM_CONFIG.canvasWidth - obj.radius;
            obj.velocity.x = -obj.velocity.x * SIM_CONFIG.friction;
        } else if (obj.position.x - obj.radius < 0) {
            obj.position.x = obj.radius;
            obj.velocity.x = -obj.velocity.x * SIM_CONFIG.friction;
        }

        if (obj.position.y + obj.radius > SIM_CONFIG.canvasHeight) {
            obj.position.y = SIM_CONFIG.canvasHeight - obj.radius;
            obj.velocity.y = -obj.velocity.y * SIM_CONFIG.friction;
        } else if (obj.position.y - obj.radius < 0) {
            obj.position.y = obj.radius;
            obj.velocity.y = -obj.velocity.y * SIM_CONFIG.friction;
        }

        context.beginPath();
        context.arc(obj.position.x, obj.position.y, obj.radius, 0, Math.PI * 2);
        context.fillStyle = obj.color;
        context.fill();
        context.closePath();
    });
    requestAnimationFrame(update);
};

function applyForce(force: Vector): void {
    objects.forEach((obj: PhysicsObject) => {
        obj.velocity.x += force.x;
        obj.velocity.y += force.y;
    });
}

function initTesting(): void {
    
    const canvasElem = document.getElementById('physics-canvas');
    if (!(canvasElem instanceof HTMLCanvasElement)) {
        console.error("Canvas element not found or of wrong type");
        return;
    }
    canvas = canvasElem;
    ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error("Failed to obtain 2D rendering context");
        return;
    }
    canvas.width = SIM_CONFIG.canvasWidth;
    canvas.height = SIM_CONFIG.canvasHeight;
    
    canvas.addEventListener('click', (e: MouseEvent): void => {
        const rect = canvas.getBoundingClientRect();
        const clickPos: Vector = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        const newVelocity: Vector = { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8 };
        const newRadius = Math.random() * 15 + 10;
        objects.push(createBall(clickPos, newVelocity, newRadius, 1, randomColor()));
    });
    
    
    window.addEventListener('keydown', (e: KeyboardEvent): void => {
        const key = e.key.toLowerCase();
        if (key === 'arrowup') {
            applyForce({ x: 0, y: -2 });
        } else if (key === 'arrowdown') {
            applyForce({ x: 0, y: 2 });
        } else if (key === 'arrowleft') {
            applyForce({ x: -2, y: 0 });
        } else if (key === 'arrowright') {
            applyForce({ x: 2, y: 0 });
        } else if (key === 'r') {
            objects.length = 0;
            objects.push(
                createBall({ x: 100, y: 100 }, { x: 4, y: -2 }, 20, 1, '#e74c3c'),
                createBall({ x: 300, y: 50 }, { x: -3, y: 3 }, 15, 1, '#2ecc71')
            );
        } else if (key === 'g') {
            PHYSICS_EFFECTS.gravityEnabled = !PHYSICS_EFFECTS.gravityEnabled;
            console.log(`Gravity enabled: ${PHYSICS_EFFECTS.gravityEnabled}`);
        } else if (key === 'w') {
            PHYSICS_EFFECTS.windEnabled = !PHYSICS_EFFECTS.windEnabled;
            console.log(`Wind enabled: ${PHYSICS_EFFECTS.windEnabled}`);
        } else if (key === 'd') {
            PHYSICS_EFFECTS.dragEnabled = !PHYSICS_EFFECTS.dragEnabled;
            console.log(`Drag enabled: ${PHYSICS_EFFECTS.dragEnabled}`);
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
            btn.addEventListener('click', () => applyForce(control.force));
        }
    });
    
    const toggleButtons = [
        { id: 'toggle-gravity', action: () => { PHYSICS_EFFECTS.gravityEnabled = !PHYSICS_EFFECTS.gravityEnabled; console.log(`Gravity: ${PHYSICS_EFFECTS.gravityEnabled}`); } },
        { id: 'toggle-wind',    action: () => { PHYSICS_EFFECTS.windEnabled    = !PHYSICS_EFFECTS.windEnabled;    console.log(`Wind: ${PHYSICS_EFFECTS.windEnabled}`); } },
        { id: 'toggle-drag',    action: () => { PHYSICS_EFFECTS.dragEnabled    = !PHYSICS_EFFECTS.dragEnabled;    console.log(`Drag: ${PHYSICS_EFFECTS.dragEnabled}`); } }
    ];
    toggleButtons.forEach(control => {
        const btn = document.getElementById(control.id);
        if (btn) {
            btn.addEventListener('click', control.action);
        }
    });
    
    update();
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initTesting);
} else {
    initTesting();
}

(window as any).initTesting = initTesting;

export {};
