// Die Saar-Legende - Inventory System

class InventoryManager {
    constructor() {
        this.items = [];
        this.maxItems = 16;
        this.documents = [];
    }
    
    addItem(item) {
        if (this.items.length >= this.maxItems) {
            Utils.warn('Inventory full!');
            return false;
        }
        
        this.items.push(item);
        Utils.log('Item added:', item.name);
        
        // If it's a document, add to story
        if (item.type === 'document') {
            this.documents.push(item);
            if (window.storyManager) {
                storyManager.onDocumentCollected(item.id);
            }
        }
        
        return true;
    }
    
    removeItem(itemId) {
        const index = this.items.findIndex(item => item.id === itemId);
        if (index !== -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }
    
    hasItem(itemId) {
        return this.items.some(item => item.id === itemId);
    }
    
    getItem(itemId) {
        return this.items.find(item => item.id === itemId);
    }
    
    useItem(itemId) {
        const item = this.getItem(itemId);
        if (!item) return false;
        
        if (item.consumable) {
            this.removeItem(itemId);
        }
        
        return true;
    }
    
    getDocumentCount() {
        return this.documents.length;
    }
    
    getAllDocuments() {
        return this.documents;
    }
}

// Create global inventory manager
const inventory = new InventoryManager();
window.inventory = inventory;