import axios from "axios";
import {getAccessToken} from "$lib/spotify/auth.js";

export const spotifyApiSearch = async (query, type, clientID) => {
    return await axios.get("https://api.spotify.com/v1/search", {
        headers: {
            Authorization: `Bearer ${getAccessToken(clientID)}`
        },
        params: {
            q: query,
            type: type
        }
    })
}

export function findLargestImageIndex(arr) {
    return arr
        .map((o) => o.height)
        .indexOf(Math.max(...arr.map((o) => o.height)));
}