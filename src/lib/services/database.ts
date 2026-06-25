import { db } from './firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import type { Food, FoodFirestoreDoc } from '../types';

export async function fetchFoods(householdId: string): Promise<Food[]> {
    const foodsRef = collection(db, 'foods');
    const q = query(foodsRef, where('household_id', '==', householdId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(docSnap => {
        const data = docSnap.data() as FoodFirestoreDoc;
        return {
            id: docSnap.id,
            created_at: data.created_at ? new Date(data.created_at).getTime() : Date.now(),
            category: data.category || '',
            brand: data.brand || '',
            name: data.name || '',
            note: data.note || '',
            calPer100: data.cal_100 ?? null,
            protPer100: data.prot_100 ?? null,
            calPerUnit: data.cal_unit ?? null,
            protPerUnit: data.prot_unit ?? null,
            unitWeight: data.weight_unit ?? null
        };
    });
}

export async function addFood(householdId: string, food: Omit<Food, 'id' | 'created_at'>): Promise<Food> {
    const foodsRef = collection(db, 'foods');
    const newDocRef = doc(foodsRef); 
    
    const firestoreData: FoodFirestoreDoc = {
        household_id: householdId,
        category: food.category ?? '',
        brand: food.brand ?? '',
        name: food.name ?? '',
        note: food.note ?? '',
        cal_100: food.calPer100 ?? null,
        prot_100: food.protPer100 ?? null,
        cal_unit: food.calPerUnit ?? null,
        prot_unit: food.protPerUnit ?? null,
        weight_unit: food.unitWeight ?? null,
        created_at: new Date().toISOString()
    };
    
    await setDoc(newDocRef, firestoreData);
    
    return {
        ...food,
        id: newDocRef.id,
        created_at: Date.now()
    };
}

export async function updateFood(foodId: string, updates: Partial<FoodFirestoreDoc>) {
    const foodRef = doc(db, 'foods', foodId);
    await setDoc(foodRef, updates, { merge: true });
}

export async function deleteFood(foodId: string) {
    const foodRef = doc(db, 'foods', foodId);
    await deleteDoc(foodRef);
}
