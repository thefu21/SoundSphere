import {writable} from 'svelte/store';

export const isSpotify = writable(true)
export const isSpotifySdkReady = writable(false);