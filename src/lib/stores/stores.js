import {writable} from 'svelte/store';

export const isSpotify = writable()
export const isSpotifySdkReady = writable(false);