<script>
    import {redirectToAuthCodeFlow, newAccessToken, getAccessToken, logout} from "$lib/spotify/auth.js";
    import {onMount} from "svelte";
    import axios from "axios";
    import { Input } from "$lib/components/ui/input/index.js"
    import {Search} from 'lucide-svelte';


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

            const token = getAccessToken(clientID);

            const player = new Spotify.Player({
                name: 'SoundSphere',
                getOAuthToken: cb => {
                    cb(token);
                },
                volume: 0.5
            });

            player.connect()

            const spotifyApiSearch = async (query, type) => {
                return await axios.get("https://api.spotify.com/v1/search", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        q: query,
                        type: type
                    }
                })
            }

            spotifyApiSearch("keine ahnung", "track").then(result => {
                result.data.tracks.items.forEach(track => {
                    console.log("Track Name:", track.name);
                    console.log("Artist(s):", track.artists.map(artist => artist.name).join(", "));
                    console.log("Duration:", Math.floor((track.duration_ms/1000/60) << 0) + ":" + Math.floor((track.duration_ms/1000) % 60) + " min");
                    console.log("Explicit:", track.explicit ? "Yes" : "No");
                    console.log("------------------------------------------");
                })
            })
        }
    })




</script>

<main>
    <Input></Input>
</main>