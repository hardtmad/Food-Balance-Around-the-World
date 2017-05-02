//This is the country.js file
var svg_width = window.innerWidth;
var svg_height = window.innerHeight;

// Use d3's built in projection object 
var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);

