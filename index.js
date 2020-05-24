d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(function(world) {
	d3.csv("https://docs.google.com/spreadsheets/d/1QORZYZpfHUEjvON4Dz5-u3_a9Ya5NMZd5zLXD9XFPaY/export?gid=1916946621&format=csv").then(function(data) {
		d3.csv("https://docs.google.com/spreadsheets/d/1hd0oP1awIq25VFsIwKHDdcoJrVp8_DoOEanM-J8b9vs/export?gid=929585311&format=csv").then(function(content) {
				
			console.log("cont")
			console.log(content)

			// для каждой штуки в контенте создаём блок в артикле
			let article = document.querySelector('article')
			let index = 0


			function updateMap(occupation) {
				console.log(occupation)

				mapDots.selectAll("circles")
					.data(data)
					.attr("r", 2)
					.attr("fill", "black")
					.attr("fill-opacity", 0.3)
				//.append("title")
				//.text(d => `${d.name}: ${format(d.population)}`);
					
			}

			var waypoints = []

			for (let block of content) {
				var section = document.createElement("section")
				var p = document.createElement("p")
				var textnode = document.createTextNode(block.Text)
				p.appendChild(textnode)
				section.appendChild(p)
				let class_ = 'section-' + index++
				section.classList.add(class_)
				article.appendChild(section)

				let wp = new Waypoint({
					element: document.querySelector('.'+class_),
					handler: function(direction) {
						updateMap(block.Occupation)
						console.log(class_)
					},
					offset: '75%',
				})
			}

			data = data.map(d => {
				d.EVENT_DATE = new Date(d.EVENT_DATE)
				return d
			})

			let dateExtent = d3.extent(data, d => d.EVENT_DATE)
			console.log(dateExtent)

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

			const svg = d3.select('svg#map')
				.style("width", "800px")
				.style("height", "400px");

			svg.append("path")
				.datum(topojson.feature(world, world.objects.land))
				.attr("fill", "#e0e2e4")
				.attr("d", path);

			const mapDots = svg.append("g")
				.attr("stroke", "#fff")
				.attr("stroke-width", 0.1)
			
			mapDots.selectAll("circles")
				.data(data)
				.join("circle")
				.attr("fill", "#aa0000")
				.attr("fill-opacity", 0.3)
				.attr("transform", d => `translate(${projection([d['LONGITUDE'], d.LATITUDE])})`)
				.attr("r", 2)
			//.append("title")
			//.text(d => `${d.name}: ${format(d.population)}`);


		})
	})
})
