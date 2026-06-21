<script lang="ts">
    import { addFood } from '$lib/services/database';
    import { appState } from '$lib/stores/appState.svelte';
    import { goto } from '$app/navigation';
    import type { Food } from '$lib/types';

    let editData = $state<Partial<Food>>({
        category: '',
        brand: '',
        name: '',
        note: '',
        calPer100: null,
        protPer100: null,
        calPerUnit: null,
        protPerUnit: null,
        unitWeight: null
    });

    async function save() {
        if (!editData.category) {
            alert("Category is required.");
            return;
        }
        if (!editData.name) {
            alert("Official Name is required.");
            return;
        }
        if (!appState.currentHouseholdId) return;

        try {
            const newFood = await addFood(appState.currentHouseholdId, editData as any);
            appState.db = [...appState.db, newFood];
            goto('/database');
        } catch (e: any) {
            alert(e.message);
        }
    }

    function cancel() {
        goto('/database');
    }
</script>

<div class="p-4 max-w-md mx-auto pb-24">
    <h2 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400 mb-6 text-center">New Food</h2>

    <div class="bg-surface p-6 rounded-2xl border border-border shadow-xl space-y-4">
        <select bind:value={editData.category} class="w-full bg-base text-content px-3 py-3 rounded-xl border border-border focus:outline-none focus:border-primary-500 font-bold">
            <option value="" disabled selected>Select Category</option>
            <option value="Meals">Meals</option>
            <option value="Veggies & Fruit">Veggies & Fruit</option>
            <option value="Carbs">Carbs</option>
            <option value="Bread">Bread</option>
            <option value="Meat & Fish">Meat & Fish</option>
            <option value="Dairy">Dairy</option>
            <option value="Ingredients">Ingredients</option>
            <option value="Spreads">Spreads</option>
            <option value="Sauces">Sauces</option>
            <option value="Snacks">Snacks</option>
            <option value="Baking">Baking</option>
            <option value="Drinks">Drinks</option>

            <option value="Mci">Mci</option>
        </select>
        
        <div class="flex gap-2">
            <div class="relative w-1/3">
                <input type="text" bind:value={editData.brand} autocomplete="off" class="peer w-full bg-base text-content px-3 pt-6 pb-2 rounded-xl border border-border focus:outline-none focus:border-primary-500 placeholder-transparent" placeholder="Brand">
                <label class="absolute left-3 top-2 text-[10px] text-primary-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary-400 pointer-events-none font-bold">Brand</label>
            </div>
            <div class="relative w-2/3">
                <!-- svelte-ignore a11y_autofocus -->
                <input autofocus type="text" bind:value={editData.name} class="peer w-full bg-base text-content px-3 pt-6 pb-2 rounded-xl border border-border focus:outline-none focus:border-primary-500 placeholder-transparent" placeholder="Official Name">
                <label class="absolute left-3 top-2 text-[10px] text-primary-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary-400 pointer-events-none font-bold">Official Name</label>
            </div>
        </div>
        
        <div class="relative w-full">
            <input type="text" bind:value={editData.note} class="peer w-full bg-base text-primary-400 px-3 pt-6 pb-2 rounded-xl border border-border focus:outline-none focus:border-primary-500 placeholder-transparent" placeholder="Note (optional)">
            <label class="absolute left-3 top-2 text-[10px] text-primary-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary-400 pointer-events-none font-bold">Note (optional)</label>
        </div>
        
        <div class="flex gap-2">
            <div class="relative w-1/2">
                <input type="number" bind:value={editData.calPer100} inputmode="decimal" class="peer w-full bg-base text-content px-3 pt-6 pb-2 rounded-xl border border-border focus:outline-none focus:border-primary-500 placeholder-transparent" placeholder="Kcal/100g">
                <label class="absolute left-3 top-2 text-[10px] text-primary-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary-400 pointer-events-none font-bold">Kcal/100g</label>
            </div>
            <div class="relative w-1/2">
                <input type="number" bind:value={editData.protPer100} inputmode="decimal" class="peer w-full bg-base text-content px-3 pt-6 pb-2 rounded-xl border border-border focus:outline-none focus:border-secondary-500 placeholder-transparent" placeholder="Prot/100g">
                <label class="absolute left-3 top-2 text-[10px] text-secondary-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-secondary-400 pointer-events-none font-bold">Prot/100g</label>
            </div>
        </div>
        
        <div class="flex gap-2">
            <div class="relative w-1/3">
                <input type="number" bind:value={editData.calPerUnit} inputmode="decimal" class="peer w-full bg-base text-content px-3 pt-6 pb-2 rounded-xl border border-border focus:outline-none focus:border-primary-500 placeholder-transparent" placeholder="Kcal/unit">
                <label class="absolute left-3 top-2 text-[10px] text-primary-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary-400 pointer-events-none font-bold">Kcal/unit</label>
            </div>
            <div class="relative w-1/3">
                <input type="number" bind:value={editData.protPerUnit} inputmode="decimal" class="peer w-full bg-base text-content px-3 pt-6 pb-2 rounded-xl border border-border focus:outline-none focus:border-secondary-500 placeholder-transparent" placeholder="Prot/unit">
                <label class="absolute left-3 top-2 text-[10px] text-secondary-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-secondary-400 pointer-events-none font-bold">Prot/unit</label>
            </div>
            <div class="relative w-1/3">
                <input type="number" bind:value={editData.unitWeight} inputmode="decimal" class="peer w-full bg-base text-content px-3 pt-6 pb-2 rounded-xl border border-border focus:outline-none focus:border-primary-500 placeholder-transparent" placeholder="Weight (g)">
                <label class="absolute left-3 top-2 text-[10px] text-primary-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary-400 pointer-events-none font-bold">Weight (g)</label>
            </div>
        </div>
        
        <div class="flex gap-3 pt-4">
            <button onclick={cancel} class="flex-1 bg-surface-elevated py-3 rounded-xl font-bold hover:bg-surface transition text-content">Cancel</button>
            <button onclick={save} class="flex-1 bg-primary-600 py-3 rounded-xl font-bold hover:bg-primary-500 transition text-primary-content">Create Food</button>
        </div>
    </div>
</div>
