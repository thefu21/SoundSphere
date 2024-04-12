export function getAccessToken(clientID) {
    if (localStorage.getItem('spotifyAccessToken') === undefined || localStorage.getItem('spotifyRefreshToken') === undefined) {
        return false
    }
    let spotifyExpiryTime = localStorage.getItem('spotifyExpiryTime')
    let spotifyTokenGenerationTime = localStorage.getItem('spotifyTokenGenerationTime')
    let currentTime = Date.now()
    if ((currentTime - spotifyTokenGenerationTime) > spotifyExpiryTime * 1000) {
        let body = new URLSearchParams()
        body.append("grant_type", "refresh_token")
        body.append("refresh_token", localStorage.getItem('spotifyRefreshToken'))
        body.append("client_id", clientID);

        fetch(`https://accounts.spotify.com/api/token`, {
            method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}, body: body
        }).then(response => {
            if (!response.ok) {
                throw('Error refreshing token');
            }
            return response.json();
        }).then(data => {
            localStorage.setItem('spotifyExpiryTime', data.expires_in)
            localStorage.setItem("spotifyTokenGenerationTime", Date.now())
            localStorage.setItem('spotifyAccessToken', data.access_token);
            localStorage.setItem('spotifyRefreshToken', data.refresh_token);
            console.log('Regeneration of access token complete');
        })
    }
    return localStorage.getItem('spotifyAccessToken')

}

export async function redirectToAuthCodeFlow(clientID) {
    const spotifyVerifier = generateCodeVerifier(128)
    const challenge = await generateCodeChallenge(spotifyVerifier)

    localStorage.setItem("spotifyVerifier", spotifyVerifier)

    const params = new URLSearchParams()
    params.append("client_id", clientID)
    params.append("response_type", "code")
    params.append("redirect_uri", window.location.href.split(/[?#]/)[0])
    params.append("scope", "user-read-playback-state user-modify-playback-state user-read-currently-playing streaming user-read-playback-position")
    params.append("code_challenge_method", "S256")
    params.append("code_challenge", challenge)
    console.log(`https://accounts.spotify.com/authorize?${params.toString()}`)
    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`
}

export async function newAccessToken(clientID, code) {
    const spotifyVerifier = localStorage.getItem("spotifyVerifier")

    const params = new URLSearchParams()
    params.append("client_id", clientID)
    params.append("grant_type", "authorization_code")
    params.append("code", code)
    params.append("redirect_uri", window.location.href.split(/[?#]/)[0])
    params.append("code_verifier", spotifyVerifier)
    await fetch("https://accounts.spotify.com/api/token", {
        method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}, body: params
    }).then(response => {
        if (!response.ok) {
            console.log('HTTP status ' + response.status);
        }
        return response.json();
    })
        .then(data => {
            localStorage.setItem('spotifyExpiryTime', data.expires_in)
            localStorage.setItem("spotifyTokenGenerationTime", Date.now().toString())
            localStorage.setItem('spotifyAccessToken', data.access_token);
            localStorage.setItem('spotifyRefreshToken', data.refresh_token);
            return true
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export const logout = () => {
    localStorage.removeItem('spotifyExpiryTime')
    localStorage.removeItem('spotifyAccessToken')
    localStorage.removeItem('spotifyRefreshToken')
    localStorage.removeItem('spotifyTokenGenerationTime')
    localStorage.removeItem('spotifyVerifier')

    console.log('logout complete')
    location.reload()
}


const generateCodeVerifier = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier)
    const digest = await window.crypto.subtle.digest("SHA-256", data)
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}
