<script>
    import { BACKEND_URL } from "./BackendURL";

    const redirectToLogin = () => {
        window.location.href = `${BACKEND_URL}/login`;
    };
</script>

<div class="flex items-center justify-center h-screen">
    <div class="w-64 text-center">
        <h1 class="text-4xl font-bold mb-2">SlugQuest</h1>
        <h2 class="text-2xl font-bold mb-4">Welcome</h2>
        <button on:click={redirectToLogin} class="w-1/2 px-4 py-2 bg-blue-600 text-white rounded-md mx-auto">Log in</button>
    </div>
</div>