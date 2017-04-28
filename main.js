// Pull in FAO data 
d3.csv("2013.csv", function(sample) {
  console.log(sample[0]);
});

// Map code taken from datavis-interactive lab

// Set up the SVG
var svg_width = window.innerWidth;
var svg_height = window.innerHeight;

// Use d3's built in projection object 
var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);

//Citation: Interpolate color functions taken from
//https://graphicdesign.stackexchange.com/questions/83866/generating-a-series-of-colors-between-two-colors
var interpolateColor = function (color1, color2, factor) {
    if (arguments.length < 3) { 
        factor = 0.5; 
    }
    var result = color1.slice();
    for (var i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
};

var interpolateColors = function (color1, color2, steps) {
    var stepFactor = 1 / (steps - 1),
        interpolatedColorArray = [];

    color1 = color1.match(/\d+/g).map(Number);
    color2 = color2.match(/\d+/g).map(Number);

    for(var i = 0; i < steps; i++) {
        interpolatedColorArray.push(interpolateColor(color1, color2, stepFactor * i));
    }

    return interpolatedColorArray;
}

var colorSet = interpolateColors("rgb(138, 255, 132)", "rgb(0, 56, 0)", 25);
console.log(colorSet);

var color = d3.scaleOrdinal(colorSet);

// Generate an SVG element on the page
var svg = d3.select("body").append("svg")
    .attr("width", svg_width)
    .attr("height", svg_height);

d3.json('world-110m.json', function(error, world) {
  // Decode the topojson file
  var land = topojson.feature(world, world.objects.land);
  var boundaries = topojson.mesh(world, world.objects.countries);
  var countries = topojson.feature(world, world.objects.countries).features;
  var neighbors = topojson.neighbors(world.objects.countries.geometries);
  // Fit our projection so it fills the window
  projection.fitSize([svg_width, svg_height], land);
  
  // Create land area
  svg.append('path')
    .datum(land)
     //This is the property that sets map-wide color.
			 //Need to figure out how to do this on a country
			 //basis.
    .attr('d', path);

  //Fill in countries by distinct colors
  svg.selectAll('.country')
      .data(countries)
      .enter()
      .append('path')
      	.attr('class', 'country')
      	.attr('d', path)
      	.style('fill', function(d, i) { return color(d.color = d3.max(neighbors[i], function(n) { return countries[n].color; }) + 1 | 0); });

  // Create country boundaries
  svg.append('path')
    .datum(boundaries)
    .attr('class', 'state-boundary')
    .attr('d', path);
});
