window.onload = function(){
	var width = 960;
	var height = 550;

	var population = {};
	var percentage_of_total= {};

	var colour = d3.scale.category20();

	// var color = d3.scale.linear()
	// 	.domain([1, 20])
	// 	.range(["red", "green"]);


	var projection = d3.geo.mercator()
		.scale(1)
		.translate([0,0]);

	var path = d3.geo.path()
		.projection(projection)

	var svg = d3.select("body")
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	//  
	// introduct d3.tooltip
	var tip = d3.tip()
		.attr('class', 'd3-tip')

		// calculate position
		.offset([-10, 0])

		// set data within the display function
		.html(function(d) {
			
			return	"<strong> Capital: </strong> <span style='color:red'>" + d.properties.name + "</span>" + 
					"<div> <strong> Working population: </strong> <span style='color:red'>" + population[d.properties.name] + "</div>" +
					"<div> <strong> percentage of total: </strong> <span style='color:red'>" + percentage_of_total[d.properties.name] + "%" + "</div>"
					
		});

	// callback when data is loaded
	svg.call(tip);

	queue()
		.defer(d3.json, "nld.json")
		.defer(d3.json, "werkzame_beroepsbevolking.json")
		.await(make_views);

	function make_views(error, nld, werkzame_beroepsbevolking){

		if (error) throw error;

		// aantal werkende en percentage koppelen aan andere json
		werkzame_beroepsbevolking.forEach(function(d){

			population[d.capital_city] = parseInt(d.amount)
			percentage_of_total[d.capital_city] = parseInt(d.percentage_of_total)


		});
		console.log(percentage_of_total);

		
		var l = topojson.feature(nld, nld.objects.subunits).features[3]
		var b = path.bounds(l)
		var s = .2 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height)
		var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

		projection
			.scale(s)
			.translate(t);

		svg.selectAll("path")
			.data(topojson.feature(nld, nld.objects.subunits).features)
			.enter()
			.append("path")
			.attr("d", path)
			.attr("stroke", "black")	
			.attr("id", "provincie")
			.attr("fill", function(d) { return Create_color( (percentage_of_total[d.properties.name]) ); })
			.attr("class", function(d,i) { return d.properties.name; })

			.on("mouseover", tip.show)
			.on("mouseout", tip.hide)

			var colorss = ["pink", "HotPink", "DeepPink", "red"]

			var legenda_percentage = ["1% - 5%", "5% - 10%", "10% - 15%", "15%+"]

			// draw legend
			var legend = svg.selectAll(".legend")
				.data(colorss)
				.enter()
				.append("g")
					.attr("class", "legend")
					.attr("transform", function(d, i ) { return "translate(0," + i * 20 +")"; });

			legend.append("rect")
				.attr("id", function(d, i) {return d})
				.attr("x", width - 18)
				.attr("width", 18)
				.attr("height", 18)
				.style("fill", function(d) { return d})

			legend.append("text")
				.data(legenda_percentage)
				.attr("x", width - 24)
				.attr("y", 9)
				.attr("dy", ".35em")
				.style("text-anchor", "end")
				.text(function(d) {return d; })

	};
}


function Create_color(number){
	if (number < 5 || number == 5 ) {
		return "pink"
	}
	if (number > 5 && number < 10 || number == 10)  {
		return "HotPink"
	}
	if (number > 10 && number <15 || number == 15) {
		return "DeepPink"
	}
	if (number > 15) {
		return "red"
	}
}

	