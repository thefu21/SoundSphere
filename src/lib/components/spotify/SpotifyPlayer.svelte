<script>
    import {newAccessToken, getAccessToken, logout, redirectToAuthCodeFlow} from "$lib/spotify/auth.js";
    import {onMount} from 'svelte';
    import axios from "axios";
    import {AudioLines, CirclePause, CirclePlay, Menu, RadioTower, Search, SkipBack, SkipForward} from 'lucide-svelte';
    import { Input } from "$lib/components/ui/input/index.js"
    import { Switch } from "$lib/components/ui/switch/index.js"
    import { Button } from "$lib/components/ui/button/index.js"
    import { Progress } from "$lib/components/ui/progress/index.js"
    import {Label} from '$lib/components/ui/label/index.js';
    import {Skeleton} from '$lib/components/ui/skeleton/index.js';
    import {AspectRatio} from '$lib/components/ui/aspect-ratio/index.js';
    import {spotifyApiSearch} from "$lib/spotify/playerApi.js";
    import {isSpotify, isSpotifySdkReady} from '$lib/stores/stores.js';
    import SearchBar from '$lib/components/spotify/SearchBar.svelte';
    import {mixColors} from '$lib';
    import SideMenu from '$lib/components/spotify/SideMenu.svelte';

    const clientID = 'eed7eaff183d4604b08e9de07393fbdd';

    let player;

    let paused;
    let input = "";
    let searchResult = null;
    let loggedIn = false;

    let nowPlayingImageColor;
    let nowPlayingImageUrl;
    let nowPlayingObject;

    let nowPlayingPosition;
    let nowPlayingLength;

    const addToQueue = (uri) => {
        const encodedUri = uri.replace(/:/g, '%3A'); // Ersetzt alle Doppelpunkte in der URI
        axios.post(
            `https://api.spotify.com/v1/me/player/queue?uri=${encodedUri}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${getAccessToken(clientID)}`,
                }
            }
        );
    }


    const playSong = (uri) => {
        axios.put("https://api.spotify.com/v1/me/player/play",
            {
                "uris": [uri]
            },
            {
                headers: {
                    Authorization: `Bearer ${getAccessToken(clientID)}`,
                    'Content-Type': 'application/json',
                }
            }
        );
        input = "";
        searchResult = null;
    }

    const updatePrimary = () => {
        if (nowPlayingImageColor !== undefined) {
            let mixcolor =  mixColors('#ffffff',nowPlayingImageColor,0.2,'hsl');
            document.documentElement.style.setProperty('--background', mixcolor);
        }
    }

    const getSearchElements = async () => {
        try {
            if (input !== "") {
                const response = await spotifyApiSearch(input, "track", clientID);
                if (input !== "") {
                    searchResult = response.data.tracks.items; // Return the items array
                }
                else {
                    searchResult = null;
                }
            }
            else {
                searchResult = null;
            }
        } catch (error) {
            console.error("Error occurred while fetching search results:", error);
            throw error; // Rethrow the error for the caller to handle
        }
    }

    onMount(() => {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                input = "";
                searchResult = null;
            }
        });
        const fac = new FastAverageColor();

        isSpotifySdkReady.subscribe(async () => {
            if ($isSpotifySdkReady) {
                const authCode = new URLSearchParams(window.location.search).get(
                    "code"
                );
                if (authCode) {
                    await newAccessToken(clientID, authCode);
                    window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
                }

                // noinspection JSUnresolvedReference
                player = new Spotify.Player({
                    name: 'SoundSphere',
                    getOAuthToken: cb => {
                        cb(getAccessToken(clientID));
                    },
                    volume: 0.5
                });

                if (localStorage.getItem('spotifyAccessToken') !== null) loggedIn = true;
                player.connect()

                setInterval(() => nowPlayingPosition += paused ? 0 : 300, 300);

                player.addListener('player_state_changed', (r) => {
                    nowPlayingObject = r.track_window.current_track;
                    nowPlayingImageUrl = nowPlayingObject.album.images[2].url;
                    fac.getColorAsync(nowPlayingImageUrl).then(res => nowPlayingImageColor = res.hex);
                    paused = r.paused;
                    nowPlayingPosition = r.position;
                    nowPlayingLength = r.duration;
                    updatePrimary();
                });

                player.addListener('ready', ({device_id}) => {
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
                    );
                });
            }

        })


        return () => {
            player.pause();
            return player.disconnect();
        }
    })
</script>



<main style={`background: linear-gradient(0deg, #171313 0%, ${nowPlayingImageColor || '#121212'} 100%);`} class="h-screen grid grid-cols-11 grid-rows-12">
    {#if loggedIn}
        <div class="flex justify-center items-center row-start-1 row-end-3  col-start-0 col-end-2">
            <SideMenu></SideMenu>
        </div>
        <div class="flex justify-center items-center row-start-1 row-end-3  col-start-3 col-end-10">
            <Input bind:value={input} on:input={getSearchElements} class="h-[24px]" placeholder="Search" type="text"><Search color="#74747a"/></Input>
        </div>
        <div class="flex justify-center items-center row-start-1 row-end-3  col-start-10 col-end-12">
            <Label for="spotifyRadioToggle"><RadioTower color={`${nowPlayingImageColor === undefined ? '#74747a' : '#121212'}`}/></Label>
            <Switch checked on:click={() => isSpotify.set(false)} class="m-3" id="spotifyRadioToggle"></Switch>
            <Label for="spotifyRadioToggle"><AudioLines color={`${nowPlayingImageColor === undefined ? '#74747a' : '#121212'}`}/></Label>
        </div>
        {#if searchResult !== null}
            <div class="row-start-3 row-end-12 col-start-3 col-end-10">
                <SearchBar callbackAddToQueue={(uri) => addToQueue(uri)} callbackPlaySong={(uri) => playSong(uri)} color={nowPlayingImageColor} songArray={searchResult}></SearchBar>
            </div>
        {:else}
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
            <div id="progress" class="flex justify-center items-center col-start-3 col-end-10 row-start-10">
                <Progress value={nowPlayingPosition} max={nowPlayingLength} id="progress" class="h-2"></Progress>
            </div>
            <div class="flex items-end  col-start-3 col-end-4 row-start-10">
                <p class="text-gray-400">{Math.floor((nowPlayingPosition/1000/60) << 0) + ":" + String(Math.floor((nowPlayingPosition/1000) % 60)).padStart(2, '0')}</p>
            </div>
            <div class="flex justify-end items-end col-start-9 col-end-10 row-start-10">
                <p class="text-gray-400">{"-" + Math.floor(((nowPlayingLength-nowPlayingPosition)/1000/60) << 0) + ":" + String(Math.floor(((nowPlayingLength-nowPlayingPosition)/1000) % 60)).padStart(2, '0')}</p>
            </div>
            <div class="flex justify-center items-center col-start-5 col-end-8 row-start-11">
                <Button on:click={() => player.previousTrack()} class="bg-transparent hover:bg-transparent hover:text-gray-400 active:text-[#121212]"><SkipBack size="48"/></Button>
                <Button on:click={() => {if(paused === undefined) player.activateElement(); else player.togglePlay()}} class="bg-transparent hover:bg-transparent hover:text-gray-400 active:text-[#121212]">
                    {#if paused} <CirclePlay size="48"/>
                    {:else} <CirclePause size="48"/>
                    {/if}
                </Button>
                <Button on:click={() => player.nextTrack()} class="bg-transparent hover:bg-transparent hover:text-gray-400 active:text-[#121212]"><SkipForward size="48"/></Button>
            </div>
        {/if}
        {:else}
        <div class="flex justify-center items-center col-start-1 col-end-12 row-start-1 row-end-13">
            <Button class="bg-[#1db954]" on:click={() => redirectToAuthCodeFlow(clientID)}>Login to Spotify</Button>
        </div>
    {/if}
</main>

