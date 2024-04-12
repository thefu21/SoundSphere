<script>
    import {redirectToAuthCodeFlow, newAccessToken, getAccessToken, logout} from "$lib/spotify/auth.js";
    import {onMount} from "svelte";

    const clientID = 'eed7eaff183d4604b08e9de07393fbdd';

    onMount(() => {
        window.onSpotifyWebPlaybackSDKReady = async function () {
            const authCode = new URLSearchParams(window.location.search).get(
                "code"
            );
            if (authCode) {
                await newAccessToken(clientID, authCode);
                window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
            }
        }
    })
</script>

<main>
    <button class="bg-green-600" on:click={() => {redirectToAuthCodeFlow(clientID)}}>hallo</button>
    <button on:click={logout}>logout</button>
</main>