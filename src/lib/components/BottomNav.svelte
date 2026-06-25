<script lang="ts">
    import { page } from '$app/state';
    import { onMount } from 'svelte';

    let isKeyboardOpen = $state(false);

    onMount(() => {
        const handleResize = () => {
            if (window.visualViewport) {
                // If visual viewport is significantly smaller than the layout viewport, keyboard is likely open
                if (window.visualViewport.height < window.innerHeight - 100) {
                    isKeyboardOpen = true;
                } else {
                    isKeyboardOpen = false;
                }
            }
        };

        const handleFocus = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
                isKeyboardOpen = true;
            }
        };

        const handleBlur = () => {
            setTimeout(() => {
                if (!document.activeElement || !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
                    // Check visual viewport as a fallback before closing
                    if (!window.visualViewport || window.visualViewport.height >= window.innerHeight - 100) {
                        isKeyboardOpen = false;
                    }
                }
            }, 50);
        };

        document.addEventListener('focusin', handleFocus);
        document.addEventListener('focusout', handleBlur);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleResize);
        }

        return () => {
            document.removeEventListener('focusin', handleFocus);
            document.removeEventListener('focusout', handleBlur);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleResize);
            }
        };
    });
</script>

<nav class="fixed bottom-0 left-0 right-0 z-40 w-full bg-base border-t border-border pb-[env(safe-area-inset-bottom)] transition-all duration-200 {isKeyboardOpen ? 'translate-y-[150%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}">
    <div class="flex justify-between items-center max-w-md mx-auto h-16">
        <!-- Home -->
        <a href="/" class="flex-1 h-full flex flex-col items-center justify-center transition-colors {page.url.pathname === '/' ? 'text-primary-400' : 'text-muted hover:text-content'}">
            <span class="text-xl leading-none mb-1">🍽️</span>
            <span class="text-[10px] font-bold leading-none">Meal</span>
        </a>
        <!-- DB -->
        <a href="/database" class="flex-1 h-full flex flex-col items-center justify-center transition-colors {page.url.pathname === '/database' ? 'text-primary-400' : 'text-muted hover:text-content'}">
            <span class="text-xl leading-none mb-1">🍎</span>
            <span class="text-[10px] font-bold leading-none">Foods</span>
        </a>
        <!-- Custom -->
        <a href="/custom" class="flex-1 h-full flex flex-col items-center justify-center transition-colors {page.url.pathname === '/custom' ? 'text-primary-400' : 'text-muted hover:text-content'}">
            <span class="text-xl leading-none mb-1">⚖️</span>
            <span class="text-[10px] font-bold leading-none">Custom</span>
        </a>
        <!-- New -->
        <a href="/new" class="flex-1 h-full flex flex-col items-center justify-center transition-colors {page.url.pathname === '/new' ? 'text-primary-400' : 'text-muted hover:text-content'}">
            <span class="text-xl leading-none mb-1">➕</span>
            <span class="text-[10px] font-bold leading-none">New Food</span>
        </a>
        <!-- Settings -->
        <a href="/settings" class="flex-1 h-full flex flex-col items-center justify-center transition-colors {page.url.pathname === '/settings' ? 'text-primary-400' : 'text-muted hover:text-content'}">
            <span class="text-xl leading-none mb-1">⚙️</span>
            <span class="text-[10px] font-bold leading-none">Settings</span>
        </a>
    </div>
</nav>
