
const { contextBridge, ipcRenderer } = require('electron');
const { renderCityCircles } = require('./utils');

const mapAPI = {
  createMap: async ()  => {
    const map = require('leaflet').map('map').setView([23.81, 90.41], 13);
    require('leaflet').tileLayer('https://maptiles.p.rapidapi.com/en/map/v1/{z}/{x}/{y}.png?rapidapi-key=7e5aeb2275msha90e319f94992f7p1f5bd5jsnc459e6f67e97', {
      maxZoom: 10,
      attribution: '&copy; <a href="https://www.openptmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);
    await renderCityCircles( 'city_data.json', map);
    return map;
  },
  geocodePlace: async (placeName) => {
    console.log('Geocoding place:', placeName);
    try {
      return await ipcRenderer.invoke('geocode-place', placeName);
    } catch (error) {
      console.error('Error in geocodePlace:', error);
      return { error: error.message };
    }
  },
  geocodeCities : async (file) => {
    console.log('Geocoding cities:', file);
    try {
      return await ipcRenderer.invoke('geocode-cities', file);
    } catch (error) {
      console.error('Error in geocodeCities:', error);
      return { error: error.message };
    }
  },
  retrieveCityCounts: async (filePath) => {
    console.log('Retrieving city counts from file:', filePath);
    try {
      return await ipcRenderer.invoke('retrieve-city-counts', filePath);
    } catch (error) {
      console.error('Error in retrieveCityCounts:', error);
      return { error: error.message };
    }
  },
  renderCityCircles: async (map) => {
    await renderCityCircles( 'city_data.json', map);
  }


}


contextBridge.exposeInMainWorld('mapAPI', mapAPI);

