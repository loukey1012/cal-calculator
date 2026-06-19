<script lang="ts">
    import type { EntryMode } from '$lib/types';

    let {
        isOpen = $bindable(false),
        itemName = "",
        mode = 'grams',
        initialAmount = 0,
        onConfirm = () => {}
    } = $props<{
        isOpen: boolean;
        itemName: string;
        mode: EntryMode;
        initialAmount: number;
        onConfirm: (amount: number) => void;
    }>();

    let amount = $state<number | ''>('');

    $effect(() => {
        if (isOpen) {
            amount = initialAmount;
        }
    });

    function confirm() {
        if (!amount || isNaN(Number(amount))) {
            alert("Please enter a valid amount.");
            return;
        }
        onConfirm(Number(amount));
        isOpen = false;
    }
</script>

{#if isOpen}
<div class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
    <div class="bg-gray-800 rounded-xl p-6 w-full max-w-xs border border-gray-700 shadow-2xl transform transition-all">
        <h3 class="text-xl font-bold text-emerald-400 mb-3 text-center">Edit Amount</h3>
        <p class="text-sm text-gray-400 mb-4 text-center font-bold">{itemName}</p>
        <div class="relative w-full mb-6">
            <!-- svelte-ignore a11y_autofocus -->
            <input autofocus type="number" bind:value={amount} inputmode="decimal" class="peer w-full bg-gray-900 text-white text-3xl px-4 pt-7 pb-2 rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none text-center font-bold placeholder-transparent" placeholder="Amount">
            <label class="absolute left-1/2 -translate-x-1/2 top-1 text-[10px] text-emerald-400 transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-emerald-400 pointer-events-none">
                {mode === 'grams' ? 'Grams' : 'Units'}
            </label>
        </div>
        <div class="flex gap-3">
            <button onclick={() => isOpen = false} class="flex-1 bg-gray-700 py-3 rounded-lg font-bold hover:bg-gray-600 transition text-gray-300">Cancel</button>
            <button onclick={confirm} class="flex-1 bg-emerald-600 py-3 rounded-lg font-bold hover:bg-emerald-500 transition text-white">Save</button>
        </div>
    </div>
</div>
{/if}
