<script>
import {Button} from '$lib/components/ui/button/index.js';
import {Menu} from 'lucide-svelte';
import * as Sheet from "$lib/components/ui/sheet";
import {logout} from '$lib/spotify/auth.js';
import logo from '$lib/components/spotify/logo/Spotify_Logo_RGB_Black.png'
</script>

<Sheet.Root>
    <Sheet.Trigger><Button class="bg-transparent hover:bg-transparent hover:text-gray-400 active:text-[#181414]"><Menu size="32"/></Button></Sheet.Trigger>
    <Sheet.Content side="left">
        <Sheet.Title>Settings</Sheet.Title>
        <div class="flex flex-col h-full p-5">
            <div class="flex-grow"></div>
            <div class="mt-auto flex flex-col items-end gap-3">
                <a class="w-[50%] self-center" href="https://spotify.com"><img alt="Spotify Logo" src={logo}></a>
                <Button class="w-full" on:click={logout}>Logout</Button>
            </div>
        </div>
    </Sheet.Content>
</Sheet.Root>