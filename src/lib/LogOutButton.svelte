<script>
    import { BACKEND_URL } from './BackendURL';
    
    function logout() {
        window.location.href = `${BACKEND_URL}/logout`;
    }
</script>

<button on:click={logout} class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 ml-4 border border-gray-300">
    Log out
</button>