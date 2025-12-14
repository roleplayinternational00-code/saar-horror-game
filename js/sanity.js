// Die Saar-Legende - Sanity System

class SanityManager {
    constructor() {
        this.sanity = 100;
        this.maxSanity = 100;
        this.drainRate = 0.5; // per second in darkness
        this.restoreRate = 2; // per second in safe areas
        this.lowSanityThreshold = 30;
        this.isInDarkness = false;
        this.isInSafeZone = false;
        this.lastUpdate = Date.now();
    }
    
    update(delta) {
        const now = Date.now();
        const timeDiff = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;
        
        // Drain sanity in darkness
        if (this.isInDarkness) {
            this.sanity -= this.drainRate * timeDiff;
        }
        
        // Restore in safe zones
        if (this.isInSafeZone) {
            this.sanity += this.restoreRate * timeDiff;
        }
        
        // Clamp sanity
        this.sanity = Utils.clamp(this.sanity, 0, this.maxSanity);
        
        // Update UI
        if (window.uiManager) {
            uiManager.updateSanity(this.getPercent());
        }
        
        // Trigger effects at low sanity
        if (this.sanity < this.lowSanityThreshold) {
            this.triggerLowSanityEffects();
        }
        
        // Game over at 0 sanity
        if (this.sanity <= 0) {
            this.onSanityDepleted();
        }
    }
    
    decrease(amount) {
        this.sanity -= amount;
        this.sanity = Math.max(0, this.sanity);
        
        if (window.uiManager) {
            uiManager.updateSanity(this.getPercent());
        }
        
        Utils.log('Sanity decreased by', amount, 'Current:', this.sanity);
    }
    
    increase(amount) {
        this.sanity += amount;
        this.sanity = Math.min(this.maxSanity, this.sanity);
        
        if (window.uiManager) {
            uiManager.updateSanity(this.getPercent());
        }
    }
    
    getPercent() {
        return (this.sanity / this.maxSanity) * 100;
    }
    
    setInDarkness(value) {
        this.isInDarkness = value;
    }
    
    setInSafeZone(value) {
        this.isInSafeZone = value;
    }
    
    triggerLowSanityEffects() {
        // Random whispers
        if (Math.random() < 0.01 && window.audioManager) {
            audioManager.playWhisper();
        }
        
        // Visual distortions (handled by renderer)
        if (window.game && window.game.renderer) {
            // Add grain/vignette effect
        }
    }
    
    onSanityDepleted() {
        Utils.log('Sanity depleted - Game Over');
        if (window.game) {
            game.gameOver('Du hast deinen Verstand verloren...');
        }
    }
    
    // Sanity events
    onSeeEnemy() {
        this.decrease(10);
        if (window.audioManager) {
            audioManager.playHeartbeat();
        }
    }
    
    onJumpScare() {
        this.decrease(15);
        if (window.audioManager) {
            audioManager.playJumpScare();
        }
    }
    
    onReadDocument() {
        this.increase(5);
    }
    
    reset() {
        this.sanity = this.maxSanity;
        this.isInDarkness = false;
        this.isInSafeZone = false;
        this.lastUpdate = Date.now();
    }
}

// Create global sanity manager
const sanityManager = new SanityManager();
window.sanityManager = sanityManager;