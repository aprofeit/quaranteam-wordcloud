var d3 = require("d3");
var cloud = require("d3-cloud");
var fs = require("fs");

var file = fs.readFileSync(__dirname + '/data/telegram/top_words.json', 'utf8');

let drawCloud = function() {
  var width = window.innerWidth

  var scaleFactor = d3.scaleSqrt()
    .domain([0, 2000])
    .range([25, 10])

  var words = JSON.parse(file).map(function(word) {
    return { text: word[0], size: word[1] / scaleFactor(window.innerWidth + window.innerHeight) }
  });

  var max = d3.max(words.map(function(word) {
    return word.size
  }));

  var min = d3.min(words.map(function(word) {
    return word.size
  }));

  var layout = cloud()
    .size([window.innerWidth, window.innerHeight])
    .words(words)
    .font("Impact, AvenirNext-Bold, sans-serif")
    .padding(3)
    .fontSize(function(d) { return d.size; })
    .on("end", draw);

  layout.start();

  function draw(words) {
    d3.select("body").html("");
    d3.select("body").append("svg")
      .attr("width", layout.size()[0])
      .attr("height", layout.size()[1])
      .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "Impact, AvenirNext-Bold, sans-serif")
      .style("fill", function(d) { return d3.interpolateWarm((d.size - min) / (max - min))})
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
  }
}

drawCloud();
window.addEventListener('resize', drawCloud);
