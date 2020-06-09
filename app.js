const d3 = require('d3')
const cloud = require('d3-cloud')
const fs = require('fs')

const file = fs.readFileSync(__dirname + '/data/telegram/stonks/top_words.json', 'utf8')
const rawWords = JSON.parse(file)

const theme = 'interpolateWarm'
const backgroundColor = 'black'

const drawCloud = function() {
  const windowArea = window.innerWidth * window.innerHeight

  const minFontScale = d3.scaleLinear()
    .domain([0, 1_296_000])
    .range([8, 30])

  const maxFontScale = d3.scaleLinear()
    .domain([0, 1_296_000])
    .range([30, 120])

  const minFontSize = minFontScale(windowArea)
  const maxFontSize = maxFontScale(windowArea)

  const sizeScale = d3.scaleLinear()
    .domain(d3.extent(rawWords.map(word => word[1])))
    .range([minFontScale(windowArea), maxFontScale(windowArea)])

  const colorScale = d3.scaleLinear()
    .domain([minFontSize, maxFontSize])
    .range([0, 1])

  const words = rawWords.map(word => ({ text: word[0], size: sizeScale(word[1]) }))

  const layout = cloud()
    .size([window.innerWidth, window.innerHeight])
    .words(words)
    .font('Impact, AvenirNext-Bold, sans-serif')
    .padding(1)
    .fontSize(d => d.size)
    .on('end', draw)

  layout.start()

  function draw(words) {
    d3.select('body')
      .html('')
      .style('background-color', backgroundColor)
      .append('svg')
      .attr('width', layout.size()[0])
      .attr('height', layout.size()[1])
      .append('g')
      .attr('transform', 'translate(' + layout.size()[0] / 2 + ',' + layout.size()[1] / 2 + ')')
      .selectAll('text')
      .data(words)
      .enter().append('text')
      .style('font-size', d => (d.size + 'px'))
      .style('font-family', 'Impact, AvenirNext-Bold, sans-serif')
      .style('fill', d => d3[theme](colorScale(d.size)))
      .attr('text-anchor', 'middle')
      .attr('transform', d => ('translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'))
      .text(d => d.text)
  }
}

drawCloud()
window.addEventListener('resize', drawCloud)
