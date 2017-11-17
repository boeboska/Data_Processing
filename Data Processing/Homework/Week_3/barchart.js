// Name: Bob Borsboom
// Student number: 10802975
// Data Processing WK3

// An interactive barchart using D3
// shows the amount of goals per eredivisie season

//  sourcecode:

// 1. intention barchart
	// https://bost.ocks.org/mike/bar/3/

// 2. interactivity barchart:
	// http://bl.ocks.org/Caged/6476579

window.onload = function() {

	// set margins for barchart , source nr 1
	var margin = {top: 25, right: 30, bottom: 60, left: 40}
		width = 1450 - margin.left - margin.right
		height = 600 - margin.top - margin.bottom;

	// compute positions that snap to exact pixel boundaries incl. padding
	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	// create linear scale from height to zero
	var y = d3.scale.linear()
		.range([height, 0]);

	// create a new axis
	var xAxis = d3.svg.axis()
		// set the place for the axis
		.scale(x)

		//  horizontal axis with ticks below the domain path
		.orient("bottom");

	// create a new axis	
	var yAxis = d3.svg.axis()
		// set the places for the axis
		.scale(y)

		// vertical axis with ticks to the left of the domain path
		.orient("left");

	// introduct d3.tooltip
	var tip = d3.tip()
		.attr('class', 'd3-tip')

		// calculate position
		.offset([-10, 0])

		// set data within the display function
		.html(function(d) {
			return "<strong>Amount of goals:</strong> <span style='color:red'>" + d.goals + "</span>";
		})

	// create barcharts
	var chart = d3.select(".chart")	
	// set width
	.attr("width", width + margin.left + margin.right)
	// set height
	.attr("height", height + margin.top + margin.bottom)
	// create bar
	.append("g")
	// set the new bar next to the former bart
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

	// callback when data is loaded
	chart.call(tip);

	// import data from json
	d3.json("jsongoals.json", function(error, data) {
		// check if data is loaded
		if (data == null) {
			console.log("data not loaded")
		}

		// convert the goalnumbers to integers
		data.forEach(function(d) {
			d.goals = parseInt(d.goals)
		})

		// set all the season years
		x.domain(data.map(function(d) { return d.season; }));

		// set all the goal range from 750 to max amount goals
		y.domain([750, d3.max(data, function(d) { return d.goals; })]);

		// create bar on x axis in position
		chart.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)

			// add title on y axis
			.append("text")
			.attr("x", width - 40)
			.attr("y", .75 * margin.bottom - 15)
			.style("text-anchor", "end")
			.text("Season")

		// set title on y axis
		chart.append("g")
    		.attr("class", "y axis")
		    .call(yAxis)
		  	.append("text")
		  	.attr("transform", "rotate(90)")
		    .attr("y", 30)
		    .attr("x", 40)
		    .attr("dy", ".71em")
		    .style("text-anchor", "end")
		    .text("Goals");

		// fill the bars with data
		chart.selectAll(".bar")
			.data(data)
		  	.enter()
		  	.append("rect")
			.attr("class", "bar")

			// set bar on x axis
			.attr("x", function(d) { return x(d.season); })

			// set bar on y axis
			.attr("width", x.rangeBand())
			.attr("y", function(d) { return y(d.goals); })
			.attr("height", function(d) { return height - y(d.goals); })

			// source nr 2 (see link in top)
			// if mouse moves over the bar, show content
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide)
			
	});

	// look up the chosen value
	function type(d) {
		d.value = +d.value;
		return d;
	}
}
