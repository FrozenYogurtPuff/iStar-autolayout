import { istarLayout } from '../../src/index';
import * as d3 from 'd3-selection';
import json from './piStarModel.json';
import _ from 'lodash';
import {
  Options,
  ResultSingle,
  ResultArray,
  ResultGenerator,
  D3Node,
  D3Link,
} from '../../src/layout';
import { piStarModel } from '../../src/piStar';

const model = <piStarModel>json;

const svg = d3
  .select('body')
  .append('svg')
  .attr('viewBox', [0, 0, model.diagram.width, model.diagram.height]);

document
  .getElementById('generator')
  ?.addEventListener('click', generator);
document.getElementById('array')?.addEventListener('click', array);
document.getElementById('first')?.addEventListener('click', first);
document.getElementById('last')?.addEventListener('click', last);
first();

function initial(nodes: D3Node[], links: D3Link[]) {
  svg
    .selectAll('.link')
    .data(links)
    .join('line')
    .classed('link', true)
    .attr('x1', (d) => (<D3Node>d.source).x!)
    .attr('y1', (d) => (<D3Node>d.source).y!)
    .attr('x2', (d) => (<D3Node>d.target).x!)
    .attr('y2', (d) => (<D3Node>d.target).y!);
  svg
    .selectAll('.node')
    .data(nodes)
    .join('circle')
    .attr('r', 40)
    .text((d) => d.name!)
    .classed('node', true)
    .attr('cx', (d) => d.x!)
    .attr('cy', (d) => d.y!);
}

const commonOptions: Options = {
  layout: {
    tickPerEpoch: 5,
    assureEpoch: 5,
  },
  convert: {
    mode: 'piStar',
  },
  force: {},
};

function first() {
  const firstOptions: Options = {
    layout: {
      mode: 'first',
    },
  };
  const firstInitial = <ResultSingle>istarLayout(model, firstOptions);
  initial(firstInitial.nodes, firstInitial.links);
}

function generator() {
  const generatorOptions = _.cloneDeep(commonOptions);
  generatorOptions.layout!.mode = 'generator';
  const generate = (
    istarLayout(model, generatorOptions) as () => ResultGenerator
  )();
  let result = generate.next();
  let nodes, links;
  const check = function () {
    setTimeout(() => {
      nodes = result.value.nodes;
      links = result.value.links;
      initial(nodes, links);
      result = generate.next();
      if (!result.done) {
        check();
      }
    }, 100);
  };
  check();
}

function array() {
  const arrayOptions = _.cloneDeep(commonOptions);
  arrayOptions.layout!.mode = 'array';
  const arr = <ResultArray>istarLayout(model, arrayOptions);
  // use rAF, setInterval or d3 transition to handle the data
  _.forEach(arr, (item) => {
    initial(item.nodes, item.links);
  });
}

function last() {
  const lastOptions: Options = {
    layout: {
      mode: 'last',
    },
  };
  const last = <ResultSingle>istarLayout(model, lastOptions);
  initial(last.nodes, last.links);
}
