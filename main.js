// Pull in FAO data 
d3.csv("2013.csv", function(sample) {
  d3.tsv("world-country-names.tsv", function(country_names) {

    /*  ----------------------
        ---------DATA---------
        ---------------------- */

    // Use crossfilter for FAO data
    var amounts = crossfilter(sample);
    // Make a dimension with the Country field, group by Element and Country
    var countryDim = amounts.dimension(function (d) { 
                                        var thisElement = d.Element;
                                        return 'Element='+thisElement+';Country='+d.Country; } );
    // Sum all production and supply values for each country
    var ElementCountry = (countryDim.group().reduceSum(function(d) 
        {
          if (d.Element == "Domestic supply quantity")  
            { 
              return d.Value}
          else 
            { 
              return d.Value}
        } ).all());
    // Score each country with the formula (prodcution/domestic supply)*100
    var formulaResult = [];
    for(i=0; i<175; i++) {
      var currentDict = {};
      // Change key to be country name
      currentDict.key = ElementCountry[i].key.replace("Element=Domestic supply quantity;Country=", "");
      // Calculate sufficiency score
      currentDict.value = ElementCountry[i+175].value*100/ElementCountry[i].value;
      formulaResult.push(currentDict);
    }
	
    /*  ----------------------
        ---------MAP---------
        ---------------------- */

  // Map code taken from datavis-interactive lab

	// Set up the SVG
	var svg_width = window.innerWidth;
	var svg_height = window.innerHeight;

	// Use d3's built in projection object 
	var projection = d3.geoMercator();
	var path = d3.geoPath().projection(projection);

  // Calculate color set 
	var colorSet = interpolateColors("rgb(138, 255, 132)", "rgb(0, 56, 0)", 25);

	for (var j = 0; j < 25; j++) {
	  colorSet[j] = "rgb(" + colorSet[j][0] + "," + colorSet[j][1] + "," + colorSet[j][2] + ")";
	}

  // Scale color set 
	var color = d3.scaleOrdinal(colorSet);

	// Generate an SVG element on the page
	var svg = d3.select("body").append("svg")
	    .attr("width", svg_width)
	    .attr("height", svg_height);

	d3.json('world-110m.json', function(error, world) {
		// Decode the topojson file
		var land = topojson.feature(world, world.objects.land);
		var countries = topojson.feature(world, world.objects.countries).features;
		var neighbors = topojson.neighbors(world.objects.countries.geometries);
		// Fit our projection so it fills the window
		projection.fitSize([svg_width, svg_height], land);

		// Loop over countries to match map ids with names and names with sufficiency scores
      	for (country of countries)
      	{
      		country.name = find_name(country.id, country_names);
	        current_suff = find_suff(country.name, formulaResult)
	        if (current_suff)
	          country.suff = current_suff;
	        else 
	          country.suff = 0;
    	  }

    // Helper function: Update view function if a country is clicked
    var updateView = function (countries, neighbors, selectedCountry) {
    if (selectedCountry == null) {
    	document.getElementById("header").innerHTML = "Food Self-Sufficiency Worldwide";
      svg.selectAll('.country')
        .data(countries)
        .attr('class', 'country')
        .attr('d', path)
        .style('fill', function(d, i) { return color(d.color = d.id); })
        .style('opacity', 1.0)
        .style('stroke', '#fff')
        .on("mouseover", function () {
          this.parentNode.appendChild(this);
          d3.select(this)
          .style('stroke', '#000');
        })
        .on("mouseout", function() {
          d3.select(this)
          .style('stroke', '#fff');
        })
        .on("click", function(d) {
          updateView(countries, neighbors, d);
        });
    } 
    else {
    	document.getElementById("header").innerHTML = "Food Self-Sufficiency in " + selectedCountry.name;
      svg.selectAll('.country')
        .data(countries)
        .attr('class', 'country')
        .attr('d', path)
        .style('stroke', '#fff')
        .style('opacity', function(d) { if (d.id != selectedCountry.id)
        	return 0.5;
        })
        .on("mouseover", function () {})
        .on("mouseout", function () {})
        .on("click", function(d) {
          updateView(countries, neighbors, null);
        });
      }
    };

		//Fill in countries by distinct colors
		svg.selectAll('.country')
		      	.data(countries)
		      	.enter()
		      	.append('path')
		      		.attr('class', 'country')
		      		.attr('d', path);

		updateView(countries, neighbors, null);

       });// end d3.json
  }); // end d3.tsv
}); // end d3.csv


/*  ----------------------
    ---HELPER FUNCTIONS---
    ---------------------- */

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
};

// Helper function to find id in country_names
function find_name (id, country_names) {
for (entry of country_names) 
  {
    if (entry.id == id)
      return entry.name;
  }
};

// Helper function to find sufficiency given country name
function find_suff (name, formulaResult) {
    for (suff of formulaResult) 
    {
      if (name == suff.key)
        return suff.value;
    }
};