// Name: Bob Borsboom
// Student number: 10802975
// Data Processing WK6

// An interactive barchart using D3
// shows the amount of employees per province per year

// README: the amount of employees per province is not the same as 
// the working population per province because the working population
// is inclusive people who have a own company


var dataBar; 
var barchart;
var x;
var y;

var datas = {};
var currentdata;

function barChart() {

	var margin = {top: 25, right: 30, bottom: 60, left: 60}
	width = 1000 - margin.left - margin.right
	height = 600 - margin.top - margin.bottom;

	x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

 	y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	barchart = d3.select(".barchart")	
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


	queue()
		.defer(d3.json, "bar2016.json")
		.defer(d3.json, "bar2015.json")
		.await(make_bar);

	function make_bar(error, year_2016, year_2015){


		datas["year_2016"] = year_2016
		datas["year_2015"] = year_2015

		currentdata = datas["year_2016"]

		if (error) throw error

		dataBar = currentdata; 

		currentdata.forEach(function(d) {
			d.werknemer = parseInt(d.werknemer)
		});

		// introduct d3.tooltip
		var tip = d3.tip()
			// console.log("hoi")

			.attr('class', 'd3-tip2')
			.offset([-10, 0])
			.html(function(d) {

				return "<strong> Amount of employees: </strong> <span style='color:red'>" + d.werknemer + "</span>";
		});

		d3.select(".barchart").call(tip);

		// x.domain(bar.map(function(d) { console.log(d.capital_city[0]); return d.capital_city; } ));
		// x.domain(["Groningen"])
		x.domain(currentdata.map(function(d) {  return d.capital_city; }).sort());

		y.domain([0, d3.max(currentdata, function(d) { return d.werknemer; } )] );
		

		barchart.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)

			.append("text")
			.attr("x", width - 40)
			.attr("y", .75 * margin.bottom - 15)
			.style("text-anchor", "end")
			.text("provinciewee")

		// set title on y axis
		barchart.append("g")
    		.attr("class", "y axis")
		    .call(yAxis)

		  	.append("text")
		  	.attr("transform", "rotate(90)")
		    .attr("y", 35)
		    .attr("x", 40)
		    .attr("dy", ".700001em")
		    .style("text-anchor", "start")
		    .text("amount x 1000");

		// console.log(dataBar[0])

		// fill the bars with data
		barchart.selectAll(".bar")
			.data(currentdata)
		  	.enter()
		  	.append("rect")
			.attr("class", "bar")
			.attr("id", function(d) { return d.capital_city; })

			// set bar on x axis
			.attr("x", function(d) { return x(d.capital_city); })

			// set bar on y axis
			.attr("width", x.rangeBand())
			.attr("y", function(d) { return y(d.werknemer); })
			.attr("height", function(d) { return height - y(d.werknemer); })

			.on("mouseover", tip.show)
			.on("mouseout", tip.hide)

	};
};

function update_bar(provincie) {

	all_bars = barchart.selectAll(".bar")
	all_bars.style("fill", "green")

	current_bar = barchart.selectAll("#" + provincie)
	current_bar.style("fill", "black")

};

function make_bars_werknemer(provincie) {

	for (obj in currentdata) {

		if (currentdata[obj].capital_city == provincie){

			var werknemer = currentdata[obj].werknemer
		}

	}
	return werknemer
};

function make_bars_zelfstandige(provincie) {

	for (obj in currentdata) {

		if (currentdata[obj].capital_city == provincie){

			var zelfstandige = currentdata[obj].zelfstandige;

			}
	}
	return zelfstandige
};