<script lang="ts">
    import { appState } from '$lib/stores/appState.svelte';
    import { logOut, joinHousehold, updateProfileTheme } from '$lib/services/auth';
    import type { AppTheme, AccentColor } from '$lib/types';
    
    // Derived values for display
    let profile = $derived(appState.currentProfile);
    let user = $derived(appState.currentUser);

    let joinHouseholdId = $state('');
    let copied = $state(false);

    const themes: AppTheme[] = ['dark', 'light', 'pink', 'red'];
    const accents: AccentColor[] = ['mint', 'green', 'blue', 'indigo', 'purple', 'pink', 'rose', 'peach', 'sky', 'amber', 'violet'];

    async function changeTheme(t: AppTheme) {
        appState.theme = t;
        appState.saveLocalState();
        if (user) await updateProfileTheme(user.uid, { theme: t });
    }

    async function changeAccent(type: 'primary' | 'secondary', color: AccentColor) {
        if (type === 'primary') {
            appState.primaryAccent = color;
            appState.saveLocalState();
            if (user) await updateProfileTheme(user.uid, { primary_accent: color });
        } else {
            appState.secondaryAccent = color;
            appState.saveLocalState();
            if (user) await updateProfileTheme(user.uid, { secondary_accent: color });
        }
    }

    function copyId() {
        navigator.clipboard.writeText(profile?.household_id || '');
        copied = true;
        setTimeout(() => copied = false, 2000);
    }

    import { fetchFoods } from '$lib/services/database';

    async function handleJoinHousehold() {
        if (!joinHouseholdId || !user) return;
        if (confirm("Are you sure you want to join this household? You will lose access to your current household data.")) {
            try {
                await joinHousehold(user.uid, joinHouseholdId);
                
                if (appState.currentProfile) {
                    appState.currentProfile = { 
                        ...appState.currentProfile, 
                        household_id: joinHouseholdId 
                    };
                }
                appState.db = await fetchFoods(joinHouseholdId);

                alert("Successfully joined household!");
                joinHouseholdId = '';
            } catch (e: any) {
                alert(e.message);
            }
        }
    }

    async function handleLogout() {
        if (confirm("Are you sure you want to sign out?")) {
            await logOut();
        }
    }
</script>

<div class="p-4 max-w-md mx-auto pb-24">
    <h2 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400 mb-6 text-center">Settings</h2>
    
    <div class="bg-surface rounded-xl p-5 border border-border shadow-sm mb-6 flex items-center justify-between">
        <div>
            <div class="text-sm text-muted font-bold uppercase tracking-wider mb-1">Account</div>
            <div class="font-bold text-content text-lg">{profile?.display_name || 'User'}</div>
            <div class="text-xs text-muted">{user?.email}</div>
        </div>
        <button onclick={handleLogout} class="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg font-bold hover:bg-red-500/20 transition">Sign Out</button>
    </div>

    <div class="bg-surface rounded-xl p-5 border border-border shadow-sm mb-6">
        <div class="text-sm text-muted font-bold uppercase tracking-wider mb-3">Household</div>
        <div class="flex items-center gap-3 bg-base p-3 rounded-lg border border-border mb-3">
            <span class="text-2xl">🏠</span>
            <div class="flex-1 overflow-hidden">
                <div class="text-xs text-muted mb-0.5">Household ID</div>
                <div class="text-sm font-mono text-primary-400 truncate">{profile?.household_id || 'Not joined'}</div>
            </div>
            <button class="text-muted hover:text-content text-xs font-bold transition" onclick={copyId}>
                {copied ? '✅ Copied' : '📋 Copy'}
            </button>
        </div>
        <p class="text-xs text-muted mb-4">Share this ID with others so they can join your household and share the food database.</p>
        
        <div class="flex gap-2 mt-4 pt-4 border-t border-border">
            <div class="relative flex-1">
                <input type="text" bind:value={joinHouseholdId} class="peer w-full bg-base text-content px-3 pt-5 pb-1 rounded-lg border border-border focus:outline-none focus:border-primary-500 placeholder-transparent text-xs" placeholder="Enter Household ID">
                <label class="absolute left-3 top-1 text-[10px] text-primary-400 transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:text-muted peer-placeholder-shown:top-2.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-primary-400 pointer-events-none font-bold">Enter Partner's ID</label>
            </div>
            <button onclick={handleJoinHousehold} class="bg-primary-600 hover:bg-primary-500 text-primary-content px-4 rounded-lg font-bold text-sm transition">Join</button>
        </div>
    </div>

    <div class="bg-surface rounded-xl p-5 border border-border shadow-sm">
        <div class="text-sm text-muted font-bold uppercase tracking-wider mb-4">Appearance</div>
        
        <div class="mb-5">
            <div class="text-xs text-muted mb-2 font-bold">Background Theme</div>
            <div class="flex gap-2">
                {#each themes as t}
                    <button 
                        onclick={() => changeTheme(t)} 
                        class="flex-1 py-2 rounded-lg font-bold text-xs capitalize transition {appState.theme === t ? 'bg-primary-600 text-primary-content' : 'bg-base text-muted hover:text-content'}">
                        {t}
                    </button>
                {/each}
            </div>
        </div>

        <div class="mb-5">
            <div class="text-xs text-muted mb-2 font-bold">Primary Accent</div>
            <div class="flex flex-wrap gap-2">
                {#each accents as color}
                    <button 
                        onclick={() => changeAccent('primary', color)} 
                        class="px-3 py-1.5 rounded-lg font-bold text-xs capitalize transition {appState.primaryAccent === color ? 'bg-surface-elevated text-content border border-border-strong' : 'bg-base text-muted hover:text-content border border-transparent'}">
                        {color}
                    </button>
                {/each}
            </div>
        </div>

        <div>
            <div class="text-xs text-muted mb-2 font-bold">Secondary Accent</div>
            <div class="flex flex-wrap gap-2">
                {#each accents as color}
                    <button 
                        onclick={() => changeAccent('secondary', color)} 
                        class="px-3 py-1.5 rounded-lg font-bold text-xs capitalize transition {appState.secondaryAccent === color ? 'bg-surface-elevated text-content border border-border-strong' : 'bg-base text-muted hover:text-content border border-transparent'}">
                        {color}
                    </button>
                {/each}
            </div>
        </div>
    </div>
</div>
