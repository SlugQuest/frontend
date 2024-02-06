<script>
    const BACKEND_URL = 'http://localhost:8080';

    let isLoggedIn = false;
    
    function login() {
    // Make a GET request to the /login endpoint
    fetch(`${BACKEND_URL}/login`, { })
        .then(response => {
            if (response.type === 'opaqueredirect') {
                window.location.href = response.url;
            }
        })
        .catch(error => console.error('Error:', error));
}
    
    function logout() {
        // Make an API call to log out the user
        // Update isLoggedIn based on the response
        fetch('/api/logout', { })
            .then(() => {
                isLoggedIn = false;
            })
            .catch(error => console.error('Error:', error));
    }
    </script>
    
    <style>
    .button {
        border: 2px solid black;
        padding: 10px;
        cursor: pointer;
    }
    </style>
    
    {#if isLoggedIn}
        <button class="button" on:click={logout}>Log Out</button>
    {:else}
        <button class="button" on:click={login}>Log In</button>
    {/if}