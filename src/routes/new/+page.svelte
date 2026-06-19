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
    <h2 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--color-primary-400))] to-[rgb(var(--color-secondary-400))] mb-6 text-center">New Food</h2>

    <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl space-y-4">
        <select bind:value={editData.category} class="w-full bg-gray-900 text-white px-3 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-emerald-500 font-bold">
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
            <option value="Supplements">Supplements</option>
            <option value="Mci">Mci</option>
        </select>
        
        <div class="flex gap-2">
            <div class="relative w-1/3">
                <input type="text" bind:value={editData.brand} autocomplete="off" class="peer w-full bg-gray-900 text-white px-3 pt-6 pb-2 rounded-xl border border-gray-700 focus:outline-none focus:border-emerald-500 placeholder-transparent" placeholder="Brand">
                <label class="absolute left-3 top-2 text-[10px] text-emerald-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-emerald-400 pointer-events-none font-bold">Brand</label>
            </div>
            <div class="relative w-2/3">
                <!-- svelte-ignore a11y_autofocus -->
                <input autofocus type="text" bind:value={editData.name} class="peer w-full bg-gray-900 text-white px-3 pt-6 pb-2 rounded-xl border border-gray-700 focus:outline-none focus:border-emerald-500 placeholder-transparent" placeholder="Official Name">
                <label class="absolute left-3 top-2 text-[10px] text-emerald-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-emerald-400 pointer-events-none font-bold">Official Name</label>
            </div>
        </div>
        
        <div class="relative w-full">
            <input type="text" bind:value={editData.note} class="peer w-full bg-gray-900 text-emerald-400 px-3 pt-6 pb-2 rounded-xl border border-gray-700 focus:outline-none focus:border-emerald-500 placeholder-transparent" placeholder="Note (optional)">
            <label class="absolute left-3 top-2 text-[10px] text-emerald-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-emerald-400 pointer-events-none font-bold">Note (optional)</label>
        </div>
        
        <div class="flex gap-2">
            <div class="relative w-1/2">
                <input type="number" bind:value={editData.calPer100} inputmode="decimal" class="peer w-full bg-gray-900 text-white px-3 pt-6 pb-2 rounded-xl border border-gray-700 focus:outline-none focus:border-emerald-500 placeholder-transparent" placeholder="Kcal/100g">
                <label class="absolute left-3 top-2 text-[10px] text-emerald-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-emerald-400 pointer-events-none font-bold">Kcal/100g</label>
            </div>
            <div class="relative w-1/2">
                <input type="number" bind:value={editData.protPer100} inputmode="decimal" class="peer w-full bg-gray-900 text-white px-3 pt-6 pb-2 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 placeholder-transparent" placeholder="Prot/100g">
                <label class="absolute left-3 top-2 text-[10px] text-blue-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-blue-400 pointer-events-none font-bold">Prot/100g</label>
            </div>
        </div>
        
        <div class="flex gap-2">
            <div class="relative w-1/3">
                <input type="number" bind:value={editData.calPerUnit} inputmode="decimal" class="peer w-full bg-gray-900 text-white px-3 pt-6 pb-2 rounded-xl border border-gray-700 focus:outline-none focus:border-emerald-500 placeholder-transparent" placeholder="Kcal/unit">
                <label class="absolute left-3 top-2 text-[10px] text-emerald-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-emerald-400 pointer-events-none font-bold">Kcal/unit</label>
            </div>
            <div class="relative w-1/3">
                <input type="number" bind:value={editData.protPerUnit} inputmode="decimal" class="peer w-full bg-gray-900 text-white px-3 pt-6 pb-2 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 placeholder-transparent" placeholder="Prot/unit">
                <label class="absolute left-3 top-2 text-[10px] text-blue-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-blue-400 pointer-events-none font-bold">Prot/unit</label>
            </div>
            <div class="relative w-1/3">
                <input type="number" bind:value={editData.unitWeight} inputmode="decimal" class="peer w-full bg-gray-900 text-white px-3 pt-6 pb-2 rounded-xl border border-purple-900 focus:outline-none focus:border-purple-500 placeholder-transparent" placeholder="Weight (g)">
                <label class="absolute left-3 top-2 text-[10px] text-purple-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-purple-400 pointer-events-none font-bold">Weight (g)</label>
            </div>
        </div>
        
        <div class="flex gap-3 pt-4">
            <button onclick={cancel} class="flex-1 bg-gray-700 py-3 rounded-xl font-bold hover:bg-gray-600 transition text-gray-300">Cancel</button>
            <button onclick={save} class="flex-1 bg-emerald-600 py-3 rounded-xl font-bold hover:bg-emerald-500 transition text-white">Create Food</button>
        </div>
    </div>
</div>
