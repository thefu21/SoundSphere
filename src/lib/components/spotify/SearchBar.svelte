<script>
    import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
    import { mixColorWithWhite } from '$lib';
    import {ListPlus} from 'lucide-svelte';

    export let callbackPlaySong;
    export let callbackAddToQueue;
    export let songArray;
    export let color;
    let hover = null;

    $: whiteColor = mixColorWithWhite(color || '#ffffff', 0.2);
    $: whiteColorsHover = mixColorWithWhite(color || '#74747a', 0.6);
</script>

<ScrollArea class="h-full w-full">
    {#each songArray as searchResult, i}
        <div
                role="button"
                tabindex="0"
                on:keydown={(event) => {
                    if (event.key === "Enter" || event.key === "Space") {
                    callbackPlaySong(searchResult.uri);
                    }
                }}
                on:mouseover={() => hover = i}
                on:mouseleave={() => hover = null}
                on:focus={() => hover = i}
                on:blur={() => hover = null}
                on:click={() => callbackPlaySong(searchResult.uri)}
                class="rounded p-3 my-3 flex gap-3 h-36 w-full"
                style="background-color: {hover === i ? whiteColorsHover : whiteColor};"
        >
            <img class="max-h-full w-auto" alt="albumCover" src={searchResult.album.images[0].url}>
            <div>
                <h3 id={"songTitle" + i} class="text-xl text-[#171313]">{searchResult.name}</h3>
                <h4 class="text-l text-gray-500">{searchResult.artists.map(artist => artist.name).join(', ')}</h4>
            </div>
            <p class="self-center ml-auto mr-5 text-gray-400 text-l">{Math.floor(((searchResult.duration_ms)/1000/60) << 0) + ":" + String(Math.floor(((searchResult.duration_ms)/1000) % 60)).padStart(2, '0')}</p>
            <button id="button" class="rounded bg-[#181414] w-20 h-10 self-center flex justify-center items-center hover:bg-[#2f2c2c] active:bg-[#bab9b9]" on:click|stopPropagation={() => {callbackAddToQueue(searchResult.uri)}}><ListPlus color={whiteColor}></ListPlus></button>
        </div>
    {/each}
</ScrollArea>