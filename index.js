d3.json('/data/cities.json').then(function(cities) {
	d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(function(world) {

	let data = cities
		.filter(city => city.population > 1e5)
		.sort((a, b) => b.population - a.population)	
  console.log(data)


	const height = 510
	const width = 800

	function format(num) {
		return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
	}


  const projection = d3.geoEqualEarth()
    .translate([width / 2, height / 2])
    .fitExtent([[10, 10], [width - 20, height - 20]], {type: "Sphere"})
    .rotate([-10, 0])
    .precision(0.1);
  
  const path = d3.geoPath()
    .projection(projection);
  
  const radius = d3.scaleSqrt()
    .domain([0, d3.max(data, city => city.population)])
    .range([0, width / 50])
  
  const svg = d3.select('svg#map')
    .style("width", "800px")
    .style("height", "400px");
  
  svg.append("path")
    .datum(topojson.feature(world, world.objects.land))
    .attr("fill", "#e0e2e4")
    .attr("d", path);
  
  svg.append("g")
    .attr("fill", "#aa0000")
    .attr("fill-opacity", 0.3)
    .attr("stroke", "#fff")
    .attr("stroke-width", 0.1)
    .selectAll("circles")
    .data(data)
    .join("circle")
      .attr("transform", d => `translate(${projection(d.loc.coordinates)})`)
      .attr("r", d => radius(d.population))
      .append("title")
        .text(d => `${d.name}: ${format(d.population)}`);




	})
})
