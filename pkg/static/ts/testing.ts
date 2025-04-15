// Interfaces for type safety
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

// Constants for easy modification
const GRAVITY: Vector = { x: 0, y: 0.5 };
const FRICTION: number = 0.99;
const RESTITUTION: number = 0.9; // New: collision elasticity
const CANVAS_WIDTH: number = 600;
const CANVAS_HEIGHT: number = 400;

// Get canvas and context
const canvas = document.getElementById('physics-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

// Utility for random color
const randomColor = (): string => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');

// Create a new physics object (ball)
const createBall = (position: Vector, velocity: Vector, radius: number, mass: number, color: string): PhysicsObject => ({
    position,
    velocity,
    radius,
    mass,
    color
});

// Initialize objects array with some starting balls
const objects: PhysicsObject[] = [
    createBall({ x: 100, y: 100 }, { x: 4, y: -2 }, 20, 1, '#e74c3c'),
    createBall({ x: 300, y: 50 }, { x: -3, y: 3 }, 15, 1, '#2ecc71')
];

// --- New Feature: Collision Handling ---

// Resolve collision between two objects
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
    // Only resolve if objects are moving toward each other
    if (dot > 0) return;
    const impulse = (-(1 + RESTITUTION) * dot) / ((1 / obj1.mass) + (1 / obj2.mass));
    obj1.velocity.x += (impulse * nx) / obj1.mass;
    obj1.velocity.y += (impulse * ny) / obj1.mass;
    obj2.velocity.x -= (impulse * nx) / obj2.mass;
    obj2.velocity.y -= (impulse * ny) / obj2.mass;
};

// Check and resolve collisions between all objects
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
                // Simple position correction to avoid overlap
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

// --- End Collision Handling ---

// Update and render physics objects
const update = (): void => {
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    handleCollisions(); // New: check collisions before drawing
    
    objects.forEach((obj: PhysicsObject) => {
        // Apply gravity and update velocity
        obj.velocity.x += GRAVITY.x;
        obj.velocity.y += GRAVITY.y;
        // Update position based on velocity
        obj.position.x += obj.velocity.x;
        obj.position.y += obj.velocity.y;
        // Bounce off the horizontal walls
        if (obj.position.x + obj.radius > CANVAS_WIDTH) {
            obj.position.x = CANVAS_WIDTH - obj.radius;
            obj.velocity.x = -obj.velocity.x * FRICTION;
        } else if (obj.position.x - obj.radius < 0) {
            obj.position.x = obj.radius;
            obj.velocity.x = -obj.velocity.x * FRICTION;
        }
        // Bounce off the vertical boundaries
        if (obj.position.y + obj.radius > CANVAS_HEIGHT) {
            obj.position.y = CANVAS_HEIGHT - obj.radius;
            obj.velocity.y = -obj.velocity.y * FRICTION;
        } else if (obj.position.y - obj.radius < 0) {
            obj.position.y = obj.radius;
            obj.velocity.y = -obj.velocity.y * FRICTION;
        }
        // Draw the ball
        ctx.beginPath();
        ctx.arc(obj.position.x, obj.position.y, obj.radius, 0, Math.PI * 2);
        ctx.fillStyle = obj.color;
        ctx.fill();
        ctx.closePath();
    });
    requestAnimationFrame(update);
};

// On canvas click, spawn a new ball at the mouse position with random velocity
canvas.addEventListener('click', (e: MouseEvent): void => {
    const rect = canvas.getBoundingClientRect();
    const clickPos: Vector = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    // Random initial velocity for fun
    const newVelocity: Vector = { 
        x: (Math.random() - 0.5) * 8, 
        y: (Math.random() - 0.5) * 8 
    };
    const newRadius = Math.random() * 15 + 10;
    objects.push(createBall(clickPos, newVelocity, newRadius, 1, randomColor()));
});

// New: Listen for "r" key to reset the simulation
window.addEventListener('keydown', (e: KeyboardEvent): void => {
    if (e.key.toLowerCase() === 'r') {
        objects.length = 0;
        objects.push(
            createBall({ x: 100, y: 100 }, { x: 4, y: -2 }, 20, 1, '#e74c3c'),
            createBall({ x: 300, y: 50 }, { x: -3, y: 3 }, 15, 1, '#2ecc71')
        );
    }
});

// Set canvas dimensions to constants
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Start the simulation when content is loaded
window.addEventListener('DOMContentLoaded', update);
