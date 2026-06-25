<script lang="ts">
    import '../app.css';
    import { onMount } from 'svelte';
    import { fade, scale } from 'svelte/transition';
    import { listenToAuth, signUp, login, signInWithGoogle } from '$lib/services/auth';
    import { fetchFoods } from '$lib/services/database';
    import { appState } from '$lib/stores/appState.svelte';
    import BottomNav from '$lib/components/BottomNav.svelte';
    import { browser } from '$app/environment';
    
    let { children } = $props();

    let authLoading = $state(true);
    let authMode = $state<'login' | 'signup'>('signup');
    let email = $state('');
    let password = $state('');
    let displayName = $state('');
    let authError = $state('');
    let showSplash = $state(true);

    onMount(() => {
        setTimeout(() => {
            showSplash = false;
        }, 1200);

        if (appState.cachedAuth) {
            authLoading = false;
        }

        const unsubscribe = listenToAuth((user, profile) => {
            appState.currentUser = user;
            appState.currentProfile = profile;
            
            if (profile) {
                appState.theme = profile.theme || 'dark';
                appState.primaryAccent = profile.primary_accent || 'mint';
                appState.secondaryAccent = profile.secondary_accent || 'pink';
                appState.saveLocalState();
                
                if (profile.household_id) {
                    fetchFoods(profile.household_id).then(db => {
                        appState.db = db;
                        appState.saveLocalState();
                    }).catch(e => console.error("Failed to fetch database", e));
                }
            } else {
                appState.cachedAuth = false;
                appState.db = [];
                appState.saveLocalState();
            }
            authLoading = false;
        });
        return unsubscribe;
    });

    $effect(() => {
        if (browser) {
            document.body.setAttribute('data-theme', appState.theme);
            
            const palettes: Record<string, any> = {
                green:  { 400: '74 222 128', 500: '34 197 94',  600: '22 163 74', content: '17 24 39' },
                mint:   { 400: '94 234 212', 500: '45 212 191', 600: '20 184 166', content: '17 24 39' },
                blue:   { 400: '96 165 250', 500: '59 130 246', 600: '37 99 235', content: '255 255 255' },
                indigo: { 400: '129 140 248', 500: '99 102 241', 600: '79 70 229', content: '255 255 255' },
                purple: { 400: '192 132 252', 500: '168 85 247', 600: '147 51 234', content: '255 255 255' },
                pink:   { 400: '249 168 212', 500: '244 114 182', 600: '236 72 153', content: '80 7 36' },
                rose:   { 400: '253 164 175', 500: '251 113 133', 600: '244 63 94', content: '255 255 255' },
                peach:  { 400: '253 186 116', 500: '251 146 60',  600: '249 115 22', content: '17 24 39' },
                sky:    { 400: '56 189 248', 500: '14 165 233', 600: '2 132 199', content: '255 255 255' },
                amber:  { 400: '251 191 36', 500: '245 158 11', 600: '217 119 6', content: '17 24 39' },
                violet: { 400: '167 139 250', 500: '139 92 246', 600: '124 58 237', content: '255 255 255' }
            };

            const p = palettes[appState.primaryAccent] || palettes.mint;
            document.documentElement.style.setProperty('--color-primary-400', p[400]);
            document.documentElement.style.setProperty('--color-primary-500', p[500]);
            document.documentElement.style.setProperty('--color-primary-600', p[600]);
            document.documentElement.style.setProperty('--primary-content', p.content);

            const s = palettes[appState.secondaryAccent] || palettes.pink;
            document.documentElement.style.setProperty('--color-secondary-400', s[400]);
            document.documentElement.style.setProperty('--color-secondary-500', s[500]);
            document.documentElement.style.setProperty('--color-secondary-600', s[600]);
            document.documentElement.style.setProperty('--secondary-content', s.content);
        }
    });

    async function handleAuth() {
        authError = '';
        try {
            if (authMode === 'signup') {
                if (!email || !password || !displayName) throw new Error("Please fill all fields.");
                await signUp(email, password, displayName);
            } else {
                if (!email || !password) throw new Error("Please fill all fields.");
                await login(email, password);
            }
        } catch (e: any) {
            authError = e.message;
        }
    }

    async function handleGoogleAuth() {
        authError = '';
        authLoading = true;
        try {
            await signInWithGoogle();
        } catch (e: any) {
            authError = e.message;
            authLoading = false;
        }
    }
</script>

{#if authLoading}
    <div class="fixed inset-0 bg-base flex items-center justify-center z-50 transition-opacity duration-300">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
{:else if !appState.isAuth}
    <div class="min-h-[100dvh] flex flex-col justify-center items-center p-4">
        <div class="w-full max-w-md bg-surface rounded-2xl p-6 md:p-8 shadow-2xl border border-border">
            <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-500 mb-2 text-center">CALculator</h1>
            <p class="text-muted text-center mb-8 font-medium">Household Calorie Tracker</p>
            
            {#if authError}
                <div class="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-4">{authError}</div>
            {/if}

            <div class="space-y-4">
                {#if authMode === 'signup'}
                    <div class="relative">
                        <input type="text" bind:value={displayName} class="peer w-full bg-base text-content px-4 pt-6 pb-2 rounded-xl border border-border focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition placeholder-transparent" placeholder="Name">
                        <label class="absolute left-4 top-2 text-[10px] text-primary-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary-400 pointer-events-none font-bold uppercase tracking-wider">Display Name</label>
                    </div>
                {/if}
                <div class="relative">
                    <input type="email" bind:value={email} class="peer w-full bg-base text-content px-4 pt-6 pb-2 rounded-xl border border-border focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition placeholder-transparent" placeholder="Email">
                    <label class="absolute left-4 top-2 text-[10px] text-primary-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary-400 pointer-events-none font-bold uppercase tracking-wider">Email Address</label>
                </div>
                <div class="relative">
                    <input type="password" bind:value={password} class="peer w-full bg-base text-content px-4 pt-6 pb-2 rounded-xl border border-border focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition placeholder-transparent" placeholder="Password">
                    <label class="absolute left-4 top-2 text-[10px] text-primary-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary-400 pointer-events-none font-bold uppercase tracking-wider">Password</label>
                </div>
                
                <button onclick={handleAuth} class="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-primary-content font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/20 transform transition active:scale-[0.98] mt-2">
                    {authMode === 'signup' ? 'Create Account' : 'Sign In'}
                </button>
                
                <div class="relative flex items-center py-2">
                    <div class="flex-grow border-t border-border"></div>
                    <span class="flex-shrink-0 mx-4 text-muted text-xs font-bold">OR</span>
                    <div class="flex-grow border-t border-border"></div>
                </div>

                <button onclick={handleGoogleAuth} class="w-full bg-surface-elevated hover:bg-surface text-content font-bold py-3.5 rounded-xl shadow-lg transform transition active:scale-[0.98] flex items-center justify-center gap-3">
                    <svg class="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                </button>
            </div>

            <div class="mt-6 text-center">
                <button onclick={() => { authMode = authMode === 'signup' ? 'login' : 'signup'; authError = ''; }} class="text-sm text-muted hover:text-primary-400 transition font-medium">
                    {authMode === 'signup' ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                </button>
            </div>
        </div>
    </div>
{:else}
    <div class="pb-[calc(4rem+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)] min-h-screen">
        {@render children()}
    </div>
    <BottomNav />
{/if}

{#if showSplash}
    <div class="fixed inset-0 bg-base z-[100] flex flex-col items-center justify-center" out:fade={{ duration: 400 }}>
        <div class="relative flex flex-col items-center" in:scale={{ start: 0.8, duration: 800, opacity: 0 }}>
            <img src="/favicon.png" alt="CALculator Icon" class="w-24 h-24 mb-6 rounded-3xl shadow-2xl shadow-primary-500/20" />
            <h1 class="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-500 tracking-tight text-center animate-pulse">CALculator</h1>
        </div>
    </div>
{/if}
