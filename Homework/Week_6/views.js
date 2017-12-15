// Name: Bob Borsboom
// Student number: 10802975
// Data Processing WK6

// An interactive map using D3
// shows the working population per province per year
// inclusive the percentage of total 

// README: the amount of employees per province is not the same as 
// the working population per province because the working population
// is inclusive people who have a own company

// REDME2: mouseover: see information of that province
// mouseclick, see the interactivity with the barchart


var population = {};
var percentage_of_total= {};
var kaas; 

var data = {}; 
var currentData; 

window.onload = function(){

	barChart();


	var width = 750;
	var height = 600;

	var colour = d3.scale.category20();

	var projection = d3.geo.mercator()
		.scale(1)
		.translate([0,0]);

	var path = d3.geo.path()
		.projection(projection);

	var map = d3.select(".map")
		.attr("width", width)
		.attr("height", height);


	queue()
		.defer(d3.json, "nld.json")
		.defer(d3.json, "year_2016.json")
		.defer(d3.json, "year_2015.json")
		.await(make_views);

	function make_views(error, nld, year_2016, year_2015, jaar ){

		data["year_2015"] = year_2015; 
		data["year_2016"] = year_2016; 


		currentData = data["year_2016"];



		if (error) throw error;


		var tip = d3.tip()
			.attr('class', 'd3-tip')

		// calculate position
			.offset([-10, 0])

			// set data within the display function
			.html(function(d) {
				
				return	"<strong> Capital: </strong> <span style='color:red'>" + d.properties.name + "</span>" + 
						"<div> <strong> Working population: </strong> <span style='color:red'>" + population_change(currentData)[d.properties.name] + "</div>" +
						"<div> <strong> percentage of total: </strong> <span style='color:red'>" + percentage_of_total_change(currentData)[d.properties.name] + "%" + "</div>"

		});


		map.call(tip);

		// set the map position
		var l = topojson.feature(nld, nld.objects.subunits).features[3];
		var b = path.bounds(l);
		var s = .2 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
		var t = [(width -200 - s * (b[1][0] + b[0][0])) / 2, (height + 100 - s * (b[1][1] + b[0][1])) / 2];


		projection
			.scale(s)
			.translate(t)

		map.selectAll("path")
			.data(topojson.feature(nld, nld.objects.subunits).features)
			.enter()
			.append("path")
			.attr("d", path)
			.attr("stroke", "black")
			.attr("id", "provincie")
			.attr("fill", function(d) { return create_color( percentage_of_total_change(currentData) [d.properties.name]) ; })
			.attr("class", function(d,i) { return d.properties.name; })
			
			.on("mouseover", tip.show)
			.on("mouseout", tip.hide)

			.on("click", function(d) { return update_bar(d.properties.name); })
		
			var colorss = ["pink", "HotPink", "DeepPink", "red"];
			var legenda_percentage = ["1% - 5%", "5% - 10%", "10% - 15%", "15%+"];

			// draw legend
			var legend = map.selectAll(".legend")
				.data(colorss)
				.enter()
				.append("g")
					.attr("class", "legend")
					.attr("transform", function(d, i ) { return "translate(0," + i * 20 +")"; });

			legend.append("rect")
				.attr("id", function(d, i) {return d })
				.attr("x", width - 18)
				.attr("width", 18)
				.attr("height", 18)
				.style("fill", function(d) { return d });

			legend.append("text")
				.data(legenda_percentage)
				.attr("x", width - 24)
				.attr("y", 9)
				.attr("dy", ".35em")
				.style("text-anchor", "end")
				.text(function(d) {return d; })

	};
}

function create_color(number){
	if (number < 5 || number == 5 ) {
		return "pink"
	} else if (number > 5 && number < 10 || number == 10)  {
		return "HotPink"
	} else if (number > 10 && number <15 || number == 15) {
		return "DeepPink"
	} else if (number > 15) {
		return "red"
	}
};


// change the mouseover data for working population
function population_change(json) {
	
	json.forEach(function (d) {
		population[d.capital_city] = parseInt(d.amount)
	})

	return population
};

// change the mouseover data for percentage of total
function percentage_of_total_change(json) {
	json.forEach(function (d) {
		percentage_of_total[d.capital_city] = parseInt(d.percentage_of_total)
	})
	
	return percentage_of_total
};


function change_data(value) {
	
	currentData = data[value];

};