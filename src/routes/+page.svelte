<script>
    import SpotifyPlayer from "$lib/components/spotify/SpotifyPlayer.svelte";
    import RadioPlayer from '$lib/components/radio/RadioPlayer.svelte';
    import {onMount} from 'svelte';
    import {isSpotify, isSpotifySdkReady} from '$lib/stores/stores.js';

    onMount(() => {
        isSpotify;
        window.onSpotifyWebPlaybackSDKReady = () => {isSpotifySdkReady.set(true)}
    })
</script>

<svelte:head>
    <script src="https://sdk.scdn.co/spotify-player.js"></script>
    <script src="https://unpkg.com/fast-average-color/dist/index.browser.min.js"></script>
    <title>SoundSphere</title>
</svelte:head>

{#if $isSpotify}
    <SpotifyPlayer/>
    {:else}
    <RadioPlayer></RadioPlayer>
{/if}