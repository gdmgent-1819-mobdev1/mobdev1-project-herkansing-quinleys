// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import mapboxgl from 'mapbox-gl';
import config from '../config';

// Import the update helper
import update from '../helpers/update';

var platform = new H.service.Platform({
  'apikey': 'PgdnLpPmSCzw13lrxYay_HhMMokeRq0wogziXC_alcM'
});
// Import the template to use
const mapTemplate = require('../templates/page-with-map.handlebars');
mapboxgl.accessToken = 'pk.eyJ1IjoicXVpbmxleXMiLCJhIjoiY2p5YTB5anUwMDlibDNubzZ0ZnlkNm80OCJ9.xN5oodKkx7BmgSbcwPVLzw'
let marker = 0;
let lat;
let lng;
function getAllKoten(){
  const url = 'https://datatank.stad.gent/4/wonen/kotatgent.json';
fetch(url).then(response => {
  console.log(response)
  console.log('koten')
  return response.json()
})
.then( data => {
  //console.log(data.{{first & name}});
  data.forEach(kot => {
    const { Huisummer, Straat, Plaats } = kot;

    let adres = kot.Huisummer + ' ' + kot.Straat + ', ' + kot.Plaats;                     
  });
}).catch(error => {
  console.log('error');
  console.error(error);
});
};

export default () => {
  // Data to be passed to the template
  const title = 'Mapbox example';
  update(compile(mapTemplate)({ title }));
  getAllKoten();
  // Mapbox code
  if (config.mapBoxToken) {
    mapboxgl.accessToken = config.mapBoxToken;
    // eslint-disable-next-line no-unused-vars
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: ['51.05', '3.71667'],
      zoom: 9,
    });
    map.addControl(new mapboxgl.NavigationControl());
  } else {
    console.error('Mapbox will crash the page if no access token is given.');
  }
  
};
