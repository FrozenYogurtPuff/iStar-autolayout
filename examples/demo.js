import { istarLayout } from '../index'
import * as d3 from 'd3-selection'
import model from './piStarModel.json'
import _ from 'lodash'

const svg = d3.select('body').append('svg').attr('viewBox', [0, 0, model.diagram.width, model.diagram.height])
document.getElementById('generator').addEventListener('click', generator)
document.getElementById('array').addEventListener('click', array)
document.getElementById('first').addEventListener('click', first)
document.getElementById('last').addEventListener('click', last)
first()

function initial (nodes, links) {
  svg
    .selectAll('.link')
    .data(links)
    .join('line')
    .classed('link', true)
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)
  svg
    .selectAll('.node')
    .data(nodes)
    .join('circle')
    .attr('r', 40)
    .text(d => d.names)
    .classed('node', true)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
}

const commonOptions = {
  layout: {
    tickPerEpoch: 5,
    assureEpoch: 5
  },
  convert: {
    mode: 'piStar'
  },
  force: { }
}

function first () {
  const firstOptions = {
    layout: {
      mode: 'first'
    }
  }
  const firstInitial = istarLayout(model, firstOptions)
  initial(firstInitial.nodes, firstInitial.links)
}

function generator () {
  const generatorOptions = _.cloneDeep(commonOptions)
  generatorOptions.layout.mode = 'generator'
  const generate = istarLayout(model, generatorOptions)()
  let result = generate.next()
  let nodes, links
  const check = function () {
    setTimeout(() => {
      nodes = result.value.nodes
      links = result.value.links
      initial(nodes, links)
      result = generate.next()
      if (!result.done) {
        check()
      }
    }, 100)
  }
  check()
}

function array () {
  const arrayOptions = _.cloneDeep(commonOptions)
  arrayOptions.layout.mode = 'array'
  const arr = istarLayout(model, arrayOptions)
  // use rAF, setInterval or d3 transition to handle the data
  _.forEach(arr, item => {
    initial(item.nodes, item.links)
  })
}

function last () {
  const lastOptions = {
    layout: {
      mode: 'last'
    }
  }
  const last = istarLayout(model, lastOptions)
  initial(last.nodes, last.links)
}
