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
    <div class="bg-surface rounded-xl p-6 w-full max-w-xs border border-border shadow-2xl transform transition-all">
        <h3 class="text-xl font-bold text-primary-400 mb-3 text-center">Edit Amount</h3>
        <p class="text-sm text-muted mb-4 text-center font-bold">{itemName}</p>
        <div class="relative w-full mb-6">
            <!-- svelte-ignore a11y_autofocus -->
            <input autofocus type="number" bind:value={amount} inputmode="decimal" class="peer w-full bg-base text-content text-3xl px-4 pt-7 pb-2 rounded-lg border border-border focus:border-primary-500 focus:outline-none text-center font-bold placeholder-transparent" placeholder="Amount">
            <label class="absolute left-1/2 -translate-x-1/2 top-1 text-[10px] text-primary-400 transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:text-muted peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-primary-400 pointer-events-none">
                {mode === 'grams' ? 'Grams' : 'Units'}
            </label>
        </div>
        <div class="flex gap-3">
            <button onclick={() => isOpen = false} class="flex-1 bg-surface-elevated py-3 rounded-lg font-bold hover:bg-surface transition text-content">Cancel</button>
            <button onclick={confirm} class="flex-1 bg-primary-600 py-3 rounded-lg font-bold hover:bg-primary-500 transition text-primary-content">Save</button>
        </div>
    </div>
</div>
{/if}
