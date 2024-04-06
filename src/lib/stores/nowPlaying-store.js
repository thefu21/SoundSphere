import { writable } from 'svelte/store';

export const nowPlaying = writable({ name: "OE1", imgUrl: "https://oe1.orf.at/static/img/logo_oe1.png", source: "radio" });