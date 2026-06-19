<script lang="ts">
    import { appState } from '$lib/stores/appState.svelte';
    import PlateEditModal from '$lib/components/PlateEditModal.svelte';
    
    let isEditModalOpen = $state(false);
    let editItemName = $state('');
    let editItemMode = $state<'grams' | 'units'>('grams');
    let editItemAmount = $state(0);
    let editItemId = $state<number | null>(null);

    let activeCatLog = $derived(appState.dailyLog[appState.activeCategory] || {});
    let meals = $derived(Object.entries(activeCatLog));
    let activeMeal = $derived(activeCatLog[appState.activeMealId] || { title: '', items: [] });

    let totalCal = $derived(activeMeal.items.reduce((sum, item) => sum + item.totalCal, 0));
    let totalProt = $derived(activeMeal.items.reduce((sum, item) => sum + item.totalProt, 0));

    function switchCategory(cat: string) {
        appState.activeCategory = cat;
        const catMeals = Object.keys(appState.dailyLog[cat] || {});
        if (catMeals.length > 0) {
            appState.activeMealId = catMeals[0];
        }
        appState.saveLocalState();
    }

    function switchMeal(id: string) {
        appState.activeMealId = id;
        appState.saveLocalState();
    }

    function openEdit(item: any) {
        editItemId = item.id;
        editItemName = item.baseName;
        editItemMode = item.mode;
        editItemAmount = item.amount;
        isEditModalOpen = true;
    }

    function saveEdit(newAmount: number) {
        if (editItemId) {
            appState.updatePlateItemAmount(appState.activeCategory, appState.activeMealId, editItemId, newAmount);
        }
    }
</script>

<div class="p-4 max-w-md mx-auto">
    <div class="flex justify-center items-baseline gap-2 mb-6">
        <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--color-primary-400))] to-[rgb(var(--color-secondary-400))]">CALculator</h1>
        <span class="text-xs font-bold text-gray-500 tracking-wider">v0.4.0.0</span>
    </div>

    <!-- Category Tabs -->
    <div class="flex gap-2 mb-4 overflow-x-auto hide-scrollbar pb-1">
        {#each Object.keys(appState.dailyLog) as cat}
            <button 
                onclick={() => switchCategory(cat)} 
                class="whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-all {appState.activeCategory === cat ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}">
                {cat}
            </button>
        {/each}
    </div>

    <!-- Meal Tabs -->
    <div class="flex gap-2 mb-4 overflow-x-auto hide-scrollbar">
        {#each meals as [id, meal]}
            <button 
                onclick={() => switchMeal(id)} 
                class="whitespace-nowrap px-3 py-1.5 rounded-lg font-bold text-xs transition-all {appState.activeMealId === id ? 'bg-gray-700 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-500 border border-gray-700'}">
                {meal.title}
            </button>
        {/each}
        <button onclick={() => appState.addMeal(appState.activeCategory)} class="px-3 py-1.5 rounded-lg font-bold text-xs bg-gray-800 text-emerald-500 border border-gray-700 hover:bg-gray-700 transition">
            + Meal
        </button>
    </div>

    <!-- Active Meal Header -->
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">{activeMeal.title}</h2>
        <div class="flex gap-2">
            <button onclick={() => appState.clearMeal(appState.activeCategory, appState.activeMealId)} class="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg font-bold hover:bg-red-500/20 transition">Clear</button>
        </div>
    </div>

    <!-- Items List -->
    <div class="space-y-3 mb-6">
        {#if activeMeal.items.length === 0}
            <div class="text-center py-8 bg-gray-800/50 rounded-xl border border-gray-700 border-dashed">
                <span class="text-4xl mb-2 block opacity-50">🍽️</span>
                <p class="text-gray-500 font-medium text-sm">Plate is empty</p>
                <p class="text-gray-600 text-xs mt-1">Go to Foods or Custom to add items.</p>
            </div>
        {/if}

        {#each activeMeal.items as item}
            <div class="bg-gray-800 p-3 rounded-xl border border-gray-700 flex justify-between items-center shadow-sm">
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div class="flex-1 cursor-pointer" onclick={() => openEdit(item)}>
                    <div class="font-bold text-white text-sm mb-0.5">{item.baseName}</div>
                    <div class="text-xs text-gray-400 font-medium">{item.amount} {item.mode === 'grams' ? 'g' : 'unit'}</div>
                </div>
                <div class="text-right ml-3 flex flex-col items-end">
                    <div class="text-emerald-400 font-bold leading-tight">{item.totalCal} <span class="text-[10px] text-gray-500 font-normal">kcal</span></div>
                    <div class="text-blue-400 font-bold leading-tight text-sm">{item.totalProt} <span class="text-[10px] text-gray-500 font-normal">g</span></div>
                    <button onclick={() => appState.removePlateItem(appState.activeCategory, appState.activeMealId, item.id)} class="text-gray-500 hover:text-red-400 text-xs mt-1 font-bold transition">✕ Remove</button>
                </div>
            </div>
        {/each}
    </div>

    <!-- Summary -->
    {#if activeMeal.items.length > 0}
    <div class="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-2xl border border-gray-700 shadow-xl relative overflow-hidden mb-6">
        <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <h3 class="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Meal Summary</h3>
        <div class="flex justify-between items-end">
            <div>
                <div class="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-1">Calories</div>
                <div class="text-4xl font-black text-white leading-none">{totalCal.toFixed(1)}</div>
            </div>
            <div class="text-right">
                <div class="text-[10px] text-blue-500 font-bold uppercase tracking-widest mb-1">Protein</div>
                <div class="text-3xl font-black text-white leading-none">{totalProt.toFixed(1)}<span class="text-lg text-gray-500 ml-1">g</span></div>
            </div>
        </div>
    </div>
    {/if}

    <div class="space-y-3">
        <button onclick={() => { if(confirm('Reset the entire day?')) appState.resetDailyLog(); }} class="w-full bg-red-950/30 text-red-400 border border-red-900/50 py-3.5 rounded-xl font-bold hover:bg-red-900/40 transition">
            Reset Entire Day
        </button>
    </div>
</div>

<PlateEditModal 
    bind:isOpen={isEditModalOpen} 
    itemName={editItemName} 
    mode={editItemMode} 
    initialAmount={editItemAmount} 
    onConfirm={saveEdit} 
/>
