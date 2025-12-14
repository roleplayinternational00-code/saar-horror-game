// Die Saar-Legende - UI Manager

class UIManager {
    constructor() {
        this.elements = {
            // Menus
            mainMenu: document.getElementById('mainMenu'),
            settingsMenu: document.getElementById('settingsMenu'),
            controlsMenu: document.getElementById('controlsMenu'),
            creditsMenu: document.getElementById('creditsMenu'),
            pauseMenu: document.getElementById('pauseMenu'),
            loadingScreen: document.getElementById('loadingScreen'),
            gameContainer: document.getElementById('gameContainer'),
            
            // HUD
            sanityFill: document.getElementById('sanityFill'),
            staminaBar: document.getElementById('staminaBar'),
            staminaFill: document.getElementById('staminaFill'),
            batteryPercent: document.getElementById('batteryPercent'),
            interactionPrompt: document.getElementById('interactionPrompt'),
            objectiveText: document.getElementById('objectiveText'),
            
            // Overlays
            inventoryScreen: document.getElementById('inventoryScreen'),
            inventoryGrid: document.getElementById('inventoryGrid'),
            documentReader: document.getElementById('documentReader'),
            documentTitle: document.getElementById('documentTitle'),
            documentText: document.getElementById('documentText'),
            
            // Loading
            loadingProgress: document.getElementById('loadingProgress'),
            loadingTip: document.getElementById('loadingTip')
        };
        
        this.isInventoryOpen = false;
        this.isDocumentOpen = false;
        this.isPaused = false;
        
        this.bindEvents();
    }
    
    bindEvents() {
        // Main Menu
        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.startNewGame();
        });
        
        document.getElementById('loadGameBtn').addEventListener('click', () => {
            this.loadGame();
        });
        
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettings();
        });
        
        document.getElementById('controlsBtn').addEventListener('click', () => {
            this.showControls();
        });
        
        document.getElementById('creditsBtn').addEventListener('click', () => {
            this.showCredits();
        });
        
        // Back buttons
        document.getElementById('backFromSettings').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        document.getElementById('backFromControls').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        document.getElementById('backFromCredits').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        // Settings
        document.getElementById('audioVolume').addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            document.getElementById('volumeValue').textContent = e.target.value + '%';
            if (window.audioManager) {
                audioManager.setVolume(volume);
            }
        });
        
        document.getElementById('graphicsQuality').addEventListener('change', (e) => {
            if (window.game) {
                game.setGraphicsQuality(e.target.value);
            }
        });
        
        // Pause Menu
        document.getElementById('resumeBtn').addEventListener('click', () => {
            this.resumeGame();
        });
        
        document.getElementById('saveGameBtn').addEventListener('click', () => {
            this.saveGame();
        });
        
        document.getElementById('pauseSettingsBtn').addEventListener('click', () => {
            this.showSettings();
        });
        
        document.getElementById('quitBtn').addEventListener('click', () => {
            this.quitToMenu();
        });
        
        // Document Reader
        document.getElementById('closeDocument').addEventListener('click', () => {
            this.closeDocument();
        });
        
        // Check for saved game
        this.checkSavedGame();
    }
    
    checkSavedGame() {
        const savedGame = localStorage.getItem('saarLegendSave');
        if (savedGame) {
            document.getElementById('loadGameBtn').disabled = false;
        }
    }
    
    showMainMenu() {
        this.hideAll();
        this.elements.mainMenu.classList.remove('hidden');
    }
    
    showSettings() {
        this.hideAll();
        this.elements.settingsMenu.classList.remove('hidden');
    }
    
    showControls() {
        this.hideAll();
        this.elements.controlsMenu.classList.remove('hidden');
    }
    
    showCredits() {
        this.hideAll();
        this.elements.creditsMenu.classList.remove('hidden');
    }
    
    showLoading() {
        this.hideAll();
        this.elements.loadingScreen.classList.remove('hidden');
        this.updateLoadingProgress(0);
    }
    
    updateLoadingProgress(percent) {
        this.elements.loadingProgress.style.width = percent + '%';
    }
    
    showGame() {
        this.hideAll();
        this.elements.gameContainer.classList.remove('hidden');
    }
    
    hideAll() {
        Object.values(this.elements).forEach(el => {
            if (el && el.classList) {
                el.classList.add('hidden');
            }
        });
    }
    
    startNewGame() {
        this.showLoading();
        
        // Loading tips
        const tips = [
            'Tipp: Schalte deine Taschenlampe aus, wenn du dich versteckst...',
            'Tipp: Batterien sind selten. Nutze sie weise.',
            'Tipp: Wenn dein Verstand sinkt, wirst du Dinge sehen...',
            'Tipp: Die Entität wird vom Licht angezogen.',
            'Tipp: Rennen macht Geräusche. Sei vorsichtig.'
        ];
        
        this.elements.loadingTip.textContent = Utils.randomChoice(tips);
        
        // Simulate loading
        let progress = 0;
        const loadInterval = setInterval(() => {
            progress += 10;
            this.updateLoadingProgress(progress);
            
            if (progress >= 100) {
                clearInterval(loadInterval);
                setTimeout(() => {
                    this.showGame();
                    if (window.game) {
                        game.start();
                    }
                }, 500);
            }
        }, 100);
    }
    
    loadGame() {
        const savedData = localStorage.getItem('saarLegendSave');
        if (savedData) {
            this.showLoading();
            setTimeout(() => {
                this.showGame();
                if (window.game) {
                    game.loadSave(JSON.parse(savedData));
                }
            }, 1000);
        }
    }
    
    saveGame() {
        if (window.game) {
            const saveData = game.getSaveData();
            localStorage.setItem('saarLegendSave', JSON.stringify(saveData));
            alert('Spiel gespeichert!');
        }
    }
    
    pauseGame() {
        this.isPaused = true;
        this.elements.pauseMenu.classList.remove('hidden');
        if (window.audioManager) {
            audioManager.pause();
        }
    }
    
    resumeGame() {
        this.isPaused = false;
        this.elements.pauseMenu.classList.add('hidden');
        if (window.audioManager) {
            audioManager.resume();
        }
    }
    
    quitToMenu() {
        if (confirm('Möchtest du zum Hauptmenü zurückkehren? (Nicht gespeicherter Fortschritt geht verloren)')) {
            this.showMainMenu();
            if (window.game) {
                game.reset();
            }
        }
    }
    
    // HUD Updates
    updateSanity(percent) {
        this.elements.sanityFill.style.width = percent + '%';
        
        // Add visual effects at low sanity
        if (percent < 30) {
            document.body.classList.add('low-sanity');
        } else {
            document.body.classList.remove('low-sanity');
        }
    }
    
    updateStamina(percent) {
        this.elements.staminaFill.style.width = percent + '%';
        
        // Show stamina bar only when running
        if (percent < 100) {
            this.elements.staminaBar.classList.remove('hidden');
        } else {
            setTimeout(() => {
                this.elements.staminaBar.classList.add('hidden');
            }, 1000);
        }
    }
    
    updateBattery(percent) {
        this.elements.batteryPercent.textContent = Math.floor(percent) + '%';
        
        // Change color based on battery level
        if (percent < 20) {
            this.elements.batteryPercent.style.color = '#ff0000';
        } else if (percent < 50) {
            this.elements.batteryPercent.style.color = '#ffaa00';
        } else {
            this.elements.batteryPercent.style.color = '#fff';
        }
    }
    
    showInteractionPrompt(text) {
        this.elements.interactionPrompt.innerHTML = text || 'Drücke <span class="key">E</span> zum Interagieren';
        this.elements.interactionPrompt.classList.remove('hidden');
    }
    
    hideInteractionPrompt() {
        this.elements.interactionPrompt.classList.add('hidden');
    }
    
    updateObjective(text) {
        this.elements.objectiveText.textContent = text;
    }
    
    // Inventory
    toggleInventory() {
        this.isInventoryOpen = !this.isInventoryOpen;
        
        if (this.isInventoryOpen) {
            this.elements.inventoryScreen.classList.remove('hidden');
            this.updateInventoryDisplay();
        } else {
            this.elements.inventoryScreen.classList.add('hidden');
        }
    }
    
    updateInventoryDisplay() {
        if (!window.inventory) return;
        
        this.elements.inventoryGrid.innerHTML = '';
        
        inventory.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item';
            itemDiv.innerHTML = `
                <div class="inventory-item-icon">${item.icon}</div>
                <div class="inventory-item-name">${item.name}</div>
            `;
            
            itemDiv.addEventListener('click', () => {
                if (item.type === 'document') {
                    this.showDocument(item);
                }
            });
            
            this.elements.inventoryGrid.appendChild(itemDiv);
        });
    }
    
    // Document Reader
    showDocument(document) {
        this.elements.documentTitle.textContent = document.title;
        this.elements.documentText.textContent = document.text;
        this.elements.documentReader.classList.remove('hidden');
        this.isDocumentOpen = true;
    }
    
    closeDocument() {
        this.elements.documentReader.classList.add('hidden');
        this.isDocumentOpen = false;
    }
}

// Create global UI manager
const uiManager = new UIManager();
window.uiManager = uiManager;