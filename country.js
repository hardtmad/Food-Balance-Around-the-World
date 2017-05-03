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
var countryColor = getURLParameter('color');
console.log(countryColor);

var svg = d3.select("body").append("svg")
    .attr("width", svg_width)
    .attr("height", svg_height);

d3.json('world-110m.json', function(error, world) {
	var land = topojson.feature(world, world.objects.land);
	var countries = topojson.feature(world, world.objects.countries).features;
	var currentCountry = countries.filter(function (x) { 
		if (x.id == countryId) {
			return x;
		} 
	});

	projection.fitSize([svg_width, svg_height], land);

	svg.append('path')
       .datum(land)
       .attr('d', path)
       .style('fill', '#aaa')
       .style('opacity', 0.25);

	svg.selectAll('.country')
	      .data(currentCountry)
	      .enter()
	      .append('path')
	      	.attr('class', 'country')
	      	.attr('d', path)
	      	.style('opacity', 1.0)
	      	.style('fill', '#000')
	      	.style('fill', countryColor)
	      	.style('stroke', '#fff');
});