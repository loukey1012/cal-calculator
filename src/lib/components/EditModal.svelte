<script lang="ts">
    import type { Food } from '$lib/types';
    
    let { 
        isOpen = $bindable(false),
        food = null,
        onSave = () => {}
    } = $props<{
        isOpen: boolean;
        food: Partial<Food> | null;
        onSave: (data: Partial<Food>) => void;
    }>();
    
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

    $effect(() => {
        if (isOpen) {
            if (food) {
                editData = { ...food };
            } else {
                // Reset for new
                editData = {
                    category: '',
                    brand: '',
                    name: '',
                    note: '',
                    calPer100: null,
                    protPer100: null,
                    calPerUnit: null,
                    protPerUnit: null,
                    unitWeight: null
                };
            }
        }
    });

    function save() {
        if (!editData.category) {
            alert("Category is required.");
            return;
        }
        if (!editData.name) {
            alert("Official Name is required.");
            return;
        }
        onSave(editData);
        isOpen = false;
    }
</script>

{#if isOpen}
<div class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
    <div class="bg-surface rounded-xl p-6 w-full max-w-xs border border-border shadow-2xl my-8">
        <h3 class="text-xl font-bold text-primary-400 mb-4 text-center">{food?.id ? 'Edit Food' : 'New Food'}</h3>
        <div class="space-y-2">
            <select bind:value={editData.category} class="w-full bg-base text-content px-3 py-2 rounded-lg border border-border focus:outline-none focus:border-primary-500 font-bold">
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

                <option value="Mci">Mci</option>
            </select>
            
            <div class="flex gap-2">
                <div class="relative w-1/3">
                    <input type="text" bind:value={editData.brand} autocomplete="off" class="peer w-full bg-base text-content px-3 pt-5 pb-1 rounded-lg border border-border focus:outline-none focus:border-primary-500 placeholder-transparent" placeholder="Brand">
                    <label class="absolute left-3 top-1 text-[10px] text-primary-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-2.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-primary-400 pointer-events-none">Brand</label>
                </div>
                <div class="relative w-2/3">
                    <input type="text" bind:value={editData.name} class="peer w-full bg-base text-content px-3 pt-5 pb-1 rounded-lg border border-border focus:outline-none focus:border-primary-500 placeholder-transparent" placeholder="Official Name">
                    <label class="absolute left-3 top-1 text-[10px] text-primary-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-2.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-primary-400 pointer-events-none">Official Name</label>
                </div>
            </div>
            
            <div class="relative w-full">
                <input type="text" bind:value={editData.note} class="peer w-full bg-base text-primary-400 px-3 pt-5 pb-1 rounded-lg border border-border focus:outline-none focus:border-primary-500 placeholder-transparent" placeholder="Note (optional)">
                <label class="absolute left-3 top-1 text-[10px] text-primary-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-2.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-primary-400 pointer-events-none">Note (optional)</label>
            </div>
            
            <div class="flex gap-2">
                <div class="relative w-1/2">
                    <input type="number" bind:value={editData.calPer100} inputmode="decimal" class="peer w-full bg-base text-content px-3 pt-5 pb-1 rounded-lg border border-border focus:outline-none focus:border-primary-500 placeholder-transparent" placeholder="Kcal/100g">
                    <label class="absolute left-3 top-1 text-[10px] text-primary-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-2.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-primary-400 pointer-events-none">Kcal/100g</label>
                </div>
                <div class="relative w-1/2">
                    <input type="number" bind:value={editData.protPer100} inputmode="decimal" class="peer w-full bg-base text-content px-3 pt-5 pb-1 rounded-lg border border-border focus:outline-none focus:border-secondary-500 placeholder-transparent" placeholder="Prot/100g">
                    <label class="absolute left-3 top-1 text-[10px] text-secondary-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-2.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-secondary-400 pointer-events-none">Prot/100g</label>
                </div>
            </div>
            
            <div class="flex gap-2">
                <div class="relative w-1/3">
                    <input type="number" bind:value={editData.calPerUnit} inputmode="decimal" class="peer w-full bg-base text-content px-3 pt-5 pb-1 rounded-lg border border-border focus:outline-none focus:border-primary-500 placeholder-transparent" placeholder="Kcal/unit">
                    <label class="absolute left-3 top-1 text-[10px] text-primary-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-2.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-primary-400 pointer-events-none">Kcal/unit</label>
                </div>
                <div class="relative w-1/3">
                    <input type="number" bind:value={editData.protPerUnit} inputmode="decimal" class="peer w-full bg-base text-content px-3 pt-5 pb-1 rounded-lg border border-border focus:outline-none focus:border-secondary-500 placeholder-transparent" placeholder="Prot/unit">
                    <label class="absolute left-3 top-1 text-[10px] text-secondary-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-2.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-secondary-400 pointer-events-none">Prot/unit</label>
                </div>
                <div class="relative w-1/3">
                    <input type="number" bind:value={editData.unitWeight} inputmode="decimal" class="peer w-full bg-base text-content px-3 pt-5 pb-1 rounded-lg border border-border focus:outline-none focus:border-primary-500 placeholder-transparent" placeholder="Weight (g)">
                    <label class="absolute left-3 top-1 text-[10px] text-primary-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-2.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-primary-400 pointer-events-none">Weight (g)</label>
                </div>
            </div>
        </div>
        
        <div class="flex gap-3 mt-4">
            <button onclick={() => isOpen = false} class="flex-1 bg-surface-elevated py-3 rounded-lg font-bold hover:bg-surface transition text-content">Cancel</button>
            <button onclick={save} class="flex-1 bg-primary-600 py-3 rounded-lg font-bold hover:bg-primary-500 transition text-primary-content">Save</button>
        </div>
    </div>
</div>
{/if}
