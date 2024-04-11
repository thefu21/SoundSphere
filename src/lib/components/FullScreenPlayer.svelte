<script>
    import { nowPlaying } from '$lib/stores/stores.js';
</script>

<main class="h-screen grid grid-cols-9 grid-rows-12 bg-gray-900">
    <div class="flex justify-center items-center row-start-2 row-end-8  col-start-1 col-end-10">
        <img src={$nowPlaying.imgUrl} alt="Now playing cover" class="h-full"/>
    </div>
    <div class="flex justify-center items-center col-start-4 col-end-7 row-start-9">
        <p>{$nowPlaying.name}</p>
    </div>
    <div class="flex justify-center items-center col-start-5 row-start-11">
        <button>play/pause</button>
    </div>
    <div class="flex justify-center items-center col-start-3 col-end-8 row-start-10">
        <input value="10" class="h-1 w-full" type="range" disabled/>
    </div>
</main>