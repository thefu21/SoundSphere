<!-- RadioPlayer.svelte -->

<script>
    import { RadioBrowserApi } from 'radio-browser-api';

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

<button on:click={playOE1}>Play OE1</button>
<button on:click={stopPlayback}>Stop</button>
