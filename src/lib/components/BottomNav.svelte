<script lang="ts">
    import { page } from '$app/state';
</script>

<nav class="fixed bottom-0 left-0 right-0 z-40 w-full bg-gray-900 border-t border-gray-800 pb-[env(safe-area-inset-bottom)]">
    <div class="flex justify-between items-center max-w-md mx-auto h-16">
        <!-- Home -->
        <a href="/" class="flex-1 h-full flex flex-col items-center justify-center transition-colors {page.url.pathname === '/' ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-400'}">
            <span class="text-xl leading-none mb-1">🍽️</span>
            <span class="text-[10px] font-bold leading-none">Meal</span>
        </a>
        <!-- DB -->
        <a href="/database" class="flex-1 h-full flex flex-col items-center justify-center transition-colors {page.url.pathname === '/database' ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-400'}">
            <span class="text-xl leading-none mb-1">🍎</span>
            <span class="text-[10px] font-bold leading-none">Foods</span>
        </a>
        <!-- Custom -->
        <a href="/custom" class="flex-1 h-full flex flex-col items-center justify-center transition-colors {page.url.pathname === '/custom' ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-400'}">
            <span class="text-xl leading-none mb-1">⚖️</span>
            <span class="text-[10px] font-bold leading-none">Custom</span>
        </a>
        <!-- New -->
        <a href="/new" class="flex-1 h-full flex flex-col items-center justify-center transition-colors {page.url.pathname === '/new' ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-400'}">
            <span class="text-xl leading-none mb-1">➕</span>
            <span class="text-[10px] font-bold leading-none">New Food</span>
        </a>
        <!-- Settings -->
        <a href="/settings" class="flex-1 h-full flex flex-col items-center justify-center transition-colors {page.url.pathname === '/settings' ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-400'}">
            <span class="text-xl leading-none mb-1">⚙️</span>
            <span class="text-[10px] font-bold leading-none">Settings</span>
        </a>
    </div>
</nav>
