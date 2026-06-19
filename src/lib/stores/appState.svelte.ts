import type { User } from 'firebase/auth';
import type { DailyLog, Food, UserProfile, PlateItem, Meal, AppTheme, AccentColor } from '../types';

// In Svelte 5, we can use runes inside a class to create a reactive state singleton
class AppState {
    // Auth & Profile State
    currentUser = $state<User | null>(null);
    currentProfile = $state<UserProfile | null>(null);
    
    // DB State
    db = $state<Food[]>([]);
    
    // Plate / Daily Log State
    dailyLog = $state<DailyLog>({});
    activeCategory = $state<string>('');
    activeMealId = $state<string>('');

    // UI State
    activeTab = $state<'home' | 'db' | 'custom' | 'new' | 'settings'>('home');
    theme = $state<AppTheme>('dark');
    primaryAccent = $state<AccentColor>('mint');
    secondaryAccent = $state<AccentColor>('pink');
    
    // Computed Properties
    isAuth = $derived(this.currentUser !== null);
    currentHouseholdId = $derived(this.currentProfile?.household_id || null);

    // Default categories mimicking original logic
    readonly defaultCategories = ["Lunch", "Dinner", "Snacks"];

    constructor() {
        this.loadLocalState();
    }

    // --- State Persistence ---
    saveLocalState() {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('dailyLog', JSON.stringify(this.dailyLog));
            localStorage.setItem('activeCategory', this.activeCategory);
            localStorage.setItem('activeMealId', this.activeMealId);
            localStorage.setItem('theme', this.theme);
            localStorage.setItem('primaryAccent', this.primaryAccent);
            localStorage.setItem('secondaryAccent', this.secondaryAccent);
        }
    }

    loadLocalState() {
        if (typeof localStorage === 'undefined') return;

        this.theme = (localStorage.getItem('theme') as AppTheme) || 'dark';
        this.primaryAccent = (localStorage.getItem('primaryAccent') as AccentColor) || 'mint';
        this.secondaryAccent = (localStorage.getItem('secondaryAccent') as AccentColor) || 'pink';

        const savedLog = localStorage.getItem('dailyLog');
        if (savedLog) {
            this.dailyLog = JSON.parse(savedLog);
        } else {
            this.resetDailyLog();
        }

        const savedCat = localStorage.getItem('activeCategory');
        const savedMeal = localStorage.getItem('activeMealId');

        if (savedCat && this.dailyLog[savedCat]) {
            this.activeCategory = savedCat;
        } else {
            this.activeCategory = Object.keys(this.dailyLog)[0] || '';
        }

        if (savedMeal && this.dailyLog[this.activeCategory]?.[savedMeal]) {
            this.activeMealId = savedMeal;
        } else {
            const meals = Object.keys(this.dailyLog[this.activeCategory] || {});
            this.activeMealId = meals[0] || '';
        }
    }

    // --- Daily Log Mutations ---
    resetDailyLog() {
        const newLog: DailyLog = {};
        this.defaultCategories.forEach(cat => {
            newLog[cat] = {};
            const mealId = 'meal_' + Date.now() + Math.random();
            newLog[cat][mealId] = { title: `My ${cat}`, items: [] };
        });
        this.dailyLog = newLog;
        this.activeCategory = this.defaultCategories[0];
        this.activeMealId = Object.keys(newLog[this.activeCategory])[0];
        this.saveLocalState();
    }

    addMeal(category: string) {
        if (!this.dailyLog[category]) this.dailyLog[category] = {};
        const mealCount = Object.keys(this.dailyLog[category]).length + 1;
        const mealId = 'meal_' + Date.now() + Math.random();
        
        // Use Svelte 5 reactivity (assignment or proxy mutation)
        this.dailyLog[category][mealId] = { 
            title: `My ${category} (${mealCount})`, 
            items: [] 
        };
        
        this.activeCategory = category;
        this.activeMealId = mealId;
        this.saveLocalState();
    }

    clearCategory(category: string) {
        if (!this.dailyLog[category]) return;
        this.dailyLog[category] = {};
        const mealId = 'meal_' + Date.now() + Math.random();
        this.dailyLog[category][mealId] = { title: `My ${category}`, items: [] };
        
        if (this.activeCategory === category) {
            this.activeMealId = mealId;
        }
        this.saveLocalState();
    }

    clearMeal(category: string, mealId: string) {
        if (!this.dailyLog[category]?.[mealId]) return;
        this.dailyLog[category][mealId].items = [];
        this.saveLocalState();
    }

    addPlateItem(item: PlateItem) {
        if (!this.activeCategory || !this.activeMealId) return;
        if (!this.dailyLog[this.activeCategory]) this.dailyLog[this.activeCategory] = {};
        if (!this.dailyLog[this.activeCategory][this.activeMealId]) return;

        this.dailyLog[this.activeCategory][this.activeMealId].items.push(item);
        this.saveLocalState();
    }

    removePlateItem(category: string, mealId: string, itemId: number) {
        if (!this.dailyLog[category]?.[mealId]) return;
        this.dailyLog[category][mealId].items = this.dailyLog[category][mealId].items.filter(i => i.id !== itemId);
        this.saveLocalState();
    }

    updatePlateItemAmount(category: string, mealId: string, itemId: number, newAmount: number) {
        if (!this.dailyLog[category]?.[mealId]) return;
        const item = this.dailyLog[category][mealId].items.find(i => i.id === itemId);
        if (item) {
            item.amount = newAmount;
            item.totalCal = parseFloat((newAmount * item.calMultiplier).toFixed(1));
            item.totalProt = parseFloat((newAmount * item.protMultiplier).toFixed(1));
            this.saveLocalState();
        }
    }
}

// Export a singleton instance
export const appState = new AppState();
