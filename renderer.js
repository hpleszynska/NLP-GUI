
window.onload = () => {
  
  const map = LoadMap('city_data.json');
};

async function LoadMap(filename){
    const map = await mapAPI.createMap(filename);
    console.log('map:', map);
    return map;
}

  