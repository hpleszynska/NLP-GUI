window.onload = () => {
    
    const map = mapAPI.createMap();
    geocodeAndMarkPlace('Berlin');
    
};


async function geocodeAndMarkPlace(placeName) {
    console.log('Geocoding place:', placeName);
    try {
      const result = await electron.geocodePlace(placeName);
      console.log('result:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  