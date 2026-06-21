<script lang="ts">
    import { appState } from "$lib/stores/appState.svelte";
    import PlateEditModal from "$lib/components/PlateEditModal.svelte";

    let isEditModalOpen = $state(false);
    let editItemName = $state("");
    let editItemMode = $state<"grams" | "units">("grams");
    let editItemAmount = $state(0);
    let editItemId = $state<number | null>(null);

    let activeCatLog = $derived(
        appState.dailyLog[appState.activeCategory] || {},
    );
    let meals = $derived(Object.entries(activeCatLog));
    let activeMeal = $derived(
        activeCatLog[appState.activeMealId] || { title: "", items: [] },
    );

    let totalCal = $derived(
        activeMeal.items.reduce((sum, item) => sum + item.totalCal, 0),
    );
    let totalProt = $derived(
        activeMeal.items.reduce((sum, item) => sum + item.totalProt, 0),
    );

    let showToast = $state(false);
    let toastMessage = $state("");

    function copyCal() {
        navigator.clipboard.writeText(totalCal.toFixed(1));
        toastMessage = "Calories copied to clipboard!";
        showToast = true;
        setTimeout(() => (showToast = false), 2000);
    }

    function copyProt() {
        navigator.clipboard.writeText(totalProt.toFixed(1));
        toastMessage = "Protein copied to clipboard!";
        showToast = true;
        setTimeout(() => (showToast = false), 2000);
    }

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
            appState.updatePlateItemAmount(
                appState.activeCategory,
                appState.activeMealId,
                editItemId,
                newAmount,
            );
        }
    }
</script>

<div class="p-4 max-w-md mx-auto">
    <div class="flex justify-center mb-6">
        <div class="relative inline-block">
            <h1
                class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400"
            >
                CALculator
            </h1>
            <span
                class="absolute left-full ml-1 bottom-1 text-[10px] font-bold text-muted tracking-wider whitespace-nowrap"
                >v0.4.1.0</span
            >
        </div>
    </div>

    <!-- Category Tabs -->
    <div class="flex gap-2 mb-4 overflow-x-auto hide-scrollbar pb-1">
        {#each Object.keys(appState.dailyLog) as cat}
            <button
                onclick={() => switchCategory(cat)}
                class="whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-all {appState.activeCategory ===
                cat
                    ? 'bg-primary-600 text-primary-content shadow-lg shadow-primary-500/20'
                    : 'bg-surface text-muted hover:bg-surface-elevated'}"
            >
                {cat}
            </button>
        {/each}
    </div>

    <!-- Meal Tabs -->
    <div class="flex gap-2 mb-4 overflow-x-auto hide-scrollbar">
        {#each meals as [id, meal]}
            <button
                onclick={() => switchMeal(id)}
                class="whitespace-nowrap px-3 py-1.5 rounded-lg font-bold text-xs transition-all {appState.activeMealId ===
                id
                    ? 'bg-surface-elevated text-primary-400 border border-primary-500/30'
                    : 'bg-surface text-muted border border-border'}"
            >
                {meal.title}
            </button>
        {/each}
        <button
            onclick={() => appState.addMeal(appState.activeCategory)}
            class="px-3 py-1.5 rounded-lg font-bold text-xs bg-surface text-primary-500 border border-border hover:bg-surface-elevated transition"
        >
            + Meal
        </button>
    </div>

    <!-- Active Meal Header -->
    <div class="flex justify-between items-center mb-4">
        <h2
            class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400"
        >
            {activeMeal.title}
        </h2>
        <div class="flex gap-2">
            <button
                onclick={() => {
                    if (confirm("Delete this meal?"))
                        appState.deleteMeal(
                            appState.activeCategory,
                            appState.activeMealId,
                        );
                }}
                class="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg font-bold hover:bg-red-500/20 transition"
                >Delete</button
            >
        </div>
    </div>

    <!-- Items List -->
    <div class="space-y-3 mb-6">
        {#if activeMeal.items.length === 0}
            <div
                class="text-center py-8 bg-surface/50 rounded-xl border border-border border-dashed"
            >
                <span class="text-4xl mb-2 block opacity-50">🍽️</span>
                <p class="text-muted font-medium text-sm">Plate is empty</p>
                <p class="text-muted/70 text-xs mt-1">
                    Go to Foods or Custom to add items.
                </p>
            </div>
        {/if}

        {#each activeMeal.items as item}
            <div
                class="bg-surface p-3 rounded-xl border border-border flex justify-between items-center shadow-sm"
            >
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    class="flex-1 cursor-pointer"
                    onclick={() => openEdit(item)}
                >
                    <div class="font-bold text-content text-sm mb-0.5">
                        {item.baseName}
                    </div>
                    <div class="text-xs text-muted font-medium">
                        {item.amount}
                        {item.mode === "grams" ? "g" : "unit"}
                    </div>
                </div>
                <div class="text-right ml-3 flex flex-col items-end">
                    <div class="text-primary-400 font-bold leading-tight">
                        {item.totalCal}
                        <span class="text-[10px] text-muted font-normal"
                            >kcal</span
                        >
                    </div>
                    <div
                        class="text-secondary-400 font-bold leading-tight text-sm"
                    >
                        {item.totalProt}
                        <span class="text-[10px] text-muted font-normal">g</span
                        >
                    </div>
                    <button
                        onclick={() => {
                            if (confirm("Remove this item from the meal?"))
                                appState.removePlateItem(
                                    appState.activeCategory,
                                    appState.activeMealId,
                                    item.id,
                                );
                        }}
                        class="text-muted hover:text-red-400 text-xs mt-1 font-bold transition"
                        >✕ Remove</button
                    >
                </div>
            </div>
        {/each}
    </div>

    <!-- Summary -->
    {#if activeMeal.items.length > 0}
        <div
            class="bg-gradient-to-br from-surface to-base p-4 rounded-2xl border border-border shadow-xl relative overflow-hidden mb-6"
        >
            <div
                class="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"
            ></div>
            <h3
                class="text-sm font-bold text-muted mb-3 uppercase tracking-wider"
            >
                Meal Summary
            </h3>
            <div class="flex justify-between items-end">
                <button
                    onclick={copyCal}
                    class="text-left cursor-pointer hover:opacity-80 transition active:scale-[0.98]"
                >
                    <div
                        class="text-[10px] text-primary-500 font-bold uppercase tracking-widest mb-1"
                    >
                        Calories
                    </div>
                    <div class="text-4xl font-black text-content leading-none">
                        {totalCal.toFixed(1)}
                    </div>
                </button>
                <button
                    onclick={copyProt}
                    class="text-right cursor-pointer hover:opacity-80 transition active:scale-[0.98]"
                >
                    <div
                        class="text-[10px] text-secondary-500 font-bold uppercase tracking-widest mb-1"
                    >
                        Protein
                    </div>
                    <div class="text-3xl font-black text-content leading-none">
                        {totalProt.toFixed(1)}<span
                            class="text-lg text-muted ml-1">g</span
                        >
                    </div>
                </button>
            </div>
        </div>
    {/if}

    <div class="space-y-3">
        <button
            onclick={() => {
                if (confirm("Reset the entire day?")) appState.resetDailyLog();
            }}
            class="w-full bg-red-500/15 text-red-500 border border-red-500/30 py-3.5 rounded-xl font-bold hover:bg-red-500/25 transition"
        >
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

{#if showToast}
    <div
        class="fixed bottom-24 left-1/2 -translate-x-1/2 bg-surface-elevated/90 backdrop-blur-md text-content px-5 py-2.5 rounded-full shadow-2xl border border-border text-sm font-bold z-50 pointer-events-none transition-all"
    >
        {toastMessage}
    </div>
{/if}
