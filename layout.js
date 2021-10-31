import { convert } from './convert'
import { force } from './force.sd'
import _ from 'lodash'

export function layout (data, options) {
  const lOptions = options.layout
  const cOptions = options.convert
  const fOptions = options.force

  const mode = lOptions.mode ? lOptions.mode : 'generator'
  const tick = lOptions.tickPerEpoch ? lOptions.tickPerEpoch : 50
  const epoch = lOptions.assureEpoch ? lOptions.assureEpoch : 20
  const stable = lOptions.stopWhenStable ? lOptions.stopWhenStable : true

  const jsonData = convert(data, cOptions)
  if (!(fOptions.width && fOptions.height)) {
    if ((lOptions.width && lOptions.height)) {
      [fOptions.width, fOptions.height] = [lOptions.width, lOptions.height]
    } else {
      [fOptions.width, fOptions.height] = [jsonData.width, jsonData.height]
    }
  }

  const forceResult = force(_.cloneDeep(jsonData.graph), fOptions)
  const { simulation, nodes, links } = forceResult

  let current = 0

  function simulationEpoch (tick) {
    for (let i = 0; i < tick; i++) {
      simulation.tick()
    }
  }

  function keep (current, atLeastEpoch, needStable, simulation) {
    return ((current <= atLeastEpoch) || (needStable && simulation.alpha() >= 0.001))
  }

  function * generator () {
    while (keep(current, epoch, stable, simulation)) {
      simulationEpoch(tick)
      current += 1
      yield { current, nodes, links }
    }
  }

  function generalOutput (mode) {
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
    } else if (mode === 'once') {
      return _.cloneDeep({ current, nodes, links })
    }
  }

  if (mode === 'generator') {
    return generator
  } else if (mode === 'array') {
    return generalOutput(mode)
  } else if (mode === 'once') {
    return generalOutput(mode)
  } else {
    throw Error('Illegal result format ' + mode)
  }
}
