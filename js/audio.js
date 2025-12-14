// Die Saar-Legende - Audio Manager (Web Audio API)

class AudioManager {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.sounds = {};
        this.ambientLoop = null;
        this.musicLoop = null;
        this.volume = 0.7;
        this.enabled = true;
        
        this.init();
    }
    
    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            this.masterGain.gain.value = this.volume;
            
            // Create ambient sounds using oscillators
            this.createAmbientSounds();
            
            Utils.log('Audio Manager initialized');
        } catch (e) {
            Utils.error('Failed to initialize audio:', e);
            this.enabled = false;
        }
    }
    
    createAmbientSounds() {
        // Create water/river ambient sound
        this.createWaterSound();
        // Create wind sound
        this.createWindSound();
        // Create tension drone
        this.createTensionDrone();
    }
    
    createWaterSound() {
        if (!this.enabled) return;
        
        // Use white noise filtered to sound like water
        const bufferSize = 2 * this.context.sampleRate;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const waterSource = this.context.createBufferSource();
        waterSource.buffer = buffer;
        waterSource.loop = true;
        
        const waterFilter = this.context.createBiquadFilter();
        waterFilter.type = 'lowpass';
        waterFilter.frequency.value = 800;
        
        const waterGain = this.context.createGain();
        waterGain.gain.value = 0.15;
        
        waterSource.connect(waterFilter);
        waterFilter.connect(waterGain);
        waterGain.connect(this.masterGain);
        
        this.sounds.water = { source: waterSource, gain: waterGain, filter: waterFilter };
    }
    
    createWindSound() {
        if (!this.enabled) return;
        
        const bufferSize = 2 * this.context.sampleRate;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.5;
        }
        
        const windSource = this.context.createBufferSource();
        windSource.buffer = buffer;
        windSource.loop = true;
        
        const windFilter = this.context.createBiquadFilter();
        windFilter.type = 'bandpass';
        windFilter.frequency.value = 400;
        windFilter.Q.value = 0.5;
        
        const windGain = this.context.createGain();
        windGain.gain.value = 0.1;
        
        windSource.connect(windFilter);
        windFilter.connect(windGain);
        windGain.connect(this.masterGain);
        
        this.sounds.wind = { source: windSource, gain: windGain };
    }
    
    createTensionDrone() {
        if (!this.enabled) return;
        
        const oscillator = this.context.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = 55; // Low A note
        
        const oscillator2 = this.context.createOscillator();
        oscillator2.type = 'sine';
        oscillator2.frequency.value = 58; // Slightly detuned for tension
        
        const droneGain = this.context.createGain();
        droneGain.gain.value = 0;
        
        oscillator.connect(droneGain);
        oscillator2.connect(droneGain);
        droneGain.connect(this.masterGain);
        
        this.sounds.drone = { 
            oscillators: [oscillator, oscillator2], 
            gain: droneGain 
        };
    }
    
    startAmbient() {
        if (!this.enabled) return;
        
        try {
            if (this.sounds.water && this.sounds.water.source.start) {
                this.sounds.water.source.start(0);
            }
            if (this.sounds.wind && this.sounds.wind.source.start) {
                this.sounds.wind.source.start(0);
            }
            if (this.sounds.drone) {
                this.sounds.drone.oscillators.forEach(osc => osc.start(0));
            }
            
            Utils.log('Ambient sounds started');
        } catch (e) {
            Utils.warn('Ambient sounds already started');
        }
    }
    
    setTension(level) {
        // level: 0 to 1
        if (!this.enabled || !this.sounds.drone) return;
        
        const targetVolume = level * 0.08;
        this.sounds.drone.gain.gain.linearRampToValueAtTime(
            targetVolume, 
            this.context.currentTime + 1
        );
    }
    
    playFootstep() {
        if (!this.enabled) return;
        
        const oscillator = this.context.createOscillator();
        oscillator.frequency.value = 100;
        oscillator.type = 'sine';
        
        const gain = this.context.createGain();
        gain.gain.setValueAtTime(0.1, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
        
        oscillator.connect(gain);
        gain.connect(this.masterGain);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.1);
    }
    
    playHeartbeat() {
        if (!this.enabled) return;
        
        // Double thump sound
        for (let i = 0; i < 2; i++) {
            setTimeout(() => {
                const oscillator = this.context.createOscillator();
                oscillator.frequency.value = 60;
                oscillator.type = 'sine';
                
                const gain = this.context.createGain();
                gain.gain.setValueAtTime(0.3, this.context.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.15);
                
                oscillator.connect(gain);
                gain.connect(this.masterGain);
                
                oscillator.start(this.context.currentTime);
                oscillator.stop(this.context.currentTime + 0.15);
            }, i * 200);
        }
    }
    
    playWhisper() {
        if (!this.enabled) return;
        
        // Simulated whisper using filtered noise
        const bufferSize = this.context.sampleRate * 2;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.sin(i / 1000);
        }
        
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        
        const filter = this.context.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2000 + Math.random() * 1000;
        filter.Q.value = 5;
        
        const gain = this.context.createGain();
        gain.gain.value = 0.15;
        
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        source.start(0);
    }
    
    playScreech() {
        if (!this.enabled) return;
        
        const oscillator = this.context.createOscillator();
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(800, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.context.currentTime + 0.5);
        
        const gain = this.context.createGain();
        gain.gain.setValueAtTime(0.2, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);
        
        oscillator.connect(gain);
        gain.connect(this.masterGain);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.5);
    }
    
    playJumpScare() {
        if (!this.enabled) return;
        
        // Loud sudden sound
        const oscillator = this.context.createOscillator();
        oscillator.type = 'sawtooth';
        oscillator.frequency.value = 100;
        
        const gain = this.context.createGain();
        gain.gain.setValueAtTime(0.4, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);
        
        oscillator.connect(gain);
        gain.connect(this.masterGain);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.3);
        
        // Add screech
        setTimeout(() => this.playScreech(), 100);
    }
    
    setVolume(volume) {
        this.volume = Utils.clamp(volume, 0, 1);
        if (this.masterGain) {
            this.masterGain.gain.value = this.volume;
        }
    }
    
    pause() {
        if (this.context) {
            this.context.suspend();
        }
    }
    
    resume() {
        if (this.context) {
            this.context.resume();
        }
    }
}

// Create global audio manager
const audioManager = new AudioManager();
window.audioManager = audioManager;