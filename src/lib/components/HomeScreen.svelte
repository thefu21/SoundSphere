<script>
    import {redirectToAuthCodeFlow, newAccessToken, getAccessToken, logout} from "$lib/spotify/auth.js";
    import {onMount} from "svelte";
    import axios from "axios";
    import { Input } from "$lib/components/ui/input/index.js"
    import { Switch } from "$lib/components/ui/switch/index.js"
    import { Button } from "$lib/components/ui/button/index.js"
    import { Progress } from "$lib/components/ui/progress/index.js"
    import {AudioLines, CirclePause, RadioTower, Search, SkipBack, SkipForward} from 'lucide-svelte';
    import {Label} from '$lib/components/ui/label/index.js';
    import {Skeleton} from '$lib/components/ui/skeleton/index.js';
    import {AspectRatio} from '$lib/components/ui/aspect-ratio/index.js';


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

<main class="h-screen grid grid-cols-11 grid-rows-12 bg-gray-900">
    <div class="flex justify-center items-center row-start-1 row-end-3  col-start-3 col-end-10">
        <Input class="h-[24px]" placeholder="Search" type="text"><Search/></Input>
    </div>
    <div class="flex justify-center items-center row-start-1 row-end-3  col-start-10 col-end-12">
        <Label for="spotifyRadioToggle"><RadioTower color="#3e9392"/></Label>
        <Switch class="m-3" id="spotifyRadioToggle"></Switch>
        <Label for="spotifyRadioToggle"><AudioLines color="#3e9392"/></Label>
    </div>
    <div class="flex justify-center items-center row-start-3 row-end-9 col-start-5 col-end-8">
        <AspectRatio ratio={1}>
            <Skeleton class="w-full h-full"/>
        </AspectRatio>
    </div>
    <div class="col-start-3 col-end-10 row-start-9 leading-tight">
        <h3 class="text-2xl">Title</h3><br>
        <p class="text-xl">Artist</p>
    </div>
    <div class="flex justify-center items-center col-start-3 col-end-10 row-start-10">
        <Progress id="progress" class="h-2"></Progress>
    </div>
    <div class="flex justify-center items-center col-start-5 col-end-8 row-start-11">
        <Button class="bg-transparent hover:bg-transparent hover:text-gray-500 active:text-gray-800"><SkipBack size="48"/></Button>
        <Button class="bg-transparent hover:bg-transparent hover:text-gray-500 active:text-gray-800"><CirclePause size="48"/></Button>
        <Button class="bg-transparent hover:bg-transparent hover:text-gray-500 active:text-gray-800"><SkipForward size="48"/></Button>
    </div>
</main>