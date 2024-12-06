mapboxgl.accessToken = 'pk.eyJ1IjoidGhlLXN0ZXZlbi1kb2ciLCJhIjoiY200Ymo4dXBkMDBydjJrcHpxczNxZGlhZiJ9.YrtwN25uEelfKZSWkd-9mQ';



navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true
  })
  
  function successLocation(position) {
    setupMap([position.coords.longitude, position.coords.latitude])
  }
  
  function errorLocation() {
    setupMap([-2.24, 53.48])
  }
  
  function setupMap(center) {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: center,
      zoom: 15
    })
  
    const nav = new mapboxgl.NavigationControl()
    map.addControl(nav)
  
    var directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken
    })
  
    map.addControl(directions, "top-left")
  }



const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-74.006, 40.7128],
    zoom: 12
});

// Cuando el mapa se haya cargado, agregar la capa de tráfico
map.on('load', () => {
    // Agregar la fuente de tráfico
    map.addSource('traffic', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-traffic-v1' // Capa de tráfico en tiempo real
    });

    // Agregar la capa de tráfico en el mapa
    map.addLayer({
        id: 'traffic',
        type: 'line',
        source: 'traffic',
        'source-layer': 'traffic', // Capa de tráfico
        paint: {
            'line-color': '#f28cb1', // Color de las líneas de tráfico
            'line-width': 1 // Grosor de las líneas
        }
    });
});
const startGeocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    placeholder: "Inicio: dirección o lugar",
    mapboxgl: mapboxgl
});

const endGeocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    placeholder: "Fin: dirección o lugar",
    mapboxgl: mapboxgl
});

document.getElementById('geocoder-start').appendChild(startGeocoder.onAdd(map));
document.getElementById('geocoder-end').appendChild(endGeocoder.onAdd(map));

let startCoordinates = null;
let endCoordinates = null;

startGeocoder.on('result', (e) => {
    startCoordinates = e.result.center;
});

endGeocoder.on('result', (e) => {
    endCoordinates = e.result.center;
});

// Solicitar permiso para obtener la ubicación del usuario
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            userLocation = [position.coords.longitude, position.coords.latitude];
            map.setCenter(userLocation);
            map.setZoom(15);

            // Añade un marcador en la ubicación del usuario
            new mapboxgl.Marker({ color: 'blue' })
                .setLngLat(userLocation)
                .addTo(map);
        },
        function (error) {
            console.error("Error al obtener la ubicación: ", error.message);
        }
    );
} else {
    console.error("La API de geolocalización no está soportada por este navegador.");
}

// Función para centrar el mapa en la ubicación del usuario
function goToUserLocation() {
    if (userLocation) {
        map.setCenter(userLocation);
        map.setZoom(15);
    } else {
        alert("No se pudo obtener tu ubicación. Asegúrate de haber permitido el acceso.");
    }
}