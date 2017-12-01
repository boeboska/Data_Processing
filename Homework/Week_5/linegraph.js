/*
Name: Bob Borsboom
Student number: 10802975
Data Processing WK5

An interactive linegraph using D3
Shows the temperture in 2014 per month in Eindhoven or Vlieland

sourcecode:

1. lines linegraph
	http://bl.ocks.org/d3noob/b3ff6ae1c120eea654b5

2. chane data per village (Eindhoven or Vlieland:
	http://plnkr.co/edit/8r0DBxVFgY6SJKbukWh5?p=preview
*/

var eindhovenData;
var vlielandData;
var x;
var y;
var d3;
var svg;
var valueline_1;
var valueline_2;
var valueline_3;
var parseDate;

window.onload = function(){

		// set linegraph margins
	var margin = {top: 20, right: 20, bottom: 30, left: 40}
	var width = 960 - margin.left - margin.right;
	var height = 480 - margin.top - margin.bottom;

	svg = d3.select("body")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	parseDate = d3.time.format("%Y%m%d").parse;

		// set x range
	x = d3.time.scale()
		.range([0, width]);

	// set y range
	y = d3.scale.linear()
		.range([height, 0]);

	// set Xaxis
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	// set Yaxis
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	// create color function
	var color = d3.scale.category10();

	// create max line 
	valueline_1 = d3.svg.line()
		.x(function(d) { return x(d.day); })
		.y(function(d) { return y(d.max); });

	valueline_2 = d3.svg.line()
		.x(function(d) { return x(d.day); })
		.y(function(d) { return y(d.gem); });

	valueline_3 = d3.svg.line()
		.x(function(d) { return x(d.day); })
		.y(function(d) { return y(d.min); });

	// create color function
	var color = d3.scale.category10();

	// include the tooltip
	var tip = d3.tip()
			.attr('class', 'd3-tip')

	svg.call(tip);

	queue()
		.defer(d3.json, "eindhoven.json")
		.defer(d3.json, "vlieland.json")
		.await(make_linegraph);

	function make_linegraph(error, eindhoven, vlieland){
		if (error) throw error;

		eindhoven.forEach(function(d){

			d.max = parseInt(d.max);
			d.min = parseInt(d.min);
			d.gem = parseInt(d.gem);
			d.day = parseDate(d.day);
	
		});

		vlieland.forEach(function(d){

			d.max = parseInt(d.max);
			d.min = parseInt(d.min);
			d.gem = parseInt(d.gem);
			d.day = parseDate(d.day);

		});

		// set domains
		x.domain(d3.extent(eindhoven, function(d) { return d.day ;} ));

		y.domain([
			(d3.min(eindhoven, function(d) { return d.min ; })),


			(d3.max(eindhoven, function(d) { return d.max ; }))

			]);

		vlielandData = vlieland
		eindhovenData = eindhoven

		// add the Xaxis
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		// add the Y Axis
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);

		// creating lines
		create_line(valueline_1, eindhoven, "red");
		create_line(valueline_2, eindhoven, "yellow");
		create_line(valueline_3, eindhoven, "blue");

		// variables voor legenda
		var colors = ["red", "yellow", "blue"]
		var place = ["max", "gem", "min"]
		
		// draw legend
		var legend = svg.selectAll(".legend")
		    .data(colors)
		    .enter()
		    .append("g")
		    	.attr("class", "legend")
		    	.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		// draw legend colored rectangles
		legend.append("rect")
		  	.attr("id", function(d, i) {return d})
		    .attr("x", width - 18)
		    .attr("width", 18)
		    .attr("height", 18)
		    .style("fill", function(d) { return d})   
		
		// draw legend text
		legend.append("text")
			.data(place)
		    .attr("x", width - 24)
		    .attr("y", 9)
		    .attr("dy", ".35em")
		    .style("text-anchor", "end")
		    .text(function(d) {return d; })         
	
		// creating horizontal and vertical line
		var vertical_line = svg
		.append("line")
			.attr("class", "v_line")
			.attr("x1", 0)
			.attr("y1", height)
			.attr("x2", 0)
			.attr("y2", 0)
			.attr("stroke", "green");

		var horizontal_line = svg
		.append("line")
			.attr("class", "v_line")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", width)
			.attr("y2", 0)
			.attr("stroke", "green");

		// move the horizontal and vertical line based on mouse
		svg.on("mousemove", function() {
			var mouse = d3.mouse(this)

			horizontal_line
				.attr("y1", mouse[1])
				.attr("y2", mouse[1])

			vertical_line
				.attr("x1", mouse[0])
				.attr("x2", mouse[0])})

	        };
	}				
	
// create a line based on the place and color
function create_line(valueline, place, color) {

	svg.append("path")
		.attr("class", color)
		.attr("d", valueline(place))
		.style("stroke", color);
}

// changes the data lines for Eindhoven or Vlieland
function change_data(value) {
	var data = []

	// sort the data input
	if (value == "eindhoven") {
		data = eindhovenData
	}
	else {
		data = vlielandData
	}

	var trans = d3.select("body").transition();

	var transition = svg.transition().duration(750),
		delay = function(d, i) { return i * 50; };

	// change the tree lines
	transition.select(".red")
		.attr("d", valueline_1(data))

	transition.select(".yellow")
		.attr("d", valueline_2(data))
	
	transition.select(".blue")
		.attr("d", valueline_3(data))
}



