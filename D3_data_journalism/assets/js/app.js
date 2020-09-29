// Define SVG area dimensions
var svgWidth = window.innerWidth*0.6;
var svgHeight = window.innerHeight*0.75;
​
// Define the chart's margins as an object
var chartMargin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};
​
// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
​
​
// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);
​
// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
​
  // Load data from data.csv
d3.csv("assets/data/data.csv").then(function(newsData) {
​
    // Cast the poverty and healthcare data values to a number for each piece of newsData
    newsData.forEach(function(n) {
        n.poverty = +n.poverty;
        n.healthcare = +n.healthcare;
        
        console.log(newsData);
​
    });
​
  // Create a linear scale for the vertical axis.
  var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(newsData, n => n.poverty)])
    .range([0, chartWidth]);

​
​
    // Create a linear scale for the horizontal axis.
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(newsData, n => n.healthcare)])
    .range([chartHeight, 0]);
    
​
  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale).ticks(8);
  var leftAxis = d3.axisLeft(yLinearScale);
​
  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(leftAxis);
​
  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);
​
  // Create one SVG rectangle per piece of newsData
  // Use the linear and band scales to position each rectangle within the chart
 var circleGroup = chartGroup.selectAll("circle")
    .data(newsData)
    .enter()
    .append("circle")
    .attr("cx", n => xLinearScale(n.poverty))
    .attr("cy", n=> yLinearScale(n.healthcare))
    //.attr("width", n => chartWidth - xLinearScale(n.poverty))
    //.attr("height", n => chartHeight - yLinearScale(d.healthcare));
    .attr("r", "12")
    .classed("stateCircle", true)
​
​
    // apend the text
    chartGroup.selectAll()
        .data(newsData)
        .enter()
        .append("text")  
        .attr("x", n => xLinearScale(n.poverty))
        .attr("y", n=> yLinearScale(n.healthcare)+3.0)
        .text(n => n.abbr)
        .classed("stateText", true)
        .attr("font-size", "8px")
​
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return(`${d.state}<br>Poverty: ${d.poverty} % <br> Healthcare: ${d.healthcare}`)
        });
​
// create tht tool tip
    chartGroup.call(toolTip);
​
    circleGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    // mouse out event
        .on("mouseout", function(data, index) {
        toolTip.hide(data);
        });
​
    //Create access label
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight/2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)")
        .attr("font-weight", "bold");
​
    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth/2}, ${chartHeight+40})`)
        .attr("class", "axisText")
        .text("In Poverty (%)")
        .attr("font-weight",  "bold");
​
}).catch(function(error) {
    console.log(error);
});
