<script>
    import {onMount} from "svelte";
    import axios from "axios";

    let searchValue;

    const searchArtists = async (e) => {
        e.preventDefault()
        console.log(await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchValue,
                type: "track"
            }
        }))
    }

    const playTrack = async () => {
        try {
            await axios.put("https://api.spotify.com/v1/me/player/play",
                { uris: ['https://api.spotify.com/v1/tracks/1OOtq8tRnDM8kG2gqUPjAj'] },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log("Track is now playing!");
        } catch (error) {
            console.error("Error playing track:", error);
            // Handle error
        }
    };


    onMount(() => {
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new Spotify.Player({
                name: 'Web Playback SDK Quick Start Player',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            player.connect()
        }
    })
</script>

<svelte:head>
    <script src="https://sdk.scdn.co/spotify-player.js"></script>
</svelte:head>


<main class="">
    <input bind:value={searchValue} type="text">
    <p>ds</p>
    <button class="bg-green-600" on:click={() => {playTrack(searchValue)}}>hallo</button>
    <button id="togglePlay">Toggle Play</button>
</main>