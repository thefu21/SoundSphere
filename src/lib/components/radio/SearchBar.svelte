<script>
    import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
    import { mixColorWithWhite } from '$lib';

    export let callbackPlayRadio;
    export let radioArray;
    export let color;
    let hover = null;

    $: sortedRadioArray = radioArray.slice().sort((a, b) => b.votes - a.votes);

    $: whiteColor = mixColorWithWhite(color || '#ffffff', 0.2);
    $: whiteColorsHover = mixColorWithWhite(color || '#74747a', 0.6);
</script>

<ScrollArea class="h-full w-full">
    {#each sortedRadioArray as searchResult, i}
        <div
                role="button"
                tabindex="0"
                on:keydown={(event) => {
                    if (event.key === "Enter" || event.key === "Space") {
                    callbackPlayRadio(searchResult.urlResolved, searchResult.favicon);
                    }
                }}
                on:mouseover={() => hover = i}
                on:mouseleave={() => hover = null}
                on:focus={() => hover = i}
                on:blur={() => hover = null}
                on:click={() => callbackPlayRadio(searchResult.urlResolved, searchResult.favicon)}
                class="bg-white rounded p-3 my-3 flex gap-3 h-36 w-full"
                style="background-color: {hover === i ? whiteColorsHover : whiteColor};"
        >
            {#if searchResult.favicon}
                <img class="max-h-full w-auto" alt="albumCover" src={searchResult.favicon}>
            {/if}
            <div>
                <h3 id={"songTitle" + i} class="text-xl text-[#171313]">{searchResult.name}</h3>
                <h4 class="text-l text-gray-500">{searchResult.country}</h4>
            </div>
        </div>
    {/each}
</ScrollArea>