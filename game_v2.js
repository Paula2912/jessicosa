/**
 * Valentine's Adventure - ADVANCED ENGINE v3
 * Features: Asset Preloader, Error Handling, Physics, Animation
 */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Physics Constants ---
const GRAVITY = 0.6;
const ACCEL = 0.5;
const FRICTION = 0.8;
const MAX_SPEED = 7;
const JUMP_FORCE = -12;
const LEVEL_WIDTH = 4500; // Longer levels!
const LEVEL_HEIGHT = 600;
const VIEWPORT_W = 800;
const VIEWPORT_H = 450;

// FIX: Set internal canvas resolution
canvas.width = VIEWPORT_W;
canvas.height = VIEWPORT_H;

// --- Assets Manifest --- 
const ASSET_MANIFEST = [
    { key: 'bg0', src: 'assets/backgrounds/bg_parque.jpg' },
    { key: 'bg1', src: 'assets/backgrounds/bg_plaza.jpg' },
    { key: 'bg2', src: 'assets/backgrounds/bg_museo.jpg' },
    { key: 'bg3', src: 'assets/backgrounds/bg_giralda.jpg' },
    { key: 'bg4', src: 'assets/backgrounds/bg_cadiz.jpg' },
    { key: 'photo1', src: 'assets/photos/photo1.jpg' },
    { key: 'photo2', src: 'assets/photos/photo2.jpg' },
    { key: 'photo3', src: 'assets/photos/photo3.jpg' },
    { key: 'photo4', src: 'assets/photos/photo4.jpg' },
    { key: 'photo5', src: 'assets/photos/photo5.jpg' }
];

const IMAGES = {}; // Loaded images stored here

// Fallback colors
const BG_COLORS = ['#87CEEB', '#ffccbc', '#D3D3D3', '#FFE0B2', '#80DEEA'];

// --- Game State ---
let gameState = {
    running: false,
    levelIdx: 0,
    lives: 3,
    hearts: 0,
    camera: { x: 0, y: 0 },
    finished: false,
    projectiles: [], // New: Combat
    lastShotTime: 0
};

// --- Entities ---
class Entity {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = 0;
        this.vy = 0;
        this.color = color;
        this.frameTimer = 0;
        this.frameInterval = 10;
        this.currentFrame = 0;
        this.facingRight = true;
        this.animState = 'idle';
        this.spriteSet = null;
        this.markedForDeletion = false;
    }

    rectIntersect(other) {
        return (
            this.x < other.x + other.w &&
            this.x + this.w > other.x &&
            this.y < other.y + other.h &&
            this.y + this.h > other.y
        );
    }

    draw(ctx, camX, camY) {
        let drawX = this.x - camX;
        let drawY = this.y - camY;

        if (this.spriteSet && this.spriteSet[this.animState] && this.spriteSet[this.animState].length > 0) {
            this.frameTimer++;
            if (this.frameTimer >= this.frameInterval) {
                this.currentFrame++;
                this.frameTimer = 0;
            }

            const frames = this.spriteSet[this.animState];
            const frameImg = frames[this.currentFrame % frames.length];

            if (frameImg) {
                ctx.save();
                if (!this.facingRight) {
                    ctx.translate(drawX + this.w / 2, drawY + this.h / 2);
                    ctx.scale(-1, 1);
                    ctx.translate(-(drawX + this.w / 2), -(drawY + this.h / 2));
                }

                const spriteScale = 2.0;
                const sW = frameImg.width * spriteScale;
                const sH = frameImg.height * spriteScale;
                const sX = drawX + (this.w - sW) / 2;
                const sY = drawY + (this.h - sH);

                ctx.drawImage(frameImg, sX, sY, sW, sH);
                ctx.restore();
                return; // Drawn successfully
            }
        }

        // Fallback: Default Rectangle
        ctx.fillStyle = this.color;
        ctx.fillRect(drawX, drawY, this.w, this.h);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(drawX, drawY, this.w, this.h);
    }
}

// Debug Helper
function log(msg) {
    console.log(msg);
    const dbg = document.getElementById('debug-console');
    if (dbg) {
        dbg.innerHTML += "<div>" + msg + "</div>";
        dbg.scrollTop = dbg.scrollHeight;
    }
}

// --- Projectile Class ---
class Projectile {
    constructor(x, y, facingRight) {
        this.x = x;
        this.y = y;
        this.w = 40; // Even longer
        this.h = 10; // Thicker
        this.vx = facingRight ? 12 : -12; // Slightly slower to be visible
        this.life = 60;
        this.markedForDeletion = false;
    }

    update() {
        this.x += this.vx;
        this.life--;
        if (this.life <= 0) {
            this.markedForDeletion = true;
        }
    }

    draw(ctx, camX, camY) {
        let drawX = this.x - camX;
        let drawY = this.y - camY;

        ctx.save();

        // 1. Black Outline (High Contrast)
        ctx.fillStyle = 'black';
        ctx.fillRect(drawX - 2, drawY - 2, this.w + 4, this.h + 4);

        // 2. Cyan Outer Glow
        ctx.fillStyle = '#00FFFF'; // Cyan
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00FFFF';
        ctx.fillRect(drawX, drawY, this.w, this.h);

        // 3. White Core
        ctx.fillStyle = 'white';
        ctx.shadowBlur = 0;
        ctx.fillRect(drawX + 2, drawY + 2, this.w - 4, this.h - 4);

        ctx.restore();
    }

    rectIntersect(other) {
        return (
            this.x < other.x + other.w &&
            this.x + this.w > other.x &&
            this.y < other.y + other.h &&
            this.y + this.h > other.y
        );
    }
}

class Player extends Entity {
    constructor(x, y) {
        super(x, y, 48, 64, 'pink');
        this.grounded = false;
        this.invincible = false;
        this.frameInterval = 5;
        this.jumpHeld = false;
    }

    update() {
        // Controls
        if (keys['ArrowRight'] || keys['KeyD']) {
            this.vx += ACCEL;
            this.facingRight = true;
        } else if (keys['ArrowLeft'] || keys['KeyA']) {
            this.vx -= ACCEL;
            this.facingRight = false;
        } else {
            this.vx *= FRICTION;
        }

        if (this.vx > MAX_SPEED) this.vx = MAX_SPEED;
        if (this.vx < -MAX_SPEED) this.vx = -MAX_SPEED;
        if (Math.abs(this.vx) < 0.1) this.vx = 0;

        // Jump 
        const jumpKey = keys['Space'] || keys['ArrowUp'] || keys['KeyW'];
        if (jumpKey && this.grounded) {
            this.vy = JUMP_FORCE;
            this.grounded = false;
            this.jumpHeld = true;
        } else if (!jumpKey && this.jumpHeld && this.vy < JUMP_FORCE / 2) {
            this.vy = JUMP_FORCE / 2;
            this.jumpHeld = false;
        } else if (!jumpKey) {
            this.jumpHeld = false;
        }

        // Shoot (Key X or Shift - Left/Right)
        if (keys['KeyX'] || keys['ShiftLeft'] || keys['ShiftRight']) {
            this.shoot();
        }

        this.vy += GRAVITY;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) { this.x = 0; this.vx = 0; }
        if (this.x > LEVEL_WIDTH - this.w) { this.x = LEVEL_WIDTH - this.w; this.vx = 0; }

        if (this.y > LEVEL_HEIGHT + 100) {
            takeDamage();
            this.x -= 200;
            if (this.x < 50) this.x = 50;
            this.y = 0;
            this.vy = 0;
        }

        if (!this.grounded) {
            this.animState = 'jump';
        } else {
            if (Math.abs(this.vx) > 0.5) {
                this.animState = 'run';
            } else {
                this.animState = 'idle';
            }
        }
        this.grounded = false;
    }

    shoot() {
        const now = Date.now();
        if (now - gameState.lastShotTime > 400) { // Cooldown
            gameState.lastShotTime = now;
            // Spawn bullet
            const pX = this.facingRight ? this.x + this.w : this.x - 12;
            gameState.projectiles.push(new Projectile(pX, this.y + 20, this.facingRight));
        }
    }

    checkPlatformCollisions(platforms) {
        for (let p of platforms) {
            if (this.x + this.w > p.x && this.x < p.x + p.w &&
                this.y + this.h >= p.y && this.y + this.h <= p.y + p.h + this.vy + 20 &&
                this.vy >= 0) {

                this.y = p.y - this.h;
                this.vy = 0;
                this.grounded = true;
            }
        }
    }
}

class Enemy extends Entity {
    constructor(x, y, range, type = 'walk') {
        super(x, y, 48, 48, '#000000');
        this.startX = x;
        this.startY = y;
        this.range = range;
        this.vx = 2;
        this.facingRight = true;
        this.type = type;

        if (type === 'fly') {
            this.spriteSet = Assets.enemyFly;
            this.vy = 0;
            this.theta = 0;
        } else {
            this.spriteSet = Assets.enemy;
        }
        this.animState = 'run';
    }

    update() {
        if (this.type === 'walk') {
            this.x += this.vx;
            if (this.x > this.startX + this.range) {
                this.vx = -Math.abs(this.vx);
                this.facingRight = false;
            }
            if (this.x < this.startX) {
                this.vx = Math.abs(this.vx);
                this.facingRight = true;
            }
        } else if (this.type === 'fly') {
            this.x += this.vx;
            this.theta += 0.1;
            this.y = this.startY + Math.sin(this.theta) * 50; // Fly up/down

            if (this.x > this.startX + this.range) {
                this.vx = -Math.abs(this.vx);
                this.facingRight = false;
            }
            if (this.x < this.startX) {
                this.vx = Math.abs(this.vx);
                this.facingRight = true;
            }
        }
    }
}

class Heart extends Entity {
    constructor(x, y) {
        super(x, y, 30, 30, 'pink');
        this.floatOffset = 0;
    }

    draw(ctx, camX, camY) {
        this.floatOffset += 0.1;
        let drawX = this.x - camX;
        let drawY = this.y - camY + Math.sin(this.floatOffset) * 5;
        ctx.font = "30px Arial";
        ctx.fillText("💎", drawX, drawY + 30);
    }
}

// --- Global Objects ---
let player;
let partner;
let platforms = [];
let enemies = [];
let items = [];

// --- Init & Control ---
const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

document.getElementById('start-btn').addEventListener('click', startPreload); // Changed to startPreload
document.getElementById('select-char-a').addEventListener('click', () => selectChar('A'));
document.getElementById('select-char-b').addEventListener('click', () => selectChar('B'));
document.getElementById('next-level-btn').addEventListener('click', nextLevel);
document.getElementById('restart-btn').addEventListener('click', () => location.reload());

let selectedChar = null;

function selectChar(char) {
    selectedChar = char;
    document.querySelectorAll('.char-option').forEach(el => el.classList.remove('selected'));
    document.getElementById(char === 'A' ? 'select-char-a' : 'select-char-b').classList.add('selected');
}


// --- Init on Load ---
window.onload = function () {
    try {
        log("Iniciando motor del juego...");
        if (typeof Assets === 'undefined') {
            throw new Error("Assets object not found! Check sprites.js");
        }

        Assets.init();
        log("Assets generados. Idles A: " + Assets.limoncin.idle.length);

        // Show previews
        const previewA = document.getElementById('preview-a');
        const previewB = document.getElementById('preview-b');

        if (Assets.limoncin.idle.length > 0) {
            const imgA = Assets.limoncin.idle[0];
            imgA.style.width = '100%';
            imgA.style.height = '100%';
            imgA.style.objectFit = 'contain';
            previewA.appendChild(imgA);
            log("Preview A OK");
        } else {
            log("WARN: No sprites for Limoncin");
        }

        if (Assets.jessicosa.idle.length > 0) {
            const imgB = Assets.jessicosa.idle[0];
            imgB.style.width = '100%';
            imgB.style.height = '100%';
            imgB.style.objectFit = 'contain';
            previewB.appendChild(imgB);
            log("Preview B OK");
        }

        // Setup Touch
        const btnLeft = document.getElementById('btn-left');
        const btnRight = document.getElementById('btn-right');
        const btnJump = document.getElementById('btn-jump');
        const handleTouch = (key, state) => { keys[key] = state; };
        if (btnLeft) {
            btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); handleTouch('ArrowLeft', true); });
            btnLeft.addEventListener('touchend', (e) => { e.preventDefault(); handleTouch('ArrowLeft', false); });
        }
        if (btnRight) {
            btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); handleTouch('ArrowRight', true); });
            btnRight.addEventListener('touchend', (e) => { e.preventDefault(); handleTouch('ArrowRight', false); });
        }
        if (btnJump) {
            btnJump.addEventListener('touchstart', (e) => { e.preventDefault(); handleTouch('Space', true); });
            btnJump.addEventListener('touchend', (e) => { e.preventDefault(); handleTouch('Space', false); });
        }
    } catch (e) {
        alert("Error Fatal en Inicio: " + e.message);
        console.error(e);
    }
};

// --- Asset Loader ---
function startPreload() {
    if (!selectedChar) {
        alert("¡Elige a LIMONCIN o JESSICOSA!");
        return;
    }

    document.getElementById('start-screen').classList.add('hidden');

    // Show loading text on canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("Cargando recuerdos...", canvas.width / 2, canvas.height / 2);

    let loadedCount = 0;
    let errors = [];

    ASSET_MANIFEST.forEach(asset => {
        const img = new Image();
        img.src = asset.src;
        img.onload = () => {
            loadedCount++;
            checkDone();
        };
        img.onerror = () => {
            console.error("Failed to load: " + asset.src);
            errors.push(asset.src);
            loadedCount++; // Count anyway to finish
            checkDone();
        };
        IMAGES[asset.key] = img;
    });

    function checkDone() {
        if (loadedCount === ASSET_MANIFEST.length) {
            // ALWAYS START, even with errors
            if (errors.length > 0) {
                console.warn("Missing assets:", errors);
                // Optional: Show a quick toast or just proceed
            }
            setupGame();
        }
    }
}

function setupGame() {
    try {
        // Assets already init on load

        player = new Player(50, 400);
        partner = new Entity(0, 0, 40, 60, 'blue');

        if (typeof Assets === 'undefined') throw new Error("Assets undefined");

        if (selectedChar === 'A') {
            player.spriteSet = Assets.limoncin;
            partner.spriteSet = Assets.jessicosa;
        } else {
            player.spriteSet = Assets.jessicosa;
            partner.spriteSet = Assets.limoncin;
        }
        partner.animState = 'idle';

        document.getElementById('hud').classList.remove('hidden');

        gameState.running = true;
        loadLevel(0);
        requestAnimationFrame(gameLoop);
    } catch (e) {
        alert("Error al iniciar juego: " + e.message + "\n" + e.stack);
    }
}

function loadLevel(idx) {
    gameState.levelIdx = idx;

    const levelName = ["Parque María Luisa", "Plaza de España", "Museo Bellas Artes", "Mirador Giralda", "Cádiz"][idx];
    document.getElementById('level-name-display').innerText = levelName;
    const bgUrl = ASSET_MANIFEST.find(a => a.key === 'bg' + idx)?.src;
    const bgDiv = document.getElementById('game-background');
    if (bgUrl) bgDiv.style.backgroundImage = `url('${bgUrl}')`;
    else bgDiv.style.backgroundColor = BG_COLORS[idx];

    player.x = 50;
    player.y = 300;
    player.vx = 0;

    platforms = [];
    enemies = [];
    items = [];

    // Base Floor
    platforms.push({ x: 0, y: 400, w: LEVEL_WIDTH, h: 60, color: '#5D4037' });

    // Procedural Gen - Advanced
    let currentX = 400;
    while (currentX < LEVEL_WIDTH - 400) {
        let r = Math.random();

        // 30% Chance of Stairs (Verticality)
        if (r < 0.3) {
            let startY = 300;
            for (let i = 0; i < 3; i++) {
                platforms.push({ x: currentX + (i * 120), y: startY - (i * 60), w: 100, h: 20, color: '#795548' });
                // Top stair item
                if (i === 2) items.push(new Heart(currentX + (i * 120) + 35, startY - (i * 60) - 40));
            }
            currentX += 400;
        }
        // 70% Standard Platforms
        else {
            let w = 150 + Math.random() * 200;
            let y = 250 + Math.random() * 120;
            platforms.push({ x: currentX, y: y, w: w, h: 20, color: '#8D6E63' });

            // Enemies
            if (Math.random() < 0.5) {
                let type = Math.random() < 0.5 ? 'walk' : 'fly';
                if (type === 'walk') {
                    enemies.push(new Enemy(currentX + 20, y - 48, w - 40, 'walk'));
                } else {
                    enemies.push(new Enemy(currentX, y - 150, 200, 'fly'));
                }
            }
            if (Math.random() < 0.8) items.push(new Heart(currentX + w / 2, y - 40));

            currentX += w + 100 + Math.random() * 100;
        }
    }

    if (idx === 4) {
        partner.x = LEVEL_WIDTH - 200;
        partner.y = 340;
        partner.facingRight = false;
    } else {
        items.push(new Entity(LEVEL_WIDTH - 100, 200, 20, 200, '#FFC107'));
    }

    updateUI();
}

function takeDamage() {
    if (player.invincible) return;

    gameState.lives--;
    updateUI();

    player.invincible = true;
    player.vx = -10;
    player.vy = -5;

    setTimeout(() => player.invincible = false, 1500);

    if (gameState.lives <= 0) {
        gameOver();
    }
}

function gameOver() {
    gameState.running = false;
    document.getElementById('game-over-screen').classList.remove('hidden');
    document.getElementById('ui-layer').style.pointerEvents = 'auto';
}

function levelComplete() {
    gameState.running = false;
    document.getElementById('next-dest').innerText = "Siguiente Nivel >>";
    document.getElementById('win-screen').classList.remove('hidden');
    document.getElementById('ui-layer').style.pointerEvents = 'auto';
}

function nextLevel() {
    document.getElementById('win-screen').classList.add('hidden');
    document.getElementById('ui-layer').style.pointerEvents = 'none';
    const next = gameState.levelIdx + 1;
    if (next < 5) {
        gameState.running = true;
        loadLevel(next);
        requestAnimationFrame(gameLoop);
    } else {
        triggerEnding();
    }
}

function updateUI() {
    document.getElementById('lives-display').innerText = gameState.lives;
    document.getElementById('hearts-display').innerText = gameState.hearts;
}

// --- Main Loop ---
function gameLoop() {
    if (!gameState.running) return;

    // Updates
    player.update();
    player.checkPlatformCollisions(platforms);
    enemies.forEach(e => e.update());

    // Projectiles
    gameState.projectiles.forEach(p => p.update());
    gameState.projectiles = gameState.projectiles.filter(p => p.life > 0);

    // Camera
    gameState.camera.x = player.x - VIEWPORT_W / 2;
    if (gameState.camera.x < 0) gameState.camera.x = 0;
    if (gameState.camera.x > LEVEL_WIDTH - VIEWPORT_W) gameState.camera.x = LEVEL_WIDTH - VIEWPORT_W;

    // Parallax Background
    const bgDiv = document.getElementById('game-background');
    bgDiv.style.backgroundPositionX = `${-gameState.camera.x * 0.1}px`;

    // Collisions
    // 1. Projectiles vs Enemies
    for (let p of gameState.projectiles) {
        for (let e of enemies) {
            if (!e.markedForDeletion &&
                p.x < e.x + e.w && p.x + p.w > e.x &&
                p.y < e.y + e.h && p.y + p.h > e.y) {
                // Hit!
                e.markedForDeletion = true;
                p.life = 0; // Destroy bullet
                // Could add particle effect here
            }
        }
    }

    // 2. Player vs Enemies
    for (let e of enemies) {
        if (!e.markedForDeletion && player.rectIntersect(e)) {
            if (player.vy > 0 && player.y + player.h < e.y + e.h * 0.5) {
                // Stomp logic (if we want it)
                e.markedForDeletion = true;
                player.vy = -8;
            } else {
                takeDamage();
            }
        }
    }
    enemies = enemies.filter(e => !e.markedForDeletion);

    // 3. Items
    for (let i of items) {
        if (!i.markedForDeletion && player.rectIntersect(i)) {
            if (i instanceof Heart) {
                // HEAL PLAYER
                if (gameState.lives < 5) {
                    gameState.lives++;
                    // Visual feedback
                    const floatText = new Entity(player.x, player.y - 20, 0, 0, 'transparent');
                    floatText.draw = (ctx, cx, cy) => {
                        ctx.fillStyle = '#00FF00';
                        ctx.font = 'bold 20px Arial';
                        ctx.fillText("+1 VIDA", this.x - cx, this.y - cy);
                    };
                    // (We'd need a particle system for real text, but UI update is enough)
                }
                updateUI();
                i.markedForDeletion = true;
            } else {
                // Goal
                if (gameState.levelIdx < 4) {
                    levelComplete();
                }
            }
        }
    }
    items = items.filter(i => !i.markedForDeletion);

    if (gameState.levelIdx === 4 && player.x > LEVEL_WIDTH - 250) {
        gameState.running = false;
        draw();
        setTimeout(triggerEnding, 1000);
        return;
    }
    else if (player.x > LEVEL_WIDTH - 50 && gameState.levelIdx < 4) {
        levelComplete(); return;
    }

    draw();
    requestAnimationFrame(gameLoop);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Note: Background is CSS

    ctx.save();
    ctx.translate(-gameState.camera.x, 0);

    // Platforms
    for (let p of platforms) {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, p.y, p.w, p.h);

        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(p.x, p.y, p.w, 5);
    }

    items.forEach(i => i.draw(ctx, 0, 0));
    enemies.forEach(e => e.draw(ctx, 0, 0));

    // Draw Projectiles
    gameState.projectiles.forEach(p => p.draw(ctx, 0, 0));

    // Player
    player.draw(ctx, 0, 0); // Player draws itself

    // Partner (Final Level)
    if (gameState.levelIdx === 4 && partner) {
        partner.draw(ctx, 0, 0);
        ctx.fillStyle = 'white';
        ctx.fillRect(partner.x - 30, partner.y - 40, 30, 30);
        ctx.font = '20px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText('❤️', partner.x - 25, partner.y - 18);
    }

    ctx.restore();
}

function triggerEnding() {
    // Cinematic Ending
    gameState.running = false; // Stop physics

    // Position Camera perfectly
    const destCamX = LEVEL_WIDTH - VIEWPORT_W;

    let kissAnim = setInterval(() => {
        // Pan Camera
        gameState.camera.x += (destCamX - gameState.camera.x) * 0.05;
        const bgDiv = document.getElementById('game-background');
        bgDiv.style.backgroundPositionX = `${-gameState.camera.x * 0.1}px`;

        // Move characters together
        if (player.x < partner.x - 40) {
            player.x += 1;
            player.animState = 'run';
            player.facingRight = true;
        } else {
            player.animState = 'idle';
        }

        draw();

        // Draw Heart Bubble manually here
        if (Math.abs(player.x - (partner.x - 40)) < 5) {
            ctx.font = "40px Arial";
            ctx.fillText("❤️", player.x + 20, player.y - 20);
        }

        if (Math.abs(gameState.camera.x - destCamX) < 1 && Math.abs(player.x - (partner.x - 40)) < 2) {
            clearInterval(kissAnim);
            setTimeout(showSlideshow, 1000);
        }
    }, 20); // Slow motion effect by using custom interval
}


// --- Slideshow ---
// --- Slideshow ---
const SLIDE_KEYS = ['photo1', 'photo2', 'photo3', 'photo4', 'photo5'];
const CAPTIONS = [
    'Momentos únicos...',
    'Siempre juntas...',
    'Te quiero...',
    'Aventuras inolvidables...',
    'Gracias por ser mi San Valentín ❤️' // Last photo caption
];
let slideIdx = 0;
let slideInterval;

function showSlideshow() {
    document.getElementById('slideshow-overlay').classList.remove('hidden');
    loadSlide(0);

    if (slideInterval) clearInterval(slideInterval);

    slideInterval = setInterval(() => {
        slideIdx++;
        if (slideIdx < SLIDE_KEYS.length) {
            loadSlide(slideIdx);
        } else if (slideIdx === SLIDE_KEYS.length) {
            // FINAL MESSAGE SCREEN
            document.getElementById('slide-img').style.display = 'none';
            document.getElementById('slide-caption').innerHTML = `
                <h1 style="color: #E91E63; font-size: 30px; margin-bottom: 20px;">¡GRACIAS POR SER MI SAN VALENTÍN!</h1>
                <p style="font-size: 18px;">Eres lo mejor que me ha pasado.</p>
                <p style="font-size: 40px; margin-top: 20px;">❤️🐧🐱❤️</p>
            `;
            clearInterval(slideInterval); // Stop cycling
        }
    }, 4000); // 4 seconds per slide
}

function loadSlide(idx) {
    const key = SLIDE_KEYS[idx];
    const img = IMAGES[key];
    const imgEl = document.getElementById('slide-img');

    // Ensure image is visible for standard slides
    imgEl.style.display = 'block';

    if (img) {
        imgEl.src = img.src;
    }
    document.getElementById('slide-caption').innerText = CAPTIONS[idx];
}

// --- Event Listeners for Info Modal ---
document.getElementById('info-btn').addEventListener('click', () => {
    document.getElementById('info-modal').classList.remove('hidden');
});
document.getElementById('close-info-btn').addEventListener('click', () => {
    document.getElementById('info-modal').classList.add('hidden');
});
