import { ConvertOptions, D3Data, DataFormat } from './layout';
export declare function convert(data: DataFormat, options: ConvertOptions): {
    graph: D3Data;
    width: number | undefined;
    height: number | undefined;
};
