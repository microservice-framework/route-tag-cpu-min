'use strict'

const debug = {
  log: require('debug')('tag-cpu-min:log'),
  debug: require('debug')('tag-cpu-min:debug')
};

module.exports = {
  name: 'cpu-min',
  handler: function(endpointTargets, config){
    debug.debug('processing cpu-min %O', config)
    let minCPUTarget = false
    let minCPUValue = 0
    let currentCPUValue = 0
    for (let i in endpointTargets) {
      if (!minCPU) {
        minCPUTarget = endpointTargets[i]
        if (minCPU.metrics) {
          minCPUValue = endpointTargets[i].metrics.reduce(function(a, b) {
            return parseFloat(a.cpu) + parseFloat(b.cpu)
          });
        }
        continue
      }
      if (endpointTargets[i].metrics) {
        currentCPUValue = endpointTargets[i].metrics.reduce(function(a, b) {
          let acpu = a.cpu
          if (typeof acpu == "string") {
            acpu = parseFloat(acpu)
          }
          let bcpu = b.cpu
          if (typeof bcpu == "string") {
            bcpu = parseFloat(bcpu)
          }
          return a + b
        })
        if (currentCPUValue < minCPUValue) {
          minCPUTarget = endpointTargets[i]
        }
      }
    }
    let voteSize = 1
    if (config.voteSize) {
      voteSize = config.voteSize
    }
    if (!minCPUTarget) {
      debug.debug('no target found in %O', endpointTargets)
      return
    }
    if (!minCPUTarget.vote) {
      minCPUTarget.vote = 0
    }
    minCPUTarget.vote += voteSize
    debug.debug('Applied vote:%d (total: %d) to %O',voteSize, minCPUTarget.vote,minCPUTarget)
  }
}
