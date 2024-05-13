<script>
    import SpotifyPlayer from "$lib/components/spotify/SpotifyPlayer.svelte";
    import RadioPlayer from '$lib/components/radio/RadioPlayer.svelte';
    import {onMount} from 'svelte';
    import {isSpotify, isSpotifySdkReady} from '$lib/stores/stores.js';
    import {fly} from "svelte/transition";

    onMount(() => {
        window.onSpotifyWebPlaybackSDKReady = () => {isSpotifySdkReady.set(true)}
        let storageValue = localStorage.getItem('isSpotify') || false;
        isSpotify.set(storageValue === 'true');
    })
</script>

<svelte:head>
    <script src="https://sdk.scdn.co/spotify-player.js"></script>
    <script src="https://unpkg.com/fast-average-color/dist/index.browser.min.js"></script>
    <title>SoundSphere</title>
</svelte:head>

<div class="bg-[#121212]">
    {#if $isSpotify}
        <div in:fly={{duration: 100, x: -1920, delay: 100}} out:fly={{duration: 100, x: -1920}}>
            <SpotifyPlayer/>
        </div>
    {:else}
        <div in:fly={{duration: 100, x: 1920, delay: 100}} out:fly={{duration: 100, x: 1920}}>
            <RadioPlayer></RadioPlayer>
        </div>
    {/if}
</div>