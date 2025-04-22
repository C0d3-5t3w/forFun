interface Vector {
    x: number;
    y: number;
}

interface PhysicsObject {
    playerId: string | null;
    username: string | null;
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
    private objects: PhysicsObject[] = [];
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

    private createBall(playerId: string | null, username: string | null, position: Vector, velocity: Vector, radius: number, mass: number, color: string): PhysicsObject {
        return { playerId, username, position, velocity, radius, mass, color };
    }

    public addPlayerBall(playerId: string, username: string): void {
        const startX = Math.random() * (this.config.canvasWidth - 100) + 50;
        const startY = Math.random() * (this.config.canvasHeight - 100) + 50;
        const startVelX = (Math.random() - 0.5) * 2;
        const startVelY = (Math.random() - 0.5) * 2;
        const radius = 15;
        const mass = 1;
        const color = this.randomColor();

        const newBall = this.createBall(playerId, username, { x: startX, y: startY }, { x: startVelX, y: startVelY }, radius, mass, color);
        this.objects.push(newBall);
        console.log(`Added ball for ${username} (${playerId})`);
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

        window.addEventListener('keydown', (e: KeyboardEvent): void => {
            const key = e.key.toLowerCase();
            if (key === 'g') {
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

            if (obj.username) {
                context.fillStyle = '#ffffff';
                context.textAlign = 'center';
                context.font = '12px Arial';
                context.fillText(obj.username, obj.position.x, obj.position.y - obj.radius - 5);
            }
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

    public applyForce(playerId: string, force: Vector): void {
        const targetObject = this.objects.find(obj => obj.playerId === playerId);
        if (targetObject) {
            targetObject.velocity.x += force.x;
            targetObject.velocity.y += force.y;
        } else {
            console.warn(`Attempted to apply force to non-existent player ID: ${playerId}`);
        }
    }
}


interface ChatMessage {
    id: string;
    content: string;
    username: string;
    timestamp: string;
}

class ChatApp {
    private messagesElement: HTMLElement | null = null;
    private inputElement: HTMLInputElement | null = null;
    private usernameElement: HTMLInputElement | null = null;
    private submitButton: HTMLButtonElement | null = null;
    private statusElement: HTMLElement | null = null;
    private apiUrl: string = '/api/messages';
    private messages: ChatMessage[] = [];
    private refreshInterval: number = 3000; 
    private isConnected: boolean = true;
    private retryCount: number = 0;
    private maxRetries: number = 5;
    private debug: boolean = true;

    private players: Set<string> = new Set();
    private physicsSim: PhysicsSimulation;

    constructor(physicsSim: PhysicsSimulation) {
        this.physicsSim = physicsSim;
    }

    public initChat(): void {
        this.messagesElement = document.getElementById('chat-messages');
        this.inputElement = document.getElementById('message-input') as HTMLInputElement;
        this.usernameElement = document.getElementById('username-input') as HTMLInputElement;
        this.submitButton = document.getElementById('send-message') as HTMLButtonElement;
        this.statusElement = document.getElementById('connection-status');

        if (!this.messagesElement || !this.inputElement || !this.submitButton || !this.usernameElement) {
            console.error("Chat elements not found");
            return;
        }

        this.submitButton.addEventListener('click', () => this.sendMessage());
        this.inputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        const storedUsername = localStorage.getItem('chatUsername');
        if (storedUsername) {
            this.usernameElement.value = storedUsername;
        }

        this.fetchMessages();

        setInterval(() => this.fetchMessages(), this.refreshInterval);
    }

    private updateConnectionStatus(isConnected: boolean, message?: string): void {
        if (!this.statusElement) return;
        
        this.isConnected = isConnected;
        
        if (isConnected) {
            this.statusElement.textContent = "Connected";
            this.statusElement.classList.remove('disconnected');
            this.statusElement.classList.add('connected');
            this.submitButton?.removeAttribute('disabled');
            this.retryCount = 0;
        } else {
            this.statusElement.textContent = message || "Connection lost";
            this.statusElement.classList.remove('connected');
            this.statusElement.classList.add('disconnected');
            this.submitButton?.setAttribute('disabled', 'disabled');
        }
    }

    private async fetchMessages(): Promise<void> {
        this.log('Fetching messages...');
        try {
            const response = await fetch(this.apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const messages: ChatMessage[] = await response.json();
            this.messages = messages;
            this.renderMessages();
            
            this.log(`Fetched ${messages.length} messages`);
            
            if (!this.isConnected) {
                this.updateConnectionStatus(true);
            }
        } catch (error) {
            this.log('Error fetching messages:', error);
            
            this.retryCount++;
            if (this.retryCount <= this.maxRetries) {
                this.updateConnectionStatus(false, `Connection error. Retry ${this.retryCount}/${this.maxRetries}...`);
            } else {
                this.updateConnectionStatus(false, "Connection failed. Please check your network.");
            }
        }
    }

    private async sendMessage(): Promise<void> {
        if (!this.inputElement?.value.trim() || !this.isConnected) {
            return;
        }

        const username = this.usernameElement?.value.trim() || 'Anonymous';
        const content = this.inputElement.value.trim();
        
        const playerId = username;

        if (!this.players.has(playerId)) {
            this.players.add(playerId);
            this.physicsSim.addPlayerBall(playerId, username);
            this.log(`Player ${username} joined the game.`);
        }

        if (this.handleCommand(playerId, content)) {
            this.inputElement.value = '';
            return;
        }

        this.submitButton!.disabled = true;
        this.submitButton!.textContent = "Sending...";
        
        localStorage.setItem('chatUsername', username);

        this.log('Sending message:', { username, content });

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    content: content,
                    username: username
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
            }

            this.inputElement.value = '';
            
            this.fetchMessages();
        } catch (error) {
            console.error("Failed to send message:", error);
            alert(`Failed to send message: ${error}`);
        } finally {
            this.submitButton!.disabled = false;
            this.submitButton!.textContent = "Send";
        }
    }

    private handleCommand(playerId: string, command: string): boolean {
        const normalizedCommand = command.toLowerCase().trim();
        let force: Vector | null = null;
        const forceMagnitude = 2;

        switch (normalizedCommand) {
            case '!up':
                force = { x: 0, y: -forceMagnitude };
                break;
            case '!down':
                force = { x: 0, y: forceMagnitude };
                break;
            case '!left':
                force = { x: -forceMagnitude, y: 0 };
                break;
            case '!right':
                force = { x: forceMagnitude, y: 0 };
                break;
            default:
                return false;
        }

        if (force) {
            this.log(`Applying force ${JSON.stringify(force)} to player ${playerId}`);
            this.physicsSim.applyForce(playerId, force);
            return true;
        }
        return false;
    }

    private renderMessages(): void {
        if (!this.messagesElement) return;

        this.messagesElement.innerHTML = '';

        if (this.messages.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = 'No messages yet. Be the first to send a message!';
            this.messagesElement.appendChild(emptyMessage);
            return;
        }

        this.messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = 'chat-message';

            const timestamp = new Date(message.timestamp);
            const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            messageElement.innerHTML = `
                <div class="message-header">
                    <span class="username">${message.username}</span>
                    <span class="timestamp">${formattedTime}</span>
                </div>
                <div class="message-content">${this.escapeHTML(message.content)}</div>
            `;

            this.messagesElement?.appendChild(messageElement);
        });

        this.messagesElement.scrollTop = this.messagesElement.scrollHeight;
    }

    private escapeHTML(text: string): string {
        const element = document.createElement('div');
        element.textContent = text;
        return element.innerHTML;
    }

    private log(...args: any[]): void {
        if (this.debug) {
            console.log('[ChatApp]', ...args);
        }
    }
}


const sim = new PhysicsSimulation();
const chatApp = new ChatApp(sim);

(window as any).initTesting = () => {
    sim.initTesting();
    chatApp.initChat();
};

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
        sim.initTesting();
        chatApp.initChat();
    });
} else {
    sim.initTesting();
    chatApp.initChat();
}

export {};
