import { auth, db } from './firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    type User
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, onSnapshot } from 'firebase/firestore';
import type { UserProfile } from '../types';

export function listenToAuth(callback: (user: User | null, profile: UserProfile | null) => void) {
    let profileUnsub: (() => void) | null = null;
    
    const authUnsub = onAuthStateChanged(auth, (user) => {
        if (profileUnsub) {
            profileUnsub();
            profileUnsub = null;
        }
        
        if (!user) {
            callback(null, null);
            return;
        }
        
        try {
            const profileRef = doc(db, 'profiles', user.uid);
            profileUnsub = onSnapshot(profileRef, (profileSnap) => {
                if (profileSnap.exists()) {
                    callback(user, profileSnap.data() as UserProfile);
                } else {
                    callback(user, null);
                }
            });
        } catch (e) {
            console.error("Error fetching profile", e);
            callback(user, null);
        }
    });
    
    return () => {
        authUnsub();
        if (profileUnsub) profileUnsub();
    };
}

export async function initializeUserProfile(user: User, displayName: string) {
    // Generate a new Household ID via Firebase doc generator
    const newHouseholdId = doc(collection(db, 'households')).id;
    const householdRef = doc(db, 'households', newHouseholdId);
    await setDoc(householdRef, { id: newHouseholdId });
    
    // Create User Profile
    const profileRef = doc(db, 'profiles', user.uid);
    const newProfile: UserProfile = {
        id: user.uid,
        email: user.email || '',
        display_name: displayName,
        household_id: newHouseholdId,
        theme: 'dark',
        primary_accent: 'mint',
        secondary_accent: 'pink'
    };
    
    await setDoc(profileRef, newProfile);
}

export async function signUp(email: string, password: string, displayName: string) {
    // 1. Create Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // 2. Initialize Profile and Household
    await initializeUserProfile(user, displayName);
    return user;
}

export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    const profileRef = doc(db, 'profiles', user.uid);
    const profileSnap = await getDoc(profileRef);
    
    if (!profileSnap.exists()) {
        await initializeUserProfile(user, user.displayName || 'Google User');
    }
    
    return user;
}

export async function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
}

export async function logOut() {
    return signOut(auth);
}

export async function joinHousehold(userId: string, newHouseholdId: string) {
    const profileRef = doc(db, 'profiles', userId);
    await updateDoc(profileRef, {
        household_id: newHouseholdId
    });
}

export async function updateProfileTheme(userId: string, updates: Partial<UserProfile>) {
    const profileRef = doc(db, 'profiles', userId);
    await updateDoc(profileRef, updates);
}
