// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import config from '../config';
// Import the template to use
const mapTemplate = require('../templates/map.handlebars');

export default () => {
  // Data to be passed to the template

  // Return the compiled template to the router
  // Data to be passed to the template
  // Mapbox code
  update(compile(mapTemplate)());
    mapboxgl.accessToken = config.mapBoxToken;
    // eslint-disable-next-line no-unused-vars
    var map = new mapboxgl.Map({
      container: 'mapboxgl-map',
      style: 'mapbox://styles/mapbox/streets-v9'
    });
  update(compile(mapTemplate)());
};
