import { nodeName, nodeSize, linkName } from './dictionary'
import _ from 'lodash'

/**
 * Convert different format JSON into ordered nodes and links list.
 * @param data {object} - a piStar-format or d3-format JSON, depending on the value of options.mode
 * @param options {object} - convert options
 * @param options.mode {string} - 'piStar' or 'd3'
 * @param options.nodeName {string} - mapping piStar's node describe to standard format
 * @param options.nodeSize {string} - a dictionary about node size in piStar
 * @param options.linkName {string} - mapping piStar's link describe to standard format
 * @returns { {width, graph: {node: [], link: []}, height} }
 */
export function convert (data, options) {
  data = _.cloneDeep(data)
  const mode = options?.mode ?? 'piStar'
  const graph = { node: [], link: [] }

  if (mode === 'piStar') {
    /**
     * Push the content into container when valid
     * @param container
     * @param content
     */
    function insert (container, content) {
      if (content) {
        container.push(content)
      }
    }

    /**
     * Handle various element based on its type
     * @param obj {Object} - the source element item
     * @param type {String} - element type, usually 'link' or 'node'
     * @return { {r: number, collapsed: boolean | null, name: string, x: number, y: number,
     *           id: string, type: string, width: number, height: number} |
     *         {name: string, id: string, type: string, source: string, target: string} |
     *         null }
     */
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

    const nodeNameDict = options?.nodeName ?? nodeName
    const nodeSizeDict = options?.nodeSize ?? nodeSize
    const linkNameDict = options?.linkName ?? linkName

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
