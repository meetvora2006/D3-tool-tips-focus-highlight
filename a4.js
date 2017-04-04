var tip;

function addTooltip(popLookup) {

// took reffrenec and some code from https://github.com/Caged/d3-tip and http://bl.ocks.org/Caged/6476579
    
    tip = d3.tip().attr('class','d3-tip').html(function(d) {return d.properties.county_nam+":"+popLookup.get(d.properties.county_nam);});


var svg = d3.select("#map").select("svg");

svg.call(tip);

svg.selectAll('.county')
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide);
}

function addBrushing() {
    
// take reffrence and code from : http://codepen.io/dakoop/pen/yOXWPZ 
    var mybar = d3.select("#bar").select("svg");
    
    var mymap = d3.select("#map").select("svg");
    
   
  function rowMouseEnter() {
      
  var selectedbar = d3.select(this)

  selectedbar.classed("highlight", true);
      
   mymap.selectAll("path").filter(function(d) {
      return d.properties.county_nam == selectedbar.datum().County;  
      }).classed("highlight", true);

  }
  
  function rowMouseLeave() {
      
      
  var selectedbar = d3.select(this);
    
    selectedbar.classed("highlight", false);

     mymap.selectAll("path")
     .classed("highlight", false);
  }


 function rowMouseEnterMap() {
      
  var selectedpath = d3.select(this);
  
    selectedpath.classed("highlight", true);
      
   mybar.selectAll("rect").filter(function(d) {
      return d.County == selectedpath.datum().properties.county_nam;  
      }).classed("highlight", true);

  }
  
  function rowMouseLeaveMap(){
      
      tip.hide(this);
      
  var selectedpath = d3.select(this);
  
    selectedpath.classed("highlight", false);

     mybar.selectAll("rect")
      .classed("highlight", false);
  }
  
     mybar.selectAll('rect')
    .on("mouseenter", rowMouseEnter)
    .on("mouseout", rowMouseLeave);
    
    
     mymap.selectAll('path')
    .on("mouseenter", rowMouseEnterMap)
    .on("mouseout", rowMouseLeaveMap);  

}

function addDistortion() {
    
// took reffrence and code from : view-source:https://bost.ocks.org/mike/fisheye/      

 var xFisheye = d3.fisheye.scale(d3.scale.linear).domain([0, 72]).range([0, 1000]);
 
 var mybar = d3.select("#bar").select("svg");
    
 var thisg = mybar.selectAll(".bar");
     
  mybar.on("mousemove", function(){
    var mouse = d3.mouse(this);
   
    xFisheye.focus(mouse[0]);
   
     thisg
    .attr("transform", function(d,i){return "translate("+xFisheye(i)+",220)"; })
    .select("rect")
    .attr("width", function(d,i) {return (xFisheye(i+1)-xFisheye(i));});
    
  });
}



function addHistogram(popData) {
    
  //code and idea taken from : https://bl.ocks.org/mbostock/3048450
  
  // check parseInt from here : http://www.w3schools.com/jsref/jsref_parseint.asp
  
    var PopArr = popData.map(function (data) {
        return parseInt(Math.log2(data.Population));
    });


var margin = {top: 10, right: 30, bottom: 30, left: 30},
    width = 960 - margin.left - margin.right,
    height = 535 - margin.top - margin.bottom;


var data = d3.layout.histogram()
    .bins(8)
    (PopArr);
  
   
var y = d3.scale.linear()
    .domain([0, 18])
    .range([height, 0]);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#hist").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(25,0)")
    .call(yAxis);
        
    var bar = svg.selectAll(".bar")
    .data(data)
  .enter().append("g")
    .attr("class", "bar");

bar.append("rect")
    .attr("x", function(d,i) { return i*50+29; })
    .attr("y", function(d) { return y(d.y); })
    .attr("width", 49)
    .attr("height", function(d) { return height - y(d.y); })
    .style("fill", "grey");

bar.append("text")
    .attr("dy", ".75em")
    .attr("y", 496)
    .attr("x", function(d,i) { return i*50+54; })
    .attr("text-anchor", "middle")
    .text(function(d,i) { var t = Math.round(d.x); 
                          var m = t+1;
                          return t+"-"+m;});
                      
svg.append("text")
    .attr("class", "axis")
   .attr("text-anchor", "middle")
    .attr("transform", "translate(0,200)rotate(-90)")  
    .text("#Counties");
    
svg.append("text")
   .attr("text-anchor", "middle")
    .attr("transform", "translate(210,520)")  
    .text("Population (Log2)");
}

function addToVisualization() {
    addTooltip(window.popLookup);
    addDistortion();
    addBrushing();
    // for extra credit
    addHistogram(window.popData);
}

// do not remove the getData call!
getData(addToVisualization);