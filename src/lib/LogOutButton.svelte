<script>
    import { BACKEND_URL } from './BackendURL';
	import { Button } from './components/ui/button';
    
    function logout() {
        window.location.href = `${BACKEND_URL}/logout`;
    }
</script>

<Button on:click={logout} variant="secondary">
    Log out
</Button>
