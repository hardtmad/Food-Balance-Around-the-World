//This is the country.js file
var svg_width = window.innerWidth;
var svg_height = window.innerHeight;

// Use d3's built in projection object 
var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);

//Source for function: http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript
var getURLParameter = function (name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

var countryId = getURLParameter('id');

console.log(countryId);

d3.json('world-110m.json', function(error, world) {
var countries = topojson.feature(world, world.objects.countries).features;
var currentCountry = countries.filter(function (x) { return x.id === 'countryId' } );
console.log(currentCountry);
});