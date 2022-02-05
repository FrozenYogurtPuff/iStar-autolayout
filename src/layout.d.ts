import { SimulationLinkDatum, SimulationNodeDatum } from 'd3-force';
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
    nodeName?: {
        [name: string]: string;
    };
    nodeSize?: {
        [name: string]: [number, number];
    };
    linkName?: {
        [name: string]: string;
    };
    width?: number;
    height?: number;
}
export interface ForceOptions {
    forceValue?: number;
    width?: number;
    height?: number;
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
export declare type DataFormat = piStarModel | D3Data;
export interface ResultSingle extends D3Data {
    current: number;
}
export declare type ResultArray = Array<ResultSingle>;
export declare type ResultGenerator = Generator<ResultSingle>;
export declare function layout(data: DataFormat, options: Options): ResultSingle | ResultArray | (() => ResultGenerator);
