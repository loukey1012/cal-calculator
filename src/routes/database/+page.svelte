<script lang="ts">
    import { onMount } from 'svelte';
    import { appState } from '$lib/stores/appState.svelte';
    import { fetchFoods, deleteFood } from '$lib/services/database';
    import { goto } from '$app/navigation';
    import FoodItemCard from '$lib/components/FoodItemCard.svelte';
    import WeightModal from '$lib/components/WeightModal.svelte';
    import EditModal from '$lib/components/EditModal.svelte';
    import type { Food, PlateItem } from '$lib/types';
    
    let search = $state('');
    let sortOrder = $state('recent');
    let activeCategoryFilter = $state('All');

    let foods = $derived(appState.db);
    
    let filteredDb = $derived(
        foods.filter(f => {
            const itemCat = f.category || 'Ingredients';
            if (activeCategoryFilter !== 'All' && itemCat !== activeCategoryFilter) return false;
            const searchStr = `${f.brand || ''} ${f.name || ''} ${f.note || ''}`.toLowerCase();
            return searchStr.includes(search.toLowerCase());
        }).sort((a, b) => {
            if (sortOrder === 'recent') return (b.created_at || 0) - (a.created_at || 0);
            if (sortOrder === 'name') return (a.name || '').localeCompare(b.name || '');
            if (sortOrder === 'brand') return (a.brand || '').localeCompare(b.brand || '') || (a.name || '').localeCompare(b.name || '');
            return 0;
        })
    );

    let isWeightModalOpen = $state(false);
    let selectedFood = $state<Food | null>(null);

    let isEditModalOpen = $state(false);
    let editFoodData = $state<Food | null>(null);

    onMount(async () => {
        if (appState.currentHouseholdId) {
            appState.db = await fetchFoods(appState.currentHouseholdId);
        }
    });

    function openAddWeight(id: string) {
        selectedFood = foods.find(f => f.id === id) || null;
        if (selectedFood) isWeightModalOpen = true;
    }

    function confirmWeight(amount: number, mode: 'grams' | 'units') {
        if (!selectedFood) return;
        
        let calMultiplier = 0;
        let protMultiplier = 0;
        
        if (mode === 'grams') {
            calMultiplier = (selectedFood.calPer100 || 0) / 100;
            protMultiplier = (selectedFood.protPer100 || 0) / 100;
        } else {
            calMultiplier = selectedFood.calPerUnit || 0;
            protMultiplier = selectedFood.protPerUnit || 0;
        }

        const newItem: PlateItem = {
            id: Date.now() + Math.random(),
            baseName: selectedFood.name,
            amount: amount,
            mode: mode,
            totalCal: parseFloat((amount * calMultiplier).toFixed(1)),
            totalProt: parseFloat((amount * protMultiplier).toFixed(1)),
            calMultiplier: calMultiplier,
            protMultiplier: protMultiplier,
            foodId: selectedFood.id
        };

        appState.addPlateItem(newItem);
        goto('/');
    }

    function editFoodItem(id: string) {
        editFoodData = foods.find(f => f.id === id) || null;
        if (editFoodData) isEditModalOpen = true;
    }

    async function deleteFoodItem(id: string) {
        if (confirm("Delete this food item?")) {
            await deleteFood(id);
            appState.db = appState.db.filter(f => f.id !== id);
        }
    }
</script>

<div class="p-4 max-w-md mx-auto">
    <h2 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400 mb-4 text-center">Food Database</h2>
    
    <div class="flex gap-2 mb-4">
        <div class="relative flex-1">
            <span class="absolute left-3 top-3.5 text-muted">🔍</span>
            <input type="text" bind:value={search} class="w-full bg-base text-content pl-10 pr-3 py-3 rounded-xl border border-border focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition" placeholder="Search foods...">
        </div>
        <select bind:value={sortOrder} class="bg-base text-content px-3 py-3 rounded-xl border border-border focus:outline-none focus:border-primary-500 font-bold max-w-[110px]">
            <option value="recent">Recent</option>
            <option value="name">A-Z Name</option>
            <option value="brand">A-Z Brand</option>
        </select>
    </div>

    <!-- Category filters -->
    <div class="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-1">
        {#each ['All', 'Meals', 'Veggies & Fruit', 'Carbs', 'Meat & Fish', 'Dairy', 'Snacks', 'Drinks'] as cat}
            <button 
                onclick={() => activeCategoryFilter = cat}
                class="whitespace-nowrap px-4 py-1.5 rounded-full font-bold text-xs transition-all {activeCategoryFilter === cat ? 'bg-primary-600 text-primary-content' : 'bg-surface text-muted hover:bg-surface-elevated'}">
                {cat}
            </button>
        {/each}
    </div>

    <div class="space-y-3 mb-6">
        {#each filteredDb as food (food.id)}
            <FoodItemCard 
                {food} 
                onAdd={openAddWeight}
                onEdit={editFoodItem}
                onDelete={deleteFoodItem}
            />
        {/each}
        {#if filteredDb.length === 0}
            <div class="text-center py-10 bg-surface/50 rounded-xl border border-border border-dashed">
                <p class="text-muted font-medium">No foods found.</p>
            </div>
        {/if}
    </div>
</div>

<WeightModal 
    bind:isOpen={isWeightModalOpen} 
    food={selectedFood} 
    onConfirm={confirmWeight} 
/>

<EditModal 
    bind:isOpen={isEditModalOpen} 
    food={editFoodData} 
    onSave={async (data) => {
        // Assume update logic here, simplified for display since we just route the user
        // Usually, would call updateFood from services
    }}
/>
