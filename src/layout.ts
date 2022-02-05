import { convert } from './convert';
import { force } from './force.sd';
import _ from 'lodash';
import {
  Simulation,
  SimulationLinkDatum,
  SimulationNodeDatum,
} from 'd3-force';
import { piStarModel } from './piStar';

export interface LayoutOptions {
  mode?: 'generator' | 'array' | 'first' | 'last';
  tickPerEpoch?: number;
  assureEpoch?: number;
  stopWhenStable?: boolean;
  width?: number;
  height?: number;
}

export interface ConvertOptions {
  mode?: 'piStar' | 'd3';
  nodeName?: { [name: string]: string };
  nodeSize?: { [name: string]: [number, number] };
  linkName?: { [name: string]: string };
  width?: number;
  height?: number;
}

export interface ForceOptions {
  forceValue?: number;
  width?: number;
  height?: number;
  // radius?: number;
}

export interface Options {
  layout?: LayoutOptions;
  convert?: ConvertOptions;
  force?: ForceOptions;
}

export interface D3Node extends SimulationNodeDatum {
  id: number | string;
  r: number;
  type?: string;
  name?: string;
  width?: number;
  height?: number;
}

export interface D3Link extends SimulationLinkDatum<D3Node> {
  name?: string;
  type?: string;
}

export interface D3Data {
  nodes: D3Node[];
  links: D3Link[];
}

interface D3Simulation extends Simulation<D3Node, D3Link> {}

export type DataFormat = piStarModel | D3Data;

export interface ResultSingle extends D3Data {
  current: number;
}

export type ResultArray = Array<ResultSingle>;
export type ResultGenerator = Generator<ResultSingle>;

export function layout(
  data: DataFormat,
  options: Options,
): ResultSingle | ResultArray | (() => ResultGenerator) {
  const lOptions = options?.layout ?? {};
  const cOptions = options?.convert ?? {};
  const fOptions = options?.force ?? {};

  const mode = lOptions?.mode ?? 'generator';
  const tick = lOptions?.tickPerEpoch ?? 50;
  const epoch = lOptions?.assureEpoch ?? 20;
  const stable = lOptions?.stopWhenStable ?? true;

  const jsonData = convert(data, cOptions);
  if (!(fOptions?.width && fOptions?.height)) {
    if (lOptions?.width && lOptions?.height) {
      [fOptions.width, fOptions.height] = [
        lOptions.width,
        lOptions.height,
      ];
    } else {
      [fOptions.width, fOptions.height] = [
        jsonData.width,
        jsonData.height,
      ];
    }
  }

  const forceResult = force(_.cloneDeep(jsonData.graph), fOptions);
  const { simulation, nodes, links } = forceResult;

  let current = 0;

  function simulationEpoch(tick: number) {
    for (let i = 0; i < tick; i++) {
      simulation.tick();
    }
  }

  function keep(
    current: number,
    atLeastEpoch: number,
    needStable: boolean,
    simulation: D3Simulation,
  ) {
    return (
      current < atLeastEpoch ||
      (needStable && simulation.alpha() >= 0.001)
    );
  }

  function* generator() {
    while (keep(current, epoch, stable, simulation)) {
      simulationEpoch(tick);
      current += 1;
      yield { current, nodes, links };
    }
  }

  function generalOutput(mode: 'array' | 'first' | 'last') {
    if (mode === 'first') {
      return { current: 0, nodes, links } as ResultSingle;
    }
    const results = [];
    while (keep(current, epoch, stable, simulation)) {
      simulationEpoch(tick);
      current += 1;
      if (mode === 'array') {
        results.push(_.cloneDeep({ current, nodes, links }));
      }
    }
    if (mode === 'array') {
      return results as ResultArray;
    } else if (mode === 'last') {
      return _.cloneDeep({ current, nodes, links }) as ResultSingle;
    } else {
      throw Error('Illegal output mode name ' + mode);
    }
  }

  if (mode === 'generator') {
    return generator;
  } else if (
    mode === 'array' ||
    mode === 'last' ||
    mode === 'first'
  ) {
    return generalOutput(mode);
  } else {
    throw Error('Illegal result format ' + mode);
  }
}
