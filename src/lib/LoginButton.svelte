<script>
    const BACKEND_URL = 'http://localhost:8080';
    
    function login() {
        // Redirect to the /login endpoint which then redirects to Auth0
        window.location.href = `${BACKEND_URL}/login`;
    }
    
    function logout() {
        window.location.href = `${BACKEND_URL}/logout`;
    }
    </script>
    
    <style>
    .button {
        border: 2px solid black;
        padding: 10px;
        cursor: pointer;
    }
    </style>
    
    <button class="button" on:click={logout}>Log Out</button>