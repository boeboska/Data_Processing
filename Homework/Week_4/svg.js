window.onload = function (){
	
	d3.xml("test.svg", "image/svg+xml", function(error, xml) {
	    if (error) throw error;    
	    document.body.appendChild(xml.documentElement);  
	   

	    // the next colorfield starts at 138.7. and echt new colorfield starts 39.9y lower
	     // aanmaken kleurvelden
	    for (i = 138.7, k = 4; i < 1000; i +=39.9, k++){
	    	d3.select("svg")
			.append("rect")
			.attr("y", i)
			.attr("x", "13")
			.attr("id", "kleur" + k)
			.attr("class", "st1")
			.attr("width", "21")
			.attr("height", "29");
	    }

		// aanmaken tekstvelden
		// the fourth texfield starts at 178.6 and each new textfield starts 39.9 y lower
		for (i = 178.6, k = 4; i < 1000; i += 39.9, k++){
			d3.select("svg")
			.append("rect")
			.attr("y", i)
			.attr("x", "46.5")
			.attr("id", "tekst" + k)
			.attr("class", "st2")
			.attr("width", "119.1")
			.attr("height", "29");
		}
	
		var tekts = ["100", "1000", "10000", "10000", "100000", "1000000", "10000000"]

		// the first box stats at 34
		// 41.9 is difference between first and second text box
		for (i = 34, k = 0; i < 10000; i+= 41.9, k++){
			d3.select("svg")
			.append("text")
			.attr("x", "46.5")
			.attr("y", i)
			.style("text-anchor", "start")
			.text(tekts[k]);
		}

		var colormix = ["skip_thisone", "#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824", "grey"]

		// i starts at 1 because there is no kleur1 div
		// fill in the color rectangles
		for (i = 1; i < 9; i ++){
			d3.select("#kleur" + i)	
			.style("fill", colormix[i]);  
		}

		
	});

	   




}
