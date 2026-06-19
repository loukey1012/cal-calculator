<script lang="ts">
    import type { Food } from '$lib/types';
    
    let { 
        food, 
        onAdd = () => {}, 
        onEdit = () => {}, 
        onDelete = () => {} 
    } = $props<{
        food: Food;
        onAdd?: (id: string) => void;
        onEdit?: (id: string) => void;
        onDelete?: (id: string) => void;
    }>();

    let showMenu = $state(false);

    let secondaryParts = [];
    if (food.brand) secondaryParts.push(food.brand);
    if (food.note) secondaryParts.push(`Note: ${food.note}`);
    let secondaryName = secondaryParts.join(' <span class="text-gray-600">|</span> ');

    let unitLabel = '(unit)';
    if (food.unitWeight != null && !isNaN(food.unitWeight)) {
        unitLabel = `(unit: ${food.unitWeight}g)`;
    }
</script>

<div class="bg-gray-900 rounded-lg border border-gray-700">
    <div class="flex justify-between items-stretch p-3">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="flex-1 cursor-pointer" onclick={() => onAdd(food.id)}>
            <div class="font-bold text-emerald-400 text-lg">{food.name}</div>
            {#if secondaryName}
                <div class="text-xs text-gray-400 mb-1 mt-0.5">{@html secondaryName}</div>
            {/if}
            <div class="text-xs text-gray-500 font-mono">
                {#if food.calPer100 != null}
                    <div>{food.calPer100} kcal | {food.protPer100 || 0}g prot <span class="text-gray-700">(100g)</span></div>
                {/if}
                {#if food.calPerUnit != null}
                    <div>{food.calPerUnit} kcal | {food.protPerUnit || 0}g prot <span class="text-gray-700">{unitLabel}</span></div>
                {/if}
            </div>
        </div>
        <div class="flex flex-col items-end justify-between ml-2">
            <span class="text-[8px] uppercase tracking-wider border border-gray-600 text-gray-400 px-1 leading-tight rounded">
                {food.category || 'Meals'}
            </span>
            <button onclick={() => showMenu = !showMenu} class="text-gray-500 hover:text-white text-sm transition">⚙</button>
        </div>
    </div>
    
    {#if showMenu}
        <div class="border-t border-gray-700 flex gap-2 p-2">
            <button onclick={() => { showMenu = false; onEdit(food.id); }} class="flex-1 bg-blue-600/20 text-blue-400 py-2 rounded-lg text-sm font-bold hover:bg-blue-600/40 transition">✏ Edit</button>
            <button onclick={() => { showMenu = false; onDelete(food.id); }} class="flex-1 bg-red-600/20 text-red-400 py-2 rounded-lg text-sm font-bold hover:bg-red-600/40 transition">✕ Delete</button>
            <button onclick={() => showMenu = false} class="flex-1 bg-gray-700 text-gray-300 py-2 rounded-lg text-sm font-bold hover:bg-gray-600 transition">Cancel</button>
        </div>
    {/if}
</div>
