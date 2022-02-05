import { nodeName, nodeSize, linkName } from './dictionary';
import _ from 'lodash';
import {
  ConvertOptions,
  D3Data,
  D3Link,
  D3Node,
  DataFormat,
} from './layout';
import { Link, NodeContainer, piStarModel } from './piStar';

export function convert(data: DataFormat, options: ConvertOptions) {
  data = _.cloneDeep(data);
  const mode = options?.mode ?? 'piStar';
  const graph: D3Data = { nodes: [], links: [] };

  if (mode === 'piStar') {
    function insert<Type>(container: Array<Type>, content: Type) {
      if (content) {
        container.push(content);
      }
    }

    type AssignObj = NodeContainer | Link;

    function assign(obj: AssignObj, type: string): D3Node | D3Link {
      if (type === 'link') {
        obj = obj as Link;
        data = data as piStarModel;
        const id = obj.id;
        const sid = reverse[obj.source];
        const tid = reverse[obj.target];

        if (!sid || !tid) {
          throw Error('Cannot find source or target about ' + obj.id);
        }

        let name = '';
        let desc = linkNameDict[obj.type];
        if (desc === undefined) {
          throw Error(
            'Illegal link name ' + obj.type + ' of ' + obj.id,
          );
        }

        // According to https://www.cin.ufpe.br/~if716/arquivos20161/Overview-iStar-20-Language-Guide.pdf
        if (desc === 'P') {
          desc = 'contribution';
          const sty = _.find(graph.nodes, { id: sid })?.type;
          const tty = _.find(graph.nodes, { id: tid })?.type;
          if (!sty || !tty) {
            throw Error('Occur error when searching node types.');
          }
          if (sty === tty) {
            name = 'Is part of';
          } else {
            name = 'Plays';
          }
        }
        return {
          id: id,
          type: desc,
          name: name,
          source: sid,
          target: tid,
        } as D3Link;
      } else if (type === 'node') {
        data = data as piStarModel;
        obj = obj as NodeContainer;
        const desc = nodeNameDict[obj.type];
        if (desc === undefined) {
          throw Error(
            'Illegal node name ' + obj.type + ' of ' + obj.id,
          );
        }
        const id = obj.id;
        const name = obj.text;
        const x = obj.x;
        const y = obj.y;
        const [width, height] = nodeSizeDict[desc];

        reverse[id] = id;
        if (obj.nodes) {
          _.forEach(obj.nodes, (item) => (reverse[item.id] = id));
        }

        const r = (height > width ? height : width) / 2;

        return {
          id: id,
          name: name,
          type: desc,
          x: x,
          y: y,
          r: r,
          width: width,
          height: height,
        } as D3Node;
      } else {
        throw Error('Unexpected assign procedure ' + type);
      }
    }

    data = data as piStarModel;
    const reverse: { [idx: number | string]: number | string } = {};
    const width = data.diagram.width;
    const height = data.diagram.height;

    const nodeNameDict = options?.nodeName ?? nodeName;
    const nodeSizeDict = options?.nodeSize ?? nodeSize;
    const linkNameDict = options?.linkName ?? linkName;

    for (const d in data.dependencies) {
      insert(graph.nodes, assign(data.dependencies[d], 'node'));
    }
    for (const a in data.actors) {
      insert(graph.nodes, assign(data.actors[a], 'node'));
    }
    for (const o in data.orphans) {
      insert(graph.nodes, assign(data.orphans[o], 'node'));
    }
    for (const l in data.links) {
      insert(graph.links, assign(data.links[l], 'link'));
    }

    return { graph: graph, width: width, height: height };
  } else if (mode === 'd3') {
    data = data as D3Data;
    const [width, height] = [options.width, options.height];
    return { graph: data, width: width, height: height };
  } else {
    throw Error('Illegal file mode ' + mode);
  }
}
