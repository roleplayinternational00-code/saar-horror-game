// Die Saar-Legende - Utility Functions

const Utils = {
    // Random number between min and max
    random: (min, max) => Math.random() * (max - min) + min,
    
    // Random integer between min and max
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    
    // Clamp value between min and max
    clamp: (value, min, max) => Math.max(min, Math.min(max, value)),
    
    // Linear interpolation
    lerp: (start, end, t) => start + (end - start) * t,
    
    // Distance between two 3D points
    distance3D: (x1, y1, z1, x2, y2, z2) => {
        return Math.sqrt(
            Math.pow(x2 - x1, 2) +
            Math.pow(y2 - y1, 2) +
            Math.pow(z2 - z1, 2)
        );
    },
    
    // Distance between two 2D points
    distance2D: (x1, z1, x2, z2) => {
        return Math.sqrt(
            Math.pow(x2 - x1, 2) +
            Math.pow(z2 - z1, 2)
        );
    },
    
    // Format time (seconds to MM:SS)
    formatTime: (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    
    // Get random element from array
    randomChoice: (array) => array[Math.floor(Math.random() * array.length)],
    
    // Shuffle array
    shuffle: (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    // Debug mode
    DEBUG: false,
    
    log: (...args) => {
        if (Utils.DEBUG) console.log('[Game]', ...args);
    },
    
    warn: (...args) => {
        if (Utils.DEBUG) console.warn('[Game]', ...args);
    },
    
    error: (...args) => {
        console.error('[Game]', ...args);
    }
};

// Make Utils global
window.Utils = Utils;