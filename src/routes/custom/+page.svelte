<script lang="ts">
    import { appState } from '$lib/stores/appState.svelte';
    import type { PlateItem } from '$lib/types';
    import { goto } from '$app/navigation';
    
    let customName = $state('');
    let mode = $state<'total' | 'grams' | 'units'>('total');
    
    let calInput = $state<number | ''>('');
    let protInput = $state<number | ''>('');
    let amount = $state<number | ''>('');

    function addCustom() {
        if (!calInput && calInput !== 0) {
            alert("Please enter calories.");
            return;
        }

        if (mode !== 'total' && (!amount || amount <= 0)) {
            alert("Please enter a valid amount.");
            return;
        }
        
        let totalC = 0;
        let totalP = 0;
        let itemAmount = 1;
        let itemMode: 'grams' | 'units' = 'units';
        let calMult = 0;
        let protMult = 0;

        const cal = Number(calInput);
        const prot = Number(protInput || 0);
        const amt = Number(amount || 0);

        if (mode === 'total') {
            totalC = cal;
            totalP = prot;
            calMult = cal;
            protMult = prot;
            itemAmount = 1;
            itemMode = 'units';
        } else if (mode === 'grams') {
            totalC = (cal / 100) * amt;
            totalP = (prot / 100) * amt;
            calMult = cal / 100;
            protMult = prot / 100;
            itemAmount = amt;
            itemMode = 'grams';
        } else if (mode === 'units') {
            totalC = cal * amt;
            totalP = prot * amt;
            calMult = cal;
            protMult = prot;
            itemAmount = amt;
            itemMode = 'units';
        }

        const newItem: PlateItem = {
            id: Date.now() + Math.random(),
            baseName: customName || 'Custom Entry',
            amount: itemAmount,
            mode: itemMode,
            totalCal: totalC,
            totalProt: totalP,
            calMultiplier: calMult,
            protMultiplier: protMult,
            foodId: null
        };

        appState.addPlateItem(newItem);
        customName = '';
        calInput = '';
        protInput = '';
        amount = '';
        goto('/');
    }
</script>

<div class="p-4 max-w-md mx-auto pb-24">
    <h2 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400 mb-6 text-center">Custom Entry</h2>
    
    <div class="bg-surface p-6 rounded-2xl border border-border shadow-xl space-y-4">
        <div class="relative w-full">
            <!-- svelte-ignore a11y_autofocus -->
            <input autofocus type="text" bind:value={customName} class="peer w-full bg-base text-content px-4 pt-7 pb-2 rounded-xl border border-border focus:outline-none focus:border-primary-500 placeholder-transparent" placeholder="Name">
            <label class="absolute left-4 top-2 text-[10px] text-primary-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-muted peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary-400 pointer-events-none font-bold">Entry Name (Optional)</label>
        </div>

        <div class="flex bg-base rounded-xl p-1 border border-border">
            <button onclick={() => mode = 'total'} class="flex-1 py-2 text-xs font-bold rounded-lg transition-all {mode === 'total' ? 'bg-surface-elevated text-content shadow-sm' : 'text-muted hover:text-content'}">Total Macros</button>
            <button onclick={() => mode = 'grams'} class="flex-1 py-2 text-xs font-bold rounded-lg transition-all {mode === 'grams' ? 'bg-surface-elevated text-content shadow-sm' : 'text-muted hover:text-content'}">Per 100g</button>
            <button onclick={() => mode = 'units'} class="flex-1 py-2 text-xs font-bold rounded-lg transition-all {mode === 'units' ? 'bg-surface-elevated text-content shadow-sm' : 'text-muted hover:text-content'}">Per Unit</button>
        </div>
        
        <div class="flex gap-3">
            <div class="relative w-1/2">
                <input type="number" bind:value={calInput} inputmode="decimal" class="peer w-full bg-base text-content text-2xl font-black px-4 pt-8 pb-3 rounded-xl border border-border focus:outline-none focus:border-primary-500 placeholder-transparent" placeholder="0">
                <label class="absolute left-4 top-2 text-[10px] text-primary-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-5 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary-500 pointer-events-none font-bold uppercase tracking-wider">{mode === 'grams' ? 'Cal / 100g' : mode === 'units' ? 'Cal / Unit' : 'Total Cal'}</label>
            </div>
            <div class="relative w-1/2">
                <input type="number" bind:value={protInput} inputmode="decimal" class="peer w-full bg-base text-content text-2xl font-black px-4 pt-8 pb-3 rounded-xl border border-border focus:outline-none focus:border-secondary-500 placeholder-transparent" placeholder="0">
                <label class="absolute left-4 top-2 text-[10px] text-secondary-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-5 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-secondary-500 pointer-events-none font-bold uppercase tracking-wider">{mode === 'grams' ? 'Prot / 100g' : mode === 'units' ? 'Prot / Unit' : 'Total Prot'}</label>
            </div>
        </div>

        {#if mode !== 'total'}
        <div class="relative w-full">
            <input type="number" bind:value={amount} inputmode="decimal" class="peer w-full bg-base text-content text-2xl font-black px-4 pt-8 pb-3 rounded-xl border border-border focus:outline-none focus:border-primary-500 placeholder-transparent" placeholder="0">
            <label class="absolute left-4 top-2 text-[10px] text-primary-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-5 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary-400 pointer-events-none font-bold uppercase tracking-wider">{mode === 'grams' ? 'Amount (grams)' : 'Number of Units'}</label>
        </div>
        {/if}

        <button onclick={addCustom} class="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-primary-content font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary-500/20 transform transition active:scale-[0.98] mt-2">
            Add to Plate
        </button>
    </div>
</div>
