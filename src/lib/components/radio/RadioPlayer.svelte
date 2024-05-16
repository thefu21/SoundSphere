<script>
    import {isSpotify} from '$lib/stores/stores.js';
    import {Input} from '$lib/components/ui/input/index.js';
    import {Switch} from '$lib/components/ui/switch/index.js';
    import {Button} from '$lib/components/ui/button/index.js';
    import {Label} from '$lib/components/ui/label/index.js';
    import {Skeleton} from '$lib/components/ui/skeleton/index.js';
    import {AspectRatio} from '$lib/components/ui/aspect-ratio/index.js';
    import {AudioLines, CirclePause, CirclePlay, RadioTower, Search} from 'lucide-svelte';
    import SearchBar from '$lib/components/radio/SearchBar.svelte';
    import {blur, slide} from 'svelte/transition';
    import {onDestroy, onMount} from 'svelte';
    import {FastAverageColor} from "fast-average-color";
    import axios from 'axios';
    import {get_radiobrowser_base_url_random} from '$lib/radio/radio-browser.js';

    let audio;
    let playing = false;
    let loading = true;
    let fac;
    let radioUrl

    let searchResult = null;
    let input = '';
    let nowPlayingImageColor;
    let nowPlayingImageUrl;
    let nowPlayingObject;


    onDestroy(() => {
        if (audio) {
            stopPlayback();
        }
    });

    onMount(async () => {
        setTimeout(() => {loading = false;}, 500)
        radioUrl = await get_radiobrowser_base_url_random();

        fac = new FastAverageColor();
        try {
            let radio = JSON.parse(localStorage.getItem('radio'));
            playRadio(radio);
        }
        catch (e) {}

        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                input = '';
                searchResult = null;
            }
        });
    })

    const playToggle = () => {
        if (playing && audio !== undefined) {
            stopPlayback();
            playing = false;
        }
        else {
            audio.play();
            playing = true;
        }
    }

    const playRadio = async (object) => {
        nowPlayingImageColor = undefined;
        nowPlayingImageUrl = object.favicon;
        nowPlayingObject = object;
        fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(nowPlayingImageUrl)}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                fac.getColorAsync(data.contents).then(res => nowPlayingImageColor = res.hex);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        stopPlayback();
        audio = new Audio(object.url_resolved);
        searchResult = null;
        input = '';
        await audio.play();
        playing = true;
        localStorage.setItem('radio',JSON.stringify(object));

    }

    const getSearchResult = async () => {
        if (input === "") {
            searchResult = null;
        }
        else {
            try {
                const response = await axios.get(`${radioUrl}/json/stations/search`, {
                    params: {
                        name: input,
                        limit: 20,
                        lastcheckok: 1
                    }
                });
                searchResult = response.data;
            } catch (error) {
                console.error('Fehler beim Abrufen der Senderdaten:', error.message);
            }
        }
    }

    function stopPlayback() {
        if (audio) {
            audio.pause();
            playing = false;
        }
    }
</script>

<main style={`background: linear-gradient(0deg, #171313 0%, ${nowPlayingImageColor || '#121212'} 100%);`} class="h-screen grid grid-cols-11 grid-rows-12">
    {#if loading}
        <div class="flex justify-center items-center row-start-1 row-end-3  col-start-3 col-end-10">
            <Skeleton class="h-[24px] w-full"></Skeleton>
        </div>
        <div class="flex justify-center items-center row-start-6 row-end-7 col-start-5 col-end-8">
            <AspectRatio ratio={1}>
                <Skeleton class="h-full w-full"></Skeleton>
            </AspectRatio>
        </div>
        <div class="col-start-3 col-end-10 row-start-9 row-end-11 lg:pt-7 ">
            <Skeleton class="h-16 w-60"></Skeleton>
        </div>
        <div id="progress" class="flex justify-center items-center col-start-3 col-end-10 row-start-10">
            <Skeleton class="h-2 w-full"></Skeleton>
        </div>
        <div class="flex justify-center items-center col-start-5 col-end-8 row-start-11">
            <Skeleton class="h-full w-1/2"></Skeleton>
        </div>
    {:else}
        <div class="flex justify-center items-center row-start-1 row-end-3  col-start-3 col-end-10">
            <Input bind:value={input} on:input={getSearchResult} class="h-[24px]" placeholder="Search"
                   type="text">
                <Search color="#74747a"/>
            </Input>
        </div>
        <div class="flex justify-center items-center row-start-1 row-end-3  col-start-10 col-end-12">
            <Label for="spotifyRadioToggle">
                <RadioTower color={`${nowPlayingImageColor === undefined ? '#74747a' : '#121212'}`}/>
            </Label>
            <Switch on:click={() => {
                localStorage.setItem('isSpotify', 'true');
                isSpotify.set(true);
            }} class="m-3" id="spotifyRadioToggle"></Switch>
            <Label for="spotifyRadioToggle">
                <AudioLines color={`${nowPlayingImageColor === undefined ? '#74747a' : '#121212'}`}/>
            </Label>
        </div>
        {#if searchResult !== null}
            <div in:slide={{duration: 250, delay: 50}} out:slide={{duration: 250}}
                 class="row-start-3 row-end-12 col-start-3 col-end-10">
                <SearchBar callbackPlayRadio={(url, imgUrl, ) => playRadio(url, imgUrl)} color={nowPlayingImageColor} radioArray={searchResult}></SearchBar>
            </div>
        {:else}
            <div in:blur={{duration: 50, delay: 250}} out:blur={{duration: 50}}
                 class="flex justify-center items-center row-start-4 row-end-9 col-start-5 col-end-8">
                <AspectRatio ratio={1}>
                    {#if nowPlayingImageUrl}
                        <img id="nowPlayingImage" class="w-full h-full" src={nowPlayingImageUrl} alt="nowPlayingImage">
                        {:else}
                        <div class="bg-background w-full h-full rounded flex justify-center items-center">
                            <h3 class="text-xl">No image found</h3>
                        </div>
                    {/if}
                </AspectRatio>
            </div>
            <div class="flex justify-center items-center col-start-5 col-end-8 row-start-11">
                <Button on:click={playToggle}
                        class="bg-transparent hover:bg-transparent hover:text-gray-400 active:text-[#121212]">
                    {#if !playing}
                        <CirclePlay size="48"/>
                    {:else}
                        <CirclePause size="48"/>
                    {/if}
                </Button>
            </div>
            <div class="col-start-3 col-end-10 row-start-9 row-end-11 lg:pt-7">
                {#if nowPlayingObject !== undefined}
                    <h3 class="text-2xl text-white p-0">{nowPlayingObject.name}</h3>
                    <h4 class="text-xl text-gray-400 p-0">{nowPlayingObject.country}</h4>
                {/if}
            </div>
        {/if}
    {/if}
</main>