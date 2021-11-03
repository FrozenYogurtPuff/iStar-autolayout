import { convert } from './convert'
import { force } from './force.sd'
import _ from 'lodash'

/**
 * Main entrypoint for layout handling
 * @param data {object} - a piStar-format or d3-format JSON
 * @param options {object | null} - the options collection
 *
 * @param options.layout {object} - layout options
 * @param options.layout.mode {string} - layout return data format, usually 'generator', 'array', 'first' or 'last'
 * @param options.layout.tickPerEpoch {number} - ticks per iteration epoch
 * @param options.layout.assureEpoch {number} - assure at least iterate epochs
 * @param options.layout.stopWhenStable {boolean} - do not stop until stable (alpha value under a threshold)
 * @param options.layout.width {number} - diagram width
 * @param options.layout.height {number} - diagram height
 *
 * @param options.convert {object} - convert options
 * @param options.force {object} - force options
 * @return { (function(): Generator<{current: number, nodes: [], links: []}, void, *>) |
 *          {current: number, nodes: [], links: []} | {current: number, nodes: [], links: []}[] }
 */
export function layout (data, options) {
  const lOptions = options?.layout ?? { }
  const cOptions = options?.convert ?? { }
  const fOptions = options?.force ?? { }

  const mode = lOptions?.mode ?? 'generator'
  const tick = lOptions?.tickPerEpoch ?? 50
  const epoch = lOptions?.assureEpoch ?? 20
  const stable = lOptions?.stopWhenStable ?? true

  const jsonData = convert(data, cOptions)
  if (!(fOptions?.width && fOptions?.height)) {
    if ((lOptions?.width && lOptions?.height)) {
      [fOptions.width, fOptions.height] = [lOptions.width, lOptions.height]
    } else {
      [fOptions.width, fOptions.height] = [jsonData.width, jsonData.height]
    }
  }

  const forceResult = force(_.cloneDeep(jsonData.graph), fOptions)
  const { simulation, nodes, links } = forceResult

  let current = 0

  /**
   * Simulate an epoch
   * @param tick {number} - ticks per iteration epoch
   */
  function simulationEpoch (tick) {
    for (let i = 0; i < tick; i++) {
      simulation.tick()
    }
  }

  /**
   * Check if the iteration keep going
   * @param current {number} - current iteration epoch
   * @param atLeastEpoch {number} - assure at least iterate epochs
   * @param needStable {boolean} - do not stop until stable (alpha value under a threshold)
   * @param simulation {object} - d3-force simulation object
   * @return {boolean} - keep iterate
   */
  function keep (current, atLeastEpoch, needStable, simulation) {
    return ((current < atLeastEpoch) || (needStable && simulation.alpha() >= 0.001))
  }

  /**
   * A Generator factory for output
   * @return { Generator<{current: number, nodes: [], links: []}, void, *> }
   */
  function * generator () {
    while (keep(current, epoch, stable, simulation)) {
      simulationEpoch(tick)
      current += 1
      yield { current, nodes, links }
    }
  }

  /**
   * Gather the position data for output
   * @param mode {string} - 'array', 'first' or 'last'
   * @return { {current: number, nodes: [], links: []} | [] }
   */
  function generalOutput (mode) {
    if (mode === 'first') {
      return { current: 0, nodes, links }
    }
    const results = []
    while (keep(current, epoch, stable, simulation)) {
      simulationEpoch(tick)
      current += 1
      if (mode === 'array') {
        results.push(_.cloneDeep({ current, nodes, links }))
      }
    }
    if (mode === 'array') {
      return results
    } else if (mode === 'last') {
      return _.cloneDeep({ current, nodes, links })
    }
  }

  if (mode === 'generator') {
    return generator
  } else if (mode === 'array' || mode === 'last' || mode === 'first') {
    return generalOutput(mode)
  } else {
    throw Error('Illegal result format ' + mode)
  }
}
