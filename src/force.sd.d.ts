import * as d3 from 'd3-force';
import { D3Data, D3Link, D3Node, ForceOptions } from './layout';
export declare function force(data: D3Data, options: ForceOptions): {
    simulation: d3.Simulation<D3Node, undefined>;
    nodes: D3Node[];
    links: D3Link[];
};
