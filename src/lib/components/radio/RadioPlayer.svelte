<!-- RadioPlayer.svelte -->

<script>
    import { RadioBrowserApi } from 'radio-browser-api';
    import {isSpotify} from '$lib/stores/stores.js'
    import { Input } from "$lib/components/ui/input/index.js"
    import { Switch } from "$lib/components/ui/switch/index.js"
    import { Button } from "$lib/components/ui/button/index.js"
    import { Progress } from "$lib/components/ui/progress/index.js"
    import {Label} from '$lib/components/ui/label/index.js';
    import {Skeleton} from '$lib/components/ui/skeleton/index.js';
    import {AspectRatio} from '$lib/components/ui/aspect-ratio/index.js';
    import {AudioLines, CirclePause, CirclePlay, Menu, RadioTower, Search, SkipBack, SkipForward} from 'lucide-svelte';

    let audio;
    let playing = false;

    async function playOE1() {
        if (!playing) {
            const api = new RadioBrowserApi('My Radio App');

            try {
                // Suche nach Radiosendern mit dem Namen "oe1" oder dem Tag "oe1"
                const stations = await api.searchStations({ name: 'oe1' });
                console.log(stations)

                // Wähle den OE1-Radiosender aus der Antwort aus
                const oe1Station = stations.find(station => station.name.toLowerCase().includes('oe1'));

                // Überprüfe, ob OE1 gefunden wurde
                if (oe1Station) {
                    // Verwende die "urlResolved"-Eigenschaft des OE1-Radiosenders zum Abspielen
                    const streamUrl = oe1Station.urlResolved;

                    console.log(oe1Station)

                    // Erstelle ein Audio-Element und spiele OE1 ab
                    audio = new Audio('https://orf-live.ors-shoutcast.at/oe1-q2a');
                    await audio.play();
                    playing = true;
                } else {
                    console.error('OE1 konnte nicht gefunden werden.');
                }
            } catch (error) {
                console.error('Fehler beim Abrufen von OE1:', error);
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

<main class="h-screen grid grid-cols-11 grid-rows-12">
    <div class="flex justify-center items-center row-start-1 row-end-3  col-start-0 col-end-2">
        <Button class="bg-transparent hover:bg-transparent hover:text-gray-400 active:text-[#181414]"><Menu size="32"/></Button>
    </div>
    <div class="flex justify-center items-center row-start-1 row-end-3  col-start-3 col-end-10">
        <Input class="h-[24px]" placeholder="Search" type="text"><Search color="#74747a"/></Input>
    </div>
    <div class="flex justify-center items-center row-start-1 row-end-3  col-start-10 col-end-12">
        <Label for="spotifyRadioToggle"><RadioTower/></Label>
        <Switch on:click={() => isSpotify.set(true)} class="m-3" id="spotifyRadioToggle"></Switch>
        <Label for="spotifyRadioToggle"><AudioLines/></Label>
    </div>
    <div class="flex justify-center items-center row-start-3 row-end-9 col-start-5 col-end-8">
        <AspectRatio ratio={1}>
            <img id="nowPlayingImage" src="" alt="nowPlayingImage">
        </AspectRatio>
    </div>
    <div class="col-start-3 col-end-10 row-start-9 row-end-11 lg:pt-7">
        {#if true}
            <h3 class="text-2xl text-white p-0">Title</h3>
            <h4 class="text-xl text-gray-400 p-0">Artist</h4>
        {/if}
    </div>
    <div class="flex justify-center items-center col-start-3 col-end-10 row-start-10">
        <Progress id="progress" class="h-2"></Progress>
    </div>
    <div class="flex items-end  col-start-3 col-end-4 row-start-10">
        <p class="text-gray-400"></p>
    </div>
    <div class="flex justify-end items-end col-start-9 col-end-10 row-start-10">
        <p class="text-gray-400"></p>
    </div>
    <div class="flex justify-center items-center col-start-5 col-end-8 row-start-11">
        <Button class="bg-transparent hover:bg-transparent hover:text-gray-400 active:text-[#181414]"><SkipBack size="48"/></Button>
        <Button class="bg-transparent hover:bg-transparent hover:text-gray-400 active:text-[#181414]">
        </Button>
        <Button class="bg-transparent hover:bg-transparent hover:text-gray-400 active:text-[#181414]"><SkipForward size="48"/></Button>
    </div>
</main>
