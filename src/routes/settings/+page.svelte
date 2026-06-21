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
    const accents: AccentColor[] = ['mint', 'green', 'sky', 'indigo', 'purple', 'pink', 'amber'];

    const colorMap: Record<AccentColor, string> = {
        mint: '#2dd4bf', 
        green: '#22c55e',
        sky: '#0ea5e9',
        indigo: '#6366f1', 
        purple: '#a855f7', 
        pink: '#f472b6', 
        amber: '#f59e0b'
    };

    const themeColors: Record<AppTheme, {bg: string, text: string, border: string}> = {
        dark: { bg: '#111827', text: '#f9fafb', border: '#374151' },
        light: { bg: '#f9fafb', text: '#111827', border: '#e5e7eb' },
        pink: { bg: '#fdf2f8', text: '#831843', border: '#fbcfe8' },
        red: { bg: '#450a0a', text: '#fecaca', border: '#7f1d1d' }
    };

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
        
        <div class="mb-6">
            <div class="text-xs text-muted mb-3 font-bold">Background Theme</div>
            <div class="grid grid-cols-4 gap-3">
                {#each themes as t}
                    <button 
                        onclick={() => changeTheme(t)} 
                        class="py-2.5 rounded-full flex items-center justify-center font-bold text-xs capitalize transition-all transform hover:scale-105 {appState.theme === t ? 'outline outline-2 outline-offset-2 outline-content scale-105 shadow-lg' : 'shadow-sm'}"
                        style="background-color: {themeColors[t].bg}; color: {themeColors[t].text}; border: 2px solid {themeColors[t].border};"
                    >
                        {t}
                    </button>
                {/each}
            </div>
        </div>

        <div class="mb-6">
            <div class="text-xs text-muted mb-3 font-bold">Primary Accent</div>
            <div class="flex flex-wrap gap-4 px-1">
                {#each accents as color}
                    <button 
                        onclick={() => changeAccent('primary', color)} 
                        class="w-8 h-8 rounded-full shadow-md transition-all transform hover:scale-110 flex items-center justify-center {appState.primaryAccent === color ? 'scale-110 outline outline-2 outline-content border-2 border-surface' : 'border border-black/10 dark:border-white/10'}"
                        style="background-color: {colorMap[color]};"
                        title={color}
                    >
                        {#if appState.primaryAccent === color}
                            <span class="text-white text-[10px] font-black drop-shadow-md">✓</span>
                        {/if}
                    </button>
                {/each}
            </div>
        </div>

        <div>
            <div class="text-xs text-muted mb-3 font-bold">Secondary Accent</div>
            <div class="flex flex-wrap gap-4 px-1">
                {#each accents as color}
                    <button 
                        onclick={() => changeAccent('secondary', color)} 
                        class="w-8 h-8 rounded-full shadow-md transition-all transform hover:scale-110 flex items-center justify-center {appState.secondaryAccent === color ? 'scale-110 outline outline-2 outline-content border-2 border-surface' : 'border border-black/10 dark:border-white/10'}"
                        style="background-color: {colorMap[color]};"
                        title={color}
                    >
                        {#if appState.secondaryAccent === color}
                            <span class="text-white text-[10px] font-black drop-shadow-md">✓</span>
                        {/if}
                    </button>
                {/each}
            </div>
        </div>
    </div>
</div>
