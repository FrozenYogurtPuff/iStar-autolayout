import { nodeName, nodeSize, linkName } from './dictionary'
import _ from 'lodash'

export function convert (d, options) {
  const data = _.cloneDeep(d)
  const mode = options.mode ? options.mode : 'piStar'
  const graph = { node: [], link: [] }

  if (mode === 'piStar') {
    function insert (container, content) {
      if (content) {
        container.push(content)
      }
    }
    function assign (obj, type) {
      if (type === 'link') {
        const id = obj.id
        const sid = reverse[obj.source]
        const tid = reverse[obj.target]

        if (!sid || !tid) { throw Error('Cannot find source or target about ' + obj.id) }
        if (sid === tid) { return null }

        let name = ''
        let desc = linkNameDict[obj.type]
        if (desc === undefined) { throw Error('Illegal link name ' + obj.type + ' of ' + obj.id) }

        // According to https://www.cin.ufpe.br/~if716/arquivos20161/Overview-iStar-20-Language-Guide.pdf
        if (desc === 'P') {
          desc = 'contribution'
          const sty = _.find(graph.node, { id: sid }).type
          const tty = _.find(graph.node, { id: tid }).type
          if (sty === tty) { name = 'Is part of' } else { name = 'Plays' }
        }
        return { id: id, type: desc, name: name, source: sid, target: tid }
      } else if (type === 'node') {
        const desc = nodeNameDict[obj.type]
        if (desc === undefined) { throw Error('Illegal node name ' + obj.type + ' of ' + obj.id) }
        const id = obj.id
        const name = obj.text
        const x = obj.x
        const y = obj.y
        const [width, height] = nodeSizeDict[desc]
        let collapsed = null

        reverse[id] = id
        if (obj.nodes) {
          _.forEach(obj.nodes, item => (reverse[item.id] = id))
          collapsed = data.display[id] && data.display[id].collapsed
        }

        const r = (height > width ? height : width) / 2

        return {
          id: id,
          name: name,
          type: desc,
          x: x,
          y: y,
          r: r,
          width: width,
          height: height,
          collapsed: collapsed
        }
      } else {
        throw Error('Unexpected assign procedure ' + type)
      }
    }

    const reverse = {}
    const width = data.diagram.width
    const height = data.diagram.height

    const nodeNameDict = options.nodeName ? options.nodeName : nodeName
    const nodeSizeDict = options.nodeSize ? options.nodeSize : nodeSize
    const linkNameDict = options.linkName ? options.linkName : linkName

    for (const d in data.dependencies) { insert(graph.node, assign(data.dependencies[d], 'node')) }
    for (const a in data.actors) { insert(graph.node, assign(data.actors[a], 'node')) }
    for (const o in data.orphans) { insert(graph.node, assign(data.orphans[o], 'node')) }
    for (const l in data.links) { insert(graph.link, assign(data.links[l], 'link')) }

    return { graph: graph, width: width, height: height }
  } else if (mode === 'd3') {
    const [width, height] = [options.width, options.height]
    return { graph: data, width: width, height: height }
  } else {
    throw Error('Illegal file mode ' + mode)
  }
}
