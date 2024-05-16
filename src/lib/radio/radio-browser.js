import axios from 'axios';

export function get_radiobrowser_base_urls() {
    return axios.get('https://api.allorigins.win/get?url=http://all.api.radio-browser.info/json/servers')
        .then(response => {
            const data = JSON.parse(response.data.contents).map(item => `https://${item.name}`);
            return data;
        })
        .catch(error => {
            console.error('Fehler beim Abrufen der Radio-Server:', error.message);
            throw error;
        });
}

export function get_radiobrowser_base_url_random() {
    return get_radiobrowser_base_urls().then(hosts => {
        var item = hosts[Math.floor(Math.random() * hosts.length)];
        return item;
    });
}