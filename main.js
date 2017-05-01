// Pull in FAO data 
d3.csv("2013.csv", function(sample) {

// Use crossfilter 
var amounts = crossfilter(sample);

var countryDim = amounts.dimension(d => d.Country);
//console.log(countryDim);

console.log(countryDim.group().reduceSum(function(d) 
    {
      if (d.Element == "Domestic supply quantity")  
        {return (d.Value * -1) }
      else 
        {return d.Value}
    } ).all());



var countryGroup = countryDim.filter("Afghanistan")
//.log(countryGroup)

//console.log(amounts)

//var afstats = countryDim.filter("Afghanistan");
//console.log(afstats.group().reduceCount);

//var countMeasure = afstats.group().reduceCount();
//console.log(countMeasure.size());
//var a = countMeasure.top(4);
//
//console.log(amtsByCountry);
//var amtsByYear = amounts.dimension(d => d.Year);
//var amtsByItem = amounts.dimension(d => d.Item);
//var amtsByProdType = amounts.dimension(d => d.Element);



// Map code taken from datavis-interactive lab

// Set up the SVG
var svg_width = window.innerWidth;
var svg_height = window.innerHeight;

// Use d3's built in projection object 
var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);

// Generate an SVG element on the page
var svg = d3.select("body").append("svg")
    .attr("width", svg_width)
    .attr("height", svg_height);

d3.json('world-110m.json', function(error, world) {
  // Decode the topojson file
  var land = topojson.feature(world, world.objects.land);
  var countries = topojson.mesh(world, world.objects.countries);
  
  // Fit our projection so it fills the window
  projection.fitSize([svg_width, svg_height], land);
  
  // Create land area
  svg.append('path')
    .datum(land)
    .attr('class', 'land')
    .attr('d', path);

  // Create state boundaries
  svg.append('path')
    .datum(countries)
    .attr('class', 'state-boundary')
    .attr('d', path);
});

//updateView();


});