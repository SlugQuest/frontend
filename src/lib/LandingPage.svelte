<script>
    const BACKEND_URL = 'http://your-backend-url.com';

    const redirectToLogin = () => {
        window.location.href = `${BACKEND_URL}/login`;
    };
</script>

<div class="flex items-center justify-center h-screen">
    <div class="w-64">
        <h1 class="text-2xl font-bold mb-4">Welcome</h1>
        <button on:click={redirectToLogin} class="w-full px-4 py-2 bg-blue-600 text-white rounded-md">Log in</button>
    </div>
</div>