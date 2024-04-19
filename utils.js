const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');
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

async function geocodeCities(filepath) {
    const citiesCounts = await retrieveCityCounts(filepath);
    console.log('citiesCounts:', citiesCounts);
    try {
        const cityInfo = [];
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
        for (const [city, count] of Object.entries(citiesCounts)) {
            console.log('Geocoding city:', city)
            const data = await geocodeCity(city);
            cityInfo.push({
                city: city,
                latitude: data.latitude,
                longitude: data.longitude,
                count: count 
            });
            await delay(2000);
        }
    
        fs.writeFileSync('city_data.json', JSON.stringify(cityInfo, null, 2));
        console.log('City data has been written to city_data.json');
    } catch (error) {
        console.error('Error geocoding cities:', error);
    }
}


function retrieveCityCounts(filePath) {
    const cityCounts = {};
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv({ separator: ';' }))
            .on('data', (row) => {
                const city = row.location.trim();
                if (city) { 
                    cityCounts[city] = (cityCounts[city] || 0) + 1;
                }
            }).on("end", () => {
                
                resolve(cityCounts);
            }).on("error", reject);
    });
}


async function renderCityCircles(filepath, map) {
    try {
        console.log('Map', map)
        console.log(typeof map)
        // Read city data from the JSON file
        const cityData = await fs.promises.readFile(filepath, 'utf8');
        const cities = JSON.parse(cityData);

        // Calculate maximum count and max radius
        const maxCount = Math.max(...cities.map(city => city.count));
        const maxRadius = 10000;

        // Iterate over each city
        for (const cityInfo of cities) {
            const { city, latitude, longitude, count } = cityInfo;

            // Calculate radius based on city count
            const radius = Math.sqrt(count / maxCount) * maxRadius;

            // Render circle on the map
            const circle = require('leaflet').circle([latitude, longitude], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: radius
            }).addTo(map);

            // Bind popup to the circle
            circle.bindPopup(`<b>${city}</b><br>Count: ${count}`);
        }

        console.log('City circles rendered successfully');
    } catch (error) {
        console.error('Error rendering city circles:', error);
    }
}




module.exports = {
    geocodeCity,
    retrieveCityCounts,
    renderCityCircles,
    geocodeCities
};