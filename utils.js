const axios = require('axios');

async function geocodeCity(cityName) {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&addressdetails=1`);

        if (response.data.length > 0) {
            const location = response.data[0];
            return {
                latitude: parseFloat(location.lat),
                longitude: parseFloat(location.lon),
                address: location.display_name
            };
        } else {
            throw new Error('No results found for the specified city.');
        }
    } catch (error) {
        return { error: error.message };
    }
}

module.exports = {
    geocodeCity
};