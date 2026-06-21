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

    let secondaryParts = $derived.by(() => {
        let parts = [];
        if (food.brand) parts.push(food.brand);
        if (food.note) parts.push(`Note: ${food.note}`);
        return parts;
    });
    let secondaryName = $derived(secondaryParts.join(' <span class="text-muted/50">|</span> '));

    let unitLabel = $derived.by(() => {
        if (food.unitWeight != null && !isNaN(food.unitWeight)) {
            return `(unit: ${food.unitWeight}g)`;
        }
        return '(unit)';
    });
</script>

<div class="bg-base rounded-lg border border-border">
    <div class="flex justify-between items-stretch p-3">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="flex-1 cursor-pointer" onclick={() => onAdd(food.id)}>
            <div class="font-bold text-primary-400 text-lg">{food.name}</div>
            {#if secondaryName}
                <div class="text-xs text-muted mb-1 mt-0.5">{@html secondaryName}</div>
            {/if}
            <div class="text-xs text-muted font-mono">
                {#if food.calPer100 != null}
                    <div>{food.calPer100} kcal | {food.protPer100 || 0}g prot <span class="text-muted/50">(100g)</span></div>
                {/if}
                {#if food.calPerUnit != null}
                    <div>{food.calPerUnit} kcal | {food.protPerUnit || 0}g prot <span class="text-muted/50">{unitLabel}</span></div>
                {/if}
            </div>
        </div>
        <div class="flex flex-col items-end justify-between ml-2">
            <span class="text-[8px] uppercase tracking-wider border border-border text-muted px-1 leading-tight rounded">
                {food.category || 'Meals'}
            </span>
            <button onclick={() => showMenu = !showMenu} class="text-muted hover:text-content text-sm transition">⚙</button>
        </div>
    </div>
    
    {#if showMenu}
        <div class="border-t border-border flex gap-2 p-2">
            <button onclick={() => { showMenu = false; onEdit(food.id); }} class="flex-1 bg-secondary-600/20 text-secondary-400 py-2 rounded-lg text-sm font-bold hover:bg-secondary-600/40 transition">✏ Edit</button>
            <button onclick={() => { showMenu = false; onDelete(food.id); }} class="flex-1 bg-red-600/20 text-red-400 py-2 rounded-lg text-sm font-bold hover:bg-red-600/40 transition">✕ Delete</button>
            <button onclick={() => showMenu = false} class="flex-1 bg-surface-elevated text-content py-2 rounded-lg text-sm font-bold hover:bg-surface transition">Cancel</button>
        </div>
    {/if}
</div>
