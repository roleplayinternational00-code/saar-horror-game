// Die Saar-Legende - Player Controller (First Person)

class Player {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        
        // Player properties
        this.position = new THREE.Vector3(0, 1.7, 0); // Eye height
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        
        // Movement settings
        this.speed = 5.0;
        this.sprintSpeed = 8.0;
        this.currentSpeed = this.speed;
        
        // Stamina system
        this.stamina = 100;
        this.maxStamina = 100;
        this.staminaDrainRate = 15; // per second when sprinting
        this.staminaRegenRate = 10; // per second when not sprinting
        
        // Flashlight
        this.hasFlashlight = true;
        this.flashlightOn = false;
        this.battery = 100;
        this.batteryDrainRate = 3.33; // 5 minutes = 300 seconds at 100%
        this.flashlight = null;
        
        // Input state
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            sprint: false,
            interact: false
        };
        
        // Mouse look
        this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
        this.sensitivity = 0.002;
        
        // Interaction
        this.interactionRange = 3;
        this.nearbyInteractable = null;
        
        // Pointer lock
        this.isLocked = false;
        
        this.init();
    }
    
    init() {
        // Set initial camera position
        this.camera.position.copy(this.position);
        
        // Create flashlight
        this.createFlashlight();
        
        // Bind controls
        this.bindControls();
    }
    
    createFlashlight() {
        // SpotLight for flashlight
        this.flashlight = new THREE.SpotLight(0xffeeaa, 0, 20, Math.PI / 6, 0.5, 2);
        this.flashlight.position.copy(this.camera.position);
        this.flashlight.target.position.set(
            this.camera.position.x,
            this.camera.position.y,
            this.camera.position.z - 1
        );
        
        this.scene.add(this.flashlight);
        this.scene.add(this.flashlight.target);
        
        this.flashlight.visible = false;
    }
    
    bindControls() {
        // Keyboard events
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        // Mouse events
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Pointer lock
        document.addEventListener('click', () => {
            if (!this.isLocked) {
                document.body.requestPointerLock();
            }
        });
        
        document.addEventListener('pointerlockchange', () => {
            this.isLocked = document.pointerLockElement === document.body;
        });
    }
    
    onKeyDown(event) {
        switch(event.code) {
            case 'KeyW': this.keys.forward = true; break;
            case 'KeyS': this.keys.backward = true; break;
            case 'KeyA': this.keys.left = true; break;
            case 'KeyD': this.keys.right = true; break;
            case 'ShiftLeft': this.keys.sprint = true; break;
            case 'KeyE': this.onInteract(); break;
            case 'KeyF': this.toggleFlashlight(); break;
            case 'Tab': 
                event.preventDefault();
                if (window.uiManager) uiManager.toggleInventory();
                break;
            case 'Escape':
                if (window.uiManager && !uiManager.isPaused) {
                    uiManager.pauseGame();
                }
                break;
        }
    }
    
    onKeyUp(event) {
        switch(event.code) {
            case 'KeyW': this.keys.forward = false; break;
            case 'KeyS': this.keys.backward = false; break;
            case 'KeyA': this.keys.left = false; break;
            case 'KeyD': this.keys.right = false; break;
            case 'ShiftLeft': this.keys.sprint = false; break;
        }
    }
    
    onMouseMove(event) {
        if (!this.isLocked) return;
        
        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;
        
        this.euler.setFromQuaternion(this.camera.quaternion);
        this.euler.y -= movementX * this.sensitivity;
        this.euler.x -= movementY * this.sensitivity;
        
        // Clamp vertical rotation
        this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));
        
        this.camera.quaternion.setFromEuler(this.euler);
    }
    
    toggleFlashlight() {
        if (!this.hasFlashlight || this.battery <= 0) return;
        
        this.flashlightOn = !this.flashlightOn;
        this.flashlight.visible = this.flashlightOn;
        
        if (this.flashlightOn && window.sanityManager) {
            // Being in darkness affects sanity
            sanityManager.setInDarkness(false);
        }
        
        Utils.log('Flashlight:', this.flashlightOn ? 'ON' : 'OFF');
    }
    
    onInteract() {
        if (this.nearbyInteractable) {
            this.nearbyInteractable.interact();
            Utils.log('Interacted with:', this.nearbyInteractable.name);
        }
    }
    
    update(delta) {
        if (!this.isLocked) return;
        
        // Update movement
        this.updateMovement(delta);
        
        // Update stamina
        this.updateStamina(delta);
        
        // Update flashlight
        this.updateFlashlight(delta);
        
        // Check for nearby interactables
        this.checkInteractables();
        
        // Update camera position
        this.camera.position.copy(this.position);
        
        // Update flashlight position
        if (this.flashlight) {
            this.flashlight.position.copy(this.camera.position);
            const target = new THREE.Vector3();
            this.camera.getWorldDirection(target);
            this.flashlight.target.position.copy(
                this.camera.position.clone().add(target)
            );
        }
    }
    
    updateMovement(delta) {
        // Determine speed (sprint or walk)
        const isSprinting = this.keys.sprint && this.stamina > 0 && 
                           (this.keys.forward || this.keys.backward || this.keys.left || this.keys.right);
        
        this.currentSpeed = isSprinting ? this.sprintSpeed : this.speed;
        
        // Calculate movement direction
        this.direction.set(0, 0, 0);
        
        const forward = new THREE.Vector3();
        this.camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();
        
        const right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
        
        if (this.keys.forward) this.direction.add(forward);
        if (this.keys.backward) this.direction.sub(forward);
        if (this.keys.right) this.direction.add(right);
        if (this.keys.left) this.direction.sub(right);
        
        this.direction.normalize();
        
        // Apply movement
        this.velocity.copy(this.direction).multiplyScalar(this.currentSpeed * delta);
        this.position.add(this.velocity);
        
        // Play footstep sounds
        if (this.velocity.length() > 0.01 && Math.random() < 0.02) {
            if (window.audioManager) {
                audioManager.playFootstep();
            }
        }
        
        // Sprinting makes noise - alert enemy
        if (isSprinting && window.enemy) {
            enemy.hearNoise(this.position, 15); // Audible from 15 units
        }
    }
    
    updateStamina(delta) {
        const isSprinting = this.keys.sprint && this.stamina > 0 &&
                           (this.keys.forward || this.keys.backward || this.keys.left || this.keys.right);
        
        if (isSprinting) {
            this.stamina -= this.staminaDrainRate * delta;
            this.stamina = Math.max(0, this.stamina);
        } else {
            this.stamina += this.staminaRegenRate * delta;
            this.stamina = Math.min(this.maxStamina, this.stamina);
        }
        
        // Update UI
        if (window.uiManager) {
            uiManager.updateStamina((this.stamina / this.maxStamina) * 100);
        }
    }
    
    updateFlashlight(delta) {
        if (this.flashlightOn && this.battery > 0) {
            this.battery -= this.batteryDrainRate * delta;
            this.battery = Math.max(0, this.battery);
            
            // Flashlight flickers when low
            if (this.battery < 20) {
                if (Math.random() < 0.1) {
                    this.flashlight.intensity = Math.random() * 0.5 + 0.5;
                }
            } else {
                this.flashlight.intensity = 1;
            }
            
            // Turn off when depleted
            if (this.battery <= 0) {
                this.flashlightOn = false;
                this.flashlight.visible = false;
            }
            
            // Light attracts enemy
            if (window.enemy) {
                enemy.seeLight(this.position, 25); // Visible from 25 units
            }
        }
        
        // Update UI
        if (window.uiManager) {
            uiManager.updateBattery(this.battery);
        }
    }
    
    checkInteractables() {
        // This would check for nearby interactable objects in the scene
        // For now, placeholder
        
        if (this.nearbyInteractable) {
            if (window.uiManager) {
                uiManager.showInteractionPrompt();
            }
        } else {
            if (window.uiManager) {
                uiManager.hideInteractionPrompt();
            }
        }
    }
    
    addBattery(amount) {
        this.battery += amount;
        this.battery = Math.min(100, this.battery);
        Utils.log('Battery added. Current:', this.battery);
    }
    
    getPosition() {
        return this.position.clone();
    }
    
    getSaveData() {
        return {
            position: this.position.toArray(),
            stamina: this.stamina,
            battery: this.battery,
            flashlightOn: this.flashlightOn
        };
    }
    
    loadSaveData(data) {
        this.position.fromArray(data.position);
        this.stamina = data.stamina;
        this.battery = data.battery;
        this.flashlightOn = data.flashlightOn;
        this.flashlight.visible = this.flashlightOn;
    }
}

window.Player = Player;
