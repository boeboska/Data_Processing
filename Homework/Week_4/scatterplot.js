/*
Name: Bob Borsboom
Student number: 10802975
Data Processing WK4

An interactive scatterplot using D3
Shows the revenue per year vs the performance in the Champions League per club

sourcecode:

1. intention barchart
	https://bl.ocks.org/mbostock/3887118

2. interactivity barchart:
	http://bl.ocks.org/weiglemc/6185069
*/

window.onload = function() {

	// set scatterplot margins
	var margin = {top: 20, right: 20, bottom: 30, left: 40}
	var width = 960 - margin.left - margin.right;
	var height = 480 - margin.top - margin.bottom;

	// set x range
	var x = d3.scale.linear()
		.range([0, width]);

	// set y range
	var y = d3.scale.linear()
		.range([height, 0]);

	// create color function
	var color = d3.scale.category10();

	// creae Xaxis
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	// set Yaxis
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	// add graph to canvas
	var svg = d3.select("body")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// include the tooltip
	var tip = d3.tip()
			.attr('class', 'd3-tip')

			// calculate position
			.offset([-10, 0])

			// set data within the display function
			.html(function(d) {

				return "<span>" + d.footballclub + "</span>";
			})

	svg.call(tip);


	// load data
	d3.tsv("football.tsv", function(error, data) {
		if (error) throw error;

		data.forEach(function(d) {

			// split data in variables
		    d.points = parseInt(d.points);
		    d.revenue = parseInt(d.revenue);
	  });

	// set x and y domains
	x.domain(d3.extent(data, function(d) { return d.points; })).nice();
	y.domain(d3.extent(data, function(d) { return d.revenue; })).nice();

	// set Xaxis
	svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
		.append("text")
		.attr("class", "label")
		.attr("x", width)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text(" CL-points");

	// set Yaxis
	svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Revenue (mln)")

	// set datapoints
	svg.selectAll(".dot")
		.data(data)
		.enter().append("circle")
			.attr("class", "dot")
			.attr("r", 12)
			.attr("cx", function(d) { return x(d.points); })
	      	.attr("cy", function(d) { return y(d.revenue); })
	      	.style("fill", function(d) {return color(d.country); })
	      	.on("mouseover", tip.show)
	      	.on("mouseout", tip.hide);

	// draw legend
	var legend = svg.selectAll(".legend")
	    .data(color.domain())
	    .enter().append("g")
	    	.attr("class", "legend")
	    	.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	// draw legend colored rectangles
	legend.append("rect")
	  	.attr("id", function(d, i) {return d})
	    .attr("x", width - 18)
	    .attr("width", 18)
	    .attr("height", 18)
	    .style("fill", color)   

	// draw legend text
	legend.append("text")
	    .attr("x", width - 24)
	    .attr("y", 9)
	    .attr("dy", ".35em")
	    .style("text-anchor", "end")
	    .text(function(d) { return d;})
	});

}