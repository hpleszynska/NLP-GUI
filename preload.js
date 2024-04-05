
const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld(
    'mapAPI', {
        createMap: () => {
            const map = require('leaflet').map('map').setView([23.81, 90.41], 13);
            require('leaflet').tileLayer('https://maptiles.p.rapidapi.com/en/map/v1/{z}/{x}/{y}.png?rapidapi-key=7e5aeb2275msha90e319f94992f7p1f5bd5jsnc459e6f67e97', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openptmap.org">OpenStreetMap</a> contributors'
            }).addTo(map);
            return map;
        }
    }
);

contextBridge.exposeInMainWorld('electron', {
    geocodePlace: async (placeName) => {
        console.log('Geocoding place:', placeName);
      try {
        return await ipcRenderer.invoke('geocode-place', placeName);
      } catch (error) {
        console.error('Error in geocodePlace:', error);
        return { error: error.message };
      }
    }
  });
