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
    dbCategoryFilter = $state<string>('All');

    // UI State
    activeTab = $state<'home' | 'db' | 'custom' | 'new' | 'settings'>('home');
    theme = $state<AppTheme>('dark');
    primaryAccent = $state<AccentColor>('mint');
    secondaryAccent = $state<AccentColor>('pink');
    
    // Computed Properties
    cachedAuth = $state(false);
    isAuth = $derived(this.currentUser !== null || this.cachedAuth);
    currentHouseholdId = $derived(this.currentProfile?.household_id || null);

    // Default categories mimicking original logic
    readonly defaultCategories = ["Lunch", "Dinner", "Snacks", "Breakfast"];

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
            localStorage.setItem('dbCategoryFilter', this.dbCategoryFilter);

            if (this.currentProfile) {
                localStorage.setItem('cachedProfile', JSON.stringify(this.currentProfile));
            } else {
                localStorage.removeItem('cachedProfile');
            }
            if (this.db && this.db.length > 0) {
                localStorage.setItem('cachedDb', JSON.stringify(this.db));
            } else if (!this.currentProfile) {
                localStorage.removeItem('cachedDb');
            }
        }
    }

    loadLocalState() {
        if (typeof localStorage === 'undefined') return;

        this.theme = (localStorage.getItem('theme') as AppTheme) || 'dark';
        this.primaryAccent = (localStorage.getItem('primaryAccent') as AccentColor) || 'mint';
        this.secondaryAccent = (localStorage.getItem('secondaryAccent') as AccentColor) || 'pink';
        this.dbCategoryFilter = localStorage.getItem('dbCategoryFilter') || 'All';

        const savedProfile = localStorage.getItem('cachedProfile');
        if (savedProfile) {
            try {
                this.currentProfile = JSON.parse(savedProfile);
                this.cachedAuth = true;
            } catch (e) {}
        }

        const savedDb = localStorage.getItem('cachedDb');
        if (savedDb) {
            try {
                this.db = JSON.parse(savedDb);
            } catch (e) {}
        }

        const savedLog = localStorage.getItem('dailyLog');
        if (savedLog) {
            this.dailyLog = JSON.parse(savedLog);
            // Ensure all default categories exist in loaded state
            let updated = false;
            this.defaultCategories.forEach(cat => {
                if (!this.dailyLog[cat]) {
                    this.dailyLog[cat] = {};
                    const mealId = 'meal_' + Date.now() + Math.random();
                    this.dailyLog[cat][mealId] = { title: `My ${cat}`, items: [] };
                    updated = true;
                }
            });
            if (updated) this.saveLocalState();
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

    deleteMeal(category: string, mealId: string) {
        if (!this.dailyLog[category]?.[mealId]) return;
        
        const mealsInCategory = Object.keys(this.dailyLog[category]);
        if (mealsInCategory.length === 1) {
            // Only 1 meal left, just clear its items
            this.dailyLog[category][mealId].items = [];
            this.dailyLog[category][mealId].title = `My ${category}`;
        } else {
            // More than 1 meal, delete it completely
            delete this.dailyLog[category][mealId];
            
            // If only 1 meal is left after deletion, rename it to remove numbers
            const remainingMeals = Object.keys(this.dailyLog[category]);
            if (remainingMeals.length === 1) {
                const lastMealId = remainingMeals[0];
                this.dailyLog[category][lastMealId].title = `My ${category}`;
            }
            
            if (this.activeMealId === mealId) {
                this.activeMealId = remainingMeals[0];
            }
        }
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
