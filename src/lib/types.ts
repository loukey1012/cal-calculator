// ==========================================
// User & Household Types
// ==========================================

export type AppTheme = 'dark' | 'light' | 'pink' | 'red';
export type AccentColor = 'mint' | 'green' | 'sky' | 'indigo' | 'purple' | 'pink' | 'amber';

export interface UserProfile {
    id: string;
    email: string;
    display_name: string;
    household_id: string;
    theme?: AppTheme;
    primary_accent?: AccentColor;
    secondary_accent?: AccentColor;
}

export interface Household {
    id: string;
}

// ==========================================
// Food Database Types
// ==========================================

export interface Food {
    id: string; // Stored as a UUID in Firestore
    created_at: number;
    category: string;
    brand: string;
    name: string;
    note: string;
    calPer100: number | null;
    protPer100: number | null;
    calPerUnit: number | null;
    protPerUnit: number | null;
    unitWeight: number | null;
}

export interface FoodFirestoreDoc {
    household_id: string;
    category: string;
    brand: string;
    name: string;
    note: string;
    cal_100: number | null;
    prot_100: number | null;
    cal_unit: number | null;
    prot_unit: number | null;
    weight_unit: number | null;
    created_at?: string; 
}

// ==========================================
// Daily Log (Plate) Types
// ==========================================

export type EntryMode = 'grams' | 'units';

export interface PlateItem {
    id: number; // usually Date.now() timestamp locally
    baseName: string;
    mode: EntryMode;
    amount: number;
    calMultiplier: number;
    protMultiplier: number;
    name?: string; // made optional as baseName is used
    totalCal: number;
    totalProt: number;
    foodId: string | null;
}

export interface Meal {
    title: string;
    items: PlateItem[];
}

// dailyLog structure maps Category -> Meal ID -> Meal
export type DailyLog = Record<string, Record<string, Meal>>;
