<script>
    import {redirectToAuthCodeFlow, newAccessToken, getAccessToken, logout} from "$lib/spotify/auth.js";
    import {onMount} from "svelte";
    import axios from "axios";
    import { Input } from "$lib/components/ui/input/index.js"
    import { Switch } from "$lib/components/ui/switch/index.js"
    import { Button } from "$lib/components/ui/button/index.js"
    import { Progress } from "$lib/components/ui/progress/index.js"
    import {AudioLines, CirclePause, CirclePlay, Menu, RadioTower, Search, SkipBack, SkipForward} from 'lucide-svelte';
    import {Label} from '$lib/components/ui/label/index.js';
    import {Skeleton} from '$lib/components/ui/skeleton/index.js';
    import {AspectRatio} from '$lib/components/ui/aspect-ratio/index.js';

    const clientID = 'eed7eaff183d4604b08e9de07393fbdd';

    let player;

    let paused;

    let nowPlayingImageUrl;
    let nowPlayingObject;
    let nowPlayingImageColor;
    let nowPlayingPosition;
    let nowPlayingLength;


    onMount(() => {
        const fac = new FastAverageColor();

        window.onSpotifyWebPlaybackSDKReady = async function () {
            const authCode = new URLSearchParams(window.location.search).get(
                "code"
            );
            if (authCode) {
                await newAccessToken(clientID, authCode);
                window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
            }

            player = new Spotify.Player({
                name: 'SoundSphere',
                getOAuthToken: cb => {
                    cb(getAccessToken(clientID));
                },
                volume: 0.5
            });

            player.connect()

            const spotifyApiSearch = async (query, type) => {
                return await axios.get("https://api.spotify.com/v1/search", {
                    headers: {
                        Authorization: `Bearer ${getAccessToken(clientID)}`
                    },
                    params: {
                        q: query,
                        type: type
                    }
                })
            }

            /*
            spotifyApiSearch("keine ahnung", "track").then(result => {
                result.data.tracks.items.forEach(track => {
                    console.log("Track Name:", track.name);
                    console.log("Artist(s):", track.artists.map(artist => artist.name).join(", "));
                    console.log("Duration:", Math.floor((track.duration_ms/1000/60) << 0) + ":" + Math.floor((track.duration_ms/1000) % 60) + " min");
                    console.log("Explicit:", track.explicit ? "Yes" : "No");
                    console.log("------------------------------------------");
                })
            })
             */

            setInterval(() => nowPlayingPosition += paused ? 0 : 300, 300);

            player.addListener('player_state_changed', (r) => {
                nowPlayingObject = r.track_window.current_track;
                nowPlayingImageUrl = nowPlayingObject.album.images[2].url;
                fac.getColorAsync(nowPlayingImageUrl).then(res => nowPlayingImageColor = res.hex);
                paused = r.paused;
                nowPlayingPosition = r.position;
                nowPlayingLength = r.duration;
            });

            player.addListener('ready', ({ device_id }) => {
                axios.put("https://api.spotify.com/v1/me/player",
                    {
                        "device_ids": [device_id]
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${getAccessToken(clientID)}`,
                            'Content-Type': 'application/json',
                        }
                    }
                )
            });

        }
    })
</script>

<main style={`background: linear-gradient(0deg, #171313 0%, ${nowPlayingImageColor || '#181414'} 100%);`} class="h-screen grid grid-cols-11 grid-rows-12">
    <div class="flex justify-center items-center row-start-1 row-end-3  col-start-0 col-end-2">
        <Button class="bg-transparent hover:bg-transparent hover:text-gray-400 active:text-[#181414]"><Menu size="32"/></Button>
    </div>
    <div class="flex justify-center items-center row-start-1 row-end-3  col-start-3 col-end-10">
        <Input class="h-[24px]" placeholder="Search" type="text"><Search color="#74747a"/></Input>
    </div>
    <div class="flex justify-center items-center row-start-1 row-end-3  col-start-10 col-end-12">
        <Label for="spotifyRadioToggle"><RadioTower color={`${nowPlayingImageColor === undefined ? '#74747a' : '#181414'}`}/></Label>
        <Switch style={`background-color: ${nowPlayingImageColor === undefined ? '#74747a' : '#181414'}`} class="m-3" id="spotifyRadioToggle"></Switch>
        <Label for="spotifyRadioToggle"><AudioLines color={`${nowPlayingImageColor === undefined ? '#74747a' : '#181414'}`}/></Label>
    </div>
    <div class="flex justify-center items-center row-start-3 row-end-9 col-start-5 col-end-8">
        <AspectRatio ratio={1}>
            <img id="nowPlayingImage" src={nowPlayingImageUrl} alt="nowPlayingImage">
        </AspectRatio>
    </div>
    <div class="col-start-3 col-end-10 row-start-9 row-end-11 lg:pt-7">
        {#if nowPlayingObject}
            <h3 class="text-2xl text-white p-0">{nowPlayingObject.name}</h3>
            <h4 class="text-xl text-gray-400 p-0">{nowPlayingObject.artists.map(artist => artist.name).join(', ')}</h4>
        {/if}
    </div>
    <div class="flex justify-center items-center col-start-3 col-end-10 row-start-10">
        <Progress value={nowPlayingPosition} max={nowPlayingLength} id="progress" class="h-2"></Progress>
    </div>
    <div class="flex items-end  col-start-3 col-end-4 row-start-10">
        <p class="text-gray-400">{Math.floor((nowPlayingPosition/1000/60) << 0) + ":" + String(Math.floor((nowPlayingPosition/1000) % 60)).padStart(2, '0')}</p>
    </div>
    <div class="flex justify-end items-end col-start-9 col-end-10 row-start-10">
        <p class="text-gray-400">{"-" + Math.floor(((nowPlayingLength-nowPlayingPosition)/1000/60) << 0) + ":" + String(Math.floor(((nowPlayingLength-nowPlayingPosition)/1000) % 60)).padStart(2, '0')}</p>
    </div>
    <div class="flex justify-center items-center col-start-5 col-end-8 row-start-11">
        <Button on:click={() => player.previousTrack()} class="bg-transparent hover:bg-transparent hover:text-gray-400 active:text-[#181414]"><SkipBack size="48"/></Button>
        <Button on:click={() => {if(paused === undefined) player.activateElement(); else player.togglePlay()}} class="bg-transparent hover:bg-transparent hover:text-gray-400 active:text-[#181414]">
            {#if paused} <CirclePlay size="48"/>
                {:else} <CirclePause size="48"/>
            {/if}
        </Button>
        <Button on:click={() => player.nextTrack()} class="bg-transparent hover:bg-transparent hover:text-gray-400 active:text-[#181414]"><SkipForward size="48"/></Button>
    </div>
</main>

