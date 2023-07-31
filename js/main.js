//begin script when window loads
window.onload = setMap();

//set up choropleth map
function setMap(){
    //map frame dimensions
    var width = 960,
        height = 460;

    //create new svg container for the map
    var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    //create Albers equal area conic projection centered on France
    var projection = d3.geoAzimuthalEqualArea()
    .center([-5.42, 41.01])

    .rotate([104.59, -9.98, 0])
    
    .scale(452.01)
    
    .translate([width / 2, height / 2]);

    var path = d3.geoPath()
        .projection(projection);

    //use Promise.all to parallelize asynchronous data loading
    var promises = [];    
    promises.push(d3.csv("data/pop_impact_on_rent.csv")); //load attributes from csv    
    promises.push(d3.json("data/USStates.topojson")); //load spatial data    
    Promise.all(promises).then(callback);

    //use Promise.all to parallelize asynchronous data loading
    var promises = [
        d3.csv("data/pop_impact_on_rent.csv"),
        d3.json("data/USStates.topojson"),
    ];
    Promise.all(promises).then(callback);

    function callback(data) {
        var csvData = data[0],
            states = data[1];
            var   USStates = topojson.feature(states, states.objects.USStates).features;

                        //Example 2.6 line 1...create graticule generator
        var graticule = d3.geoGraticule()
        .step([5, 5]); //place graticule lines every 5 degrees of longitude and latitude

    //create graticule background
    var gratBackground = map.append("path")
        .datum(graticule.outline()) //bind graticule background
        .attr("class", "gratBackground") //assign class for styling
        .attr("d", path) //project graticule

    //Example 2.6 line 5...create graticule lines
    var gratLines = map.selectAll(".gratLines") //select graticule elements that will be created
        .data(graticule.lines()) //bind graticule lines to each element to be created
        .enter() //create an element for each datum
        .append("path") //append each element to the svg as a path element
        .attr("class", "gratLines") //assign class for styling
        .attr("d", path); //project graticule lines

        //add France regions to map
        var regions = map.selectAll(".states")
            .data(USStates)
            .enter()
            .append("path")
            .attr("class", function(d){
                return "states " + d.properties.AFFGEOID;
            })
            .attr("d", path);


    };
}