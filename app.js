const d3 = require('d3');
const cloud = require('d3-cloud');
const fs = require('fs');

const file = fs.readFileSync(__dirname + '/data/telegram/stonks/top_words.json', 'utf8');

const drawCloud = function() {
  const rawWords = JSON.parse(file)

  const sizeScale = d3.scaleLinear()
    .domain(d3.extent(rawWords.map(word => word[1])))
    .range([30, 120])

  const colorScale = d3.scaleLinear()
    .domain([30, 120])
    .range([0, 1])

  const words = rawWords.map(word => ({ text: word[0], size: sizeScale(word[1]) }))

  const layout = cloud()
    .size([window.innerWidth, window.innerHeight])
    .words(words)
    .font('Impact, AvenirNext-Bold, sans-serif')
    .padding(1)
    .fontSize(d => d.size)
    .on('end', draw);

  layout.start();

  function draw(words) {
    d3.select('body').html('');
    d3.select('body').append('svg')
      .attr('width', layout.size()[0])
      .attr('height', layout.size()[1])
      .append('g')
      .attr('transform', 'translate(' + layout.size()[0] / 2 + ',' + layout.size()[1] / 2 + ')')
      .selectAll('text')
      .data(words)
      .enter().append('text')
      .style('font-size', d => (d.size + 'px'))
      .style('font-family', 'Impact, AvenirNext-Bold, sans-serif')
      .style('fill', d => d3.interpolateWarm(colorScale(d.size)))
      .attr('text-anchor', 'middle')
      .attr('transform', d => ('translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'))
      .text(d => d.text);
  }
}

drawCloud();
window.addEventListener('resize', drawCloud);
