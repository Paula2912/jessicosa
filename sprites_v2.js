/**
 * Sprite Generator - ADVANCED (Fixed Single-Char Palette v2)
 * Generates animated pixel art sequences.
 */

// Single Character Mapping for Chibi Palette
const PALETTE = {
    // Basics
    't': 'rgba(0,0,0,0)', // Transparent
    'k': '#000000',       // Black / Outline / Glasses Frame

    // Skin Tones
    'A': '#ffe0bd', // Skin Light (Face center)
    'B': '#ffccaa', // Skin Normal
    'C': '#e1ac96', // Skin Dark/Shadow

    // Hair (Browns)
    'H': '#2d1b0e', // Hair Darkest
    'I': '#4e342e', // Hair Dark
    'J': '#795548', // Hair Light

    // Blonde (Tips)
    'Y': '#fbc02d', // Blonde Dark
    'Z': '#fff176', // Blonde Light

    // Red/Pink (Limoncin Top)
    'R': '#c2185b', // Red Dark
    'S': '#e91e63', // Red Mid
    'T': '#f48fb1', // Red Light

    // Purple (Jessicosa Top)
    'P': '#7b1fa2', // Purple Dark
    'Q': '#9c27b0', // Purple Mid
    'M': '#ce93d8', // Purple Light

    // Blue (Jeans)
    'U': '#1565c0', // Blue Dark
    'V': '#42a5f5', // Blue Light

    // Dark Blue (Jessicosa Pants)
    'D': '#1a237e',
    'E': '#303f9f',

    // Shoes
    'F': '#3e2723',  // Dark Brown

    // NEW COLORS FOR CUSTOM SPRITES
    'W': '#d7ccc8', // Beige (Coat / Siamese Body)
    'G': '#9e9e9e', // Grey (Glasses lens?)
    'L': '#f5f5f5', // White/Light
    'O': '#ff9800'  // Orange (Beak/Feet)
};

class SpriteGenerator {
    static generateFrame(map, scale = 3) {
        const rows = map.length;
        const cols = map[0].length;

        const canvas = document.createElement('canvas');
        canvas.width = cols * scale;
        canvas.height = rows * scale;
        const ctx = canvas.getContext('2d');

        for (let y = 0; y < rows; y++) {
            let rowStr = map[y];
            for (let x = 0; x < cols; x++) {
                // Read 1 char
                let key = rowStr[x];
                let color = PALETTE[key];
                if (color) {
                    ctx.fillStyle = color;
                    ctx.fillRect(x * scale, y * scale, scale, scale);
                }
            }
        }

        const img = new Image();
        img.src = canvas.toDataURL();
        return img;
    }

    static createAnimationSet(maps) {
        return maps.map(m => this.generateFrame(m));
    }
}

// --- LIMONCIN (PENGUIN) ---
const charA_Idle = [
    [
        "tttttttttttttttttttttttt",
        "ttttttttttkkkktttttttttt",
        "tttttttttkkkkkkttttttttt", // Head
        "ttttttttkkkkkkkktttttttt",
        "ttttttttkkLOOLkktttttttt", // Eyes + Beak (O)
        "ttttttttkkLkkLkktttttttt",
        "tttttttkkkkOOkkkkttttttt",
        "ttttttkkkkkkkkkkkktttttt",
        "ttttttkkkLLLLLLkkktttttt", // Belly White
        "tttttkkkkLLLLLLkkkkttttt",
        "tttttOkkLLLLLLLLkkOttttt", // Arms/Wings
        "tttttOkkLLLLLLLLkkOttttt",
        "tttttkkkLLLLLLLLkkkttttt",
        "ttttttkkLLLLLLLLkktttttt",
        "ttttttkkkkLLLLkkkktttttt",
        "ttttttkkkkkkkkkkkktttttt",
        "tttttttkkkkkkkkkkttttttt",
        "ttttttttOOttttOOtttttttt", // Feet Orange
        "ttttttttOOttttOOtttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt"
    ],
    [ // Bounce
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "ttttttttttkkkktttttttttt",
        "tttttttttkkkkkkttttttttt",
        "ttttttttkkkkkkkktttttttt",
        "ttttttttkkLOOLkktttttttt",
        "ttttttttkkLkkLkktttttttt",
        "tttttttkkkkOOkkkkttttttt",
        "ttttttkkkkkkkkkkkktttttt",
        "ttttttkkkLLLLLLkkktttttt",
        "tttttkkkkLLLLLLkkkkttttt",
        "tttttOkkLLLLLLLLkkOttttt",
        "tttttOkkLLLLLLLLkkOttttt",
        "tttttkkkLLLLLLLLkkkttttt",
        "ttttttkkLLLLLLLLkktttttt",
        "ttttttkkkkLLLLkkkktttttt",
        "ttttttkkkkkkkkkkkktttttt",
        "tttttttkkkkkkkkkkttttttt",
        "ttttttttOOttttOOtttttttt",
        "ttttttttOOttttOOtttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt"
    ]
];

const charA_Run = [
    [ // Waddle 1
        "tttttttttttttttttttttttt",
        "ttttttttttkkkktttttttttt",
        "tttttttttkkkkkkttttttttt",
        "ttttttttkkkkkkkktttttttt",
        "ttttttttkkLOOLkktttttttt",
        "ttttttttkkLkkLkktttttttt",
        "tttttttkkkkOOkkkkttttttt",
        "ttttttkkkkkkkkkkkktttttt",
        "ttttttkkkLLLLLLkkktttttt",
        "tttttOkkkLLLLLLkkOtttttt", // Wings flap up
        "tttttOkkkLLLLLLkkOtttttt",
        "ttttttkkLLLLLLLLkktttttt",
        "ttttttkkLLLLLLLLkktttttt",
        "ttttttkkkkLLLLkkkktttttt",
        "ttttttkkkkkkkkkkkktttttt",
        "tttttttkkkkkkkkkkttttttt",
        "ttttttttOOtttttttttttttt", // Left Foot Up
        "ttttttttOOttttOOtttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt"
    ],
    [ // Waddle 2
        "tttttttttttttttttttttttt",
        "ttttttttttkkkktttttttttt",
        "tttttttttkkkkkkttttttttt",
        "ttttttttkkkkkkkktttttttt",
        "ttttttttkkLOOLkktttttttt",
        "ttttttttkkLkkLkktttttttt",
        "tttttttkkkkOOkkkkttttttt",
        "ttttttkkkkkkkkkkkktttttt",
        "ttttttkkkLLLLLLkkktttttt",
        "ttttttOkkLLLLLLkkkOttttt", // Wings down
        "ttttttOkkLLLLLLkkkOttttt",
        "ttttttkkLLLLLLLLkktttttt",
        "ttttttkkLLLLLLLLkktttttt",
        "ttttttkkkkLLLLkkkktttttt",
        "ttttttkkkkkkkkkkkktttttt",
        "tttttttkkkkkkkkkkttttttt",
        "ttttttttttttttOOtttttttt", // Right Foot Up
        "ttttttttOOttttOOtttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt"
    ]
];


// --- JESSICOSA (SIAMESE CAT) ---
const charB_Idle = [
    [
        "tttttttttttttttttttttttt",
        "ttttttttttHHttHHtttttttt", // Ears (Dark Brown H)
        "tttttttttHHHWWHHHttttttt",
        "ttttttttWWWWWWWWWttttttt", // Head (Beige W)
        "ttttttttHHVHVHVHHttttttt", // Mask (H) + Blue Eyes (V)
        "ttttttttHHWHWHWHHttttttt",
        "ttttttttttHkHkHttttttttt", // Nose/Mouth
        "ttttttttWWWWWWWWWttttttt",
        "tttttttWWWWWWWWWWWHHtttt", // Body + Tail start (H)
        "ttttttWWWWWWWWWWWHHHtttt",
        "tttttWWWWWWWWWWWWHHttttt",
        "tttttWWWWWWWWWWWWttttttt",
        "tttttWWWWWWWWWWWWttttttt",
        "tttttWWWWWWWWWWWtttttttt",
        "ttttttWWWWWWWWWWtttttttt",
        "ttttttHHttttttHHtttttttt", // Paws (Dark Brown)
        "ttttttHHttttttHHtttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt"
    ],
    [ // Bounce
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "ttttttttttHHttHHtttttttt",
        "tttttttttHHHWWHHHttttttt",
        "ttttttttWWWWWWWWWttttttt",
        "ttttttttHHVHVHVHHttttttt",
        "ttttttttHHWHWHWHHttttttt",
        "ttttttttttHkHkHttttttttt",
        "ttttttttWWWWWWWWWttttttt",
        "tttttttWWWWWWWWWWWHHtttt",
        "ttttttWWWWWWWWWWWHHHtttt",
        "tttttWWWWWWWWWWWWHHttttt",
        "tttttWWWWWWWWWWWWttttttt",
        "tttttWWWWWWWWWWWWttttttt",
        "tttttWWWWWWWWWWWtttttttt",
        "ttttttWWWWWWWWWWtttttttt",
        "ttttttHHttttttHHtttttttt",
        "ttttttHHttttttHHtttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt"
    ]
];

const charB_Run = [
    [ // Run 1
        "tttttttttttttttttttttttt",
        "ttttttttttHHttHHtttttttt",
        "tttttttttHHHWWHHHttttttt",
        "ttttttttWWWWWWWWWttttttt",
        "ttttttttHHVHVHVHHttttttt",
        "ttttttttHHWHWHWHHttttttt",
        "ttttttttttHkHkHttttttttt",
        "ttttttttWWWWWWWWWWWHHttt",
        "ttttttWWWWWWWWWWWHHHtttt", // Tail up
        "tttttWWWWWWWWWWWWHHttttt",
        "tttttWWWWWWWWWWWWttttttt",
        "ttttWWWWWWWWWWWWtttttttt",
        "tttttWWWWWWWWWWWtttttttt",
        "ttttttWWWWWWWWWWtttttttt",
        "tttttHHttttttttHHttttttt", // Paws spread
        "tttttHHttttttttHHttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt"
    ],
    [ // Run 2
        "tttttttttttttttttttttttt",
        "ttttttttttHHttHHtttttttt",
        "tttttttttHHHWWHHHttttttt",
        "ttttttttWWWWWWWWWttttttt",
        "ttttttttHHVHVHVHHttttttt",
        "ttttttttHHWHWHWHHttttttt",
        "ttttttttttHkHkHttttttttt",
        "ttttttttWWWWWWWWWWWHHttt",
        "ttttttWWWWWWWWWWWHHHtttt",
        "tttttWWWWWWWWWWWWHHttttt",
        "tttttWWWWWWWWWWWWttttttt",
        "tttttWWWWWWWWWWWWttttttt",
        "ttttttWWWWWWWWWWtttttttt",
        "ttttttWWWWWWWWWWtttttttt", // Compact
        "ttttttHHttttttHHtttttttt",
        "ttttttHHttttttHHtttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt"
    ]
];

// --- ENEMY (Heart Breaker Monster) ---
const charEnemy_Run = [
    [
        "tttttttttttttttttttttttt",
        "ttttttttttkkkktttttttttt",
        "tttttttttkkkkkkttttttttt", // Horns
        "ttttttttkkkkkkkktttttttt",
        "tttttttkkkkkkkkkkttttttt",
        "ttttttkkwwkkkkwwkktttttt", // Eyes (ww)
        "ttttttkkkwkkkkkwkktttttt",
        "ttttttkkkkkkkkkkkktttttt",
        "ttttttkkkRRkkRRkkktttttt", // Cheeks (Red)
        "tttttttkkkkkkkkkkttttttt",
        "ttttttttkkkkkkkktttttttt",
        "tttttttttkkkkkkttttttttt",
        "ttttttttkkkkkkkktttttttt", // Body
        "ttttttkkkkkkkkkkkktttttt",
        "tttttkkkkkkkkkkkkkkttttt", // Arms
        "ttttkkkkkkkkkkkkkkkktttt",
        "ttttkkkkkkkkkkkkkkkktttt",
        "ttttttttkkkkkkkktttttttt",
        "ttttttttkkkkkkkktttttttt",
        "tttttttkkkttttkkkttttttt", // Legs
        "tttttttkkkttttkkkttttttt",
        "ttttttkkkttttttkkktttttt",
        "ttttttkkkttttttkkktttttt",
        "tttttttttttttttttttttttt"
    ],
    [
        "tttttttttttttttttttttttt",
        "ttttttttttkkkktttttttttt",
        "tttttttttkkkkkkttttttttt",
        "ttttttttkkkkkkkktttttttt",
        "tttttttkkkkkkkkkkttttttt",
        "ttttttkkwwkkkkwwkktttttt",
        "ttttttkkkwkkkkkwkktttttt",
        "ttttttkkkkkkkkkkkktttttt",
        "ttttttkkkRRkkRRkkktttttt",
        "tttttttkkkkkkkkkkttttttt",
        "ttttttttkkkkkkkktttttttt",
        "tttttttttkkkkkkttttttttt",
        "ttttttttkkkkkkkktttttttt",
        "ttttttkkkkkkkkkkkktttttt",
        "tttttkkkkkkkkkkkkkkttttt",
        "ttttkkkkkkkkkkkkkkkktttt",
        "ttttkkkkkkkkkkkkkkkktttt",
        "ttttttttkkkkkkkktttttttt",
        "ttttttttkkkkkkkktttttttt",
        "ttttttttkkkttkkktttttttt", // Legs close
        "ttttttttkkkttkkktttttttt",
        "ttttttttkkkttkkktttttttt",
        "ttttttttkkkttkkktttttttt",
        "tttttttttttttttttttttttt"
    ]
];

// --- ENEMIES ---
// 1. Shadow Stalker (Ground) - Updated from previous
const charEnemy_Walk = charEnemy_Run; // Alias

// 2. Flying Heart Eater (Bat-like)
const charEnemy_Fly = [
    [
        "tttttttttttttttttttttttt",
        "ttttttkkttttttttkktttttt",
        "tttttkkkkttttttkkkkttttt",
        "ttttkkkkkttttttkkkkktttt",
        "tttkwwkkkttttttkkkwwkttt", // Wings open
        "tttkwwkkkttttttkkkwwkttt",
        "tttkwwkkkkkkkkkkkkwwkttt",
        "tttkwwkkkkkkkkkkkkwwkttt",
        "ttttkkkkRRkkRRkkkktttttt", // Face
        "ttttttkkwwkkwwkktttttttt",
        "ttttttkkkkkkkkkktttttttt",
        "tttttttkkkkkkkkttttttttt",
        "ttttttttkkkkkktttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt"
    ],
    [
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "ttttttttkkttttkktttttttt", // Wings down
        "tttttttkkkkkkkkkkttttttt",
        "ttttttkkkkkkkkkkkktttttt",
        "ttttttkkkkkkkkkkkktttttt",
        "ttttttkkkRRkkRRkkktttttt",
        "ttttttttkkwwkkwwkktttttt",
        "ttttttttkkkkkkkkkktttttt",
        "tttttttttkkkkkkkkttttttt",
        "ttttttttttkkkkkktttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt",
        "tttttttttttttttttttttttt"
    ]
];

// Export assets object
const Assets = {
    limoncin: { idle: [], run: [], jump: [] },
    jessicosa: { idle: [], run: [], jump: [] },
    enemy: { run: [] }, // Standard
    enemyFly: { run: [] }, // Flying
    init: function () {
        console.log("Generating High-Res Sprites v2...");
        this.limoncin.idle = SpriteGenerator.createAnimationSet(charA_Idle);
        this.limoncin.run = SpriteGenerator.createAnimationSet(charA_Run);
        this.limoncin.jump = [this.limoncin.run[0]];

        this.jessicosa.idle = SpriteGenerator.createAnimationSet(charB_Idle);
        this.jessicosa.run = SpriteGenerator.createAnimationSet(charB_Run);
        this.jessicosa.jump = [this.jessicosa.run[0]];

        this.enemy.run = SpriteGenerator.createAnimationSet(charEnemy_Walk);
        this.enemy.idle = this.enemy.run;

        this.enemyFly.run = SpriteGenerator.createAnimationSet(charEnemy_Fly);
        this.enemyFly.idle = this.enemyFly.run;

        console.log("Sprites Ready!");
    }
};
