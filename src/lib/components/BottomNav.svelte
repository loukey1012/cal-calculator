<script lang="ts">
    import { page } from '$app/state';
</script>

<nav class="fixed left-0 right-0 z-40 w-full bg-base border-t border-border pb-[env(safe-area-inset-bottom)] -translate-y-full" style="top: 100vh; top: 100lvh;">
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
