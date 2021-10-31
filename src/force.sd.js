import * as d3 from 'd3-force'

/**
 * Use d3-force to implement the force layout algorithm
 * @param data {object} - an object with ordered node and link list
 * @param options {object} - force options
 * @param options.forceValue {number} - force value, 50 by default
 * @param options.width {number} - diagram width
 * @param options.height {number} - diagram height
 * @param options.radius {number} - a common radius for tuning parameters
 * @return { {simulation: object, nodes: [], links: []} }
 */
export function force (data, options) {
  const nodes = data.node
  const links = data.link
  const value = options?.forceValue ?? 50
  const [width, height] = [options.width, options.height]
  // const radius = options?.commonRadius ?? 50

  // function boxingForce () {
  //   for (const d of nodes) {
  //     // Of the positions exceed the box, set them to the boundary position.
  //     // You may want to include your nodes width to not overlap with the box.
  //     d.x = Math.max(d.r + radius, d.x)
  //     d.x = Math.min(width - d.r, d.x)
  //     d.y = Math.max(d.r + radius, d.y)
  //     d.y = Math.min(height - d.r, d.y)
  //   }
  // }

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(l => (l.source.r + l.target.r)))
    .force('charge', d3.forceManyBody()
      .distanceMin(value * 2)
      .distanceMax(value * 10)
      .strength(-value * 20))
    // .force('charge', d3.forceManyBody()
    //   .distanceMin(d => d.r)
    //   .distanceMax(d => d.r * 5)
    //   .strength(d => Math.sqrt(d.r) * -1))
    // .force('radius', d3.forceCollide(radius * 1.25))
    .force('radius', d3.forceCollide()
      .radius(d => d.r * 1.2))
    .force('center', d3.forceCenter(width / 2, height / 2))
    // .force('bounds', boxingForce)
    .stop()

  return { simulation, nodes, links }
}
