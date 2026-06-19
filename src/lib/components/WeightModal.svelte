<script lang="ts">
    import type { Food, EntryMode } from '$lib/types';
    
    let { 
        isOpen = $bindable(false),
        food = null,
        onConfirm = () => {}
    } = $props<{
        isOpen: boolean;
        food: Food | null;
        onConfirm: (amount: number, mode: EntryMode) => void;
    }>();

    let amount = $state<number | ''>('');
    let mode = $state<EntryMode>('grams');

    // Focus input when opened
    $effect(() => {
        if (isOpen && food) {
            amount = '';
            // Auto select mode based on what the food has
            if (food.calPer100 != null && food.calPerUnit == null) mode = 'grams';
            else if (food.calPerUnit != null && food.calPer100 == null) mode = 'units';
            else mode = 'grams'; // Default if both exist
        }
    });

    function confirm() {
        if (!amount || isNaN(Number(amount))) {
            alert("Please enter a valid amount.");
            return;
        }
        onConfirm(Number(amount), mode);
        isOpen = false;
    }
</script>

{#if isOpen && food}
<div class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
    <div class="bg-gray-800 rounded-xl p-6 w-full max-w-xs border border-gray-700 shadow-2xl transform transition-all">
        <h3 class="text-xl font-bold text-emerald-400 mb-3 text-center">{food.name}</h3>
        
        {#if food.calPer100 != null && food.calPerUnit != null}
        <div class="flex gap-2 mb-3">
            <button onclick={() => mode = 'grams'} class="flex-1 py-2 rounded-lg font-bold text-sm transition {mode === 'grams' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300'}">By Weight (g)</button>
            <button onclick={() => mode = 'units'} class="flex-1 py-2 rounded-lg font-bold text-sm transition {mode === 'units' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300'}">By Unit</button>
        </div>
        {/if}

        <div class="relative w-full mb-6">
            <!-- svelte-ignore a11y_autofocus -->
            <input autofocus type="number" bind:value={amount} inputmode="decimal" class="peer w-full bg-gray-900 text-white text-3xl px-4 pt-7 pb-2 rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none text-center font-bold placeholder-transparent" placeholder="Amount">
            <label class="absolute left-1/2 -translate-x-1/2 top-1 text-[10px] text-emerald-400 transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-emerald-400 pointer-events-none">
                {mode === 'grams' ? 'Grams' : 'Units'}
            </label>
        </div>
        <div class="flex gap-3">
            <button onclick={() => isOpen = false} class="flex-1 bg-gray-700 py-3 rounded-lg font-bold hover:bg-gray-600 transition text-gray-300">Cancel</button>
            <button onclick={confirm} class="flex-1 bg-emerald-600 py-3 rounded-lg font-bold hover:bg-emerald-500 transition text-white">Add to Plate</button>
        </div>
    </div>
</div>
{/if}
