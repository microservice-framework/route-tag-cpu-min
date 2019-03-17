'use strict'

const debug = {
  log: require('debug')('tag-cpu-min:log'),
  debug: require('debug')('tag-cpu-min:debug')
};

module.exports = {
  name: 'cpu-min',
  type: 'request',
  handler: function(taggedTargets, config, allTargets, targetRequest){
    debug.debug('processing cpu-min %O', config)
    let minCPUTarget = false
    let minCPUValue = 0
    let currentCPUValue = 0
    let reduceFunction = function(a, b) {
      let acpu = a.cpu
      if (typeof acpu == "string") {
        acpu = parseFloat(acpu)
      }
      let bcpu = b.cpu
      if (typeof bcpu == "string") {
        bcpu = parseFloat(bcpu)
      }
      return a + b
    }

    for (let i in taggedTargets) {
      if (minCPUTarget === false) {
        if (taggedTargets[i].metrics) {
          minCPUValue = taggedTargets[i].metrics.reduce(reduceFunction);
          minCPUTarget = taggedTargets[i]
        }
        continue
      }
      if (taggedTargets[i].metrics) {
        currentCPUValue = taggedTargets[i].metrics.reduce(reduceFunction)
        if (currentCPUValue < minCPUValue) {
          minCPUTarget = taggedTargets[i]
        }
      }
    }
    let voteSize = 1
    if (config.voteSize) {
      voteSize = config.voteSize
    }
    if (!minCPUTarget) {
      debug.debug('no target found in %O', taggedTargets)
      return
    }
    if (!minCPUTarget.vote) {
      minCPUTarget.vote = 0
    }
    minCPUTarget.vote += voteSize
    debug.debug('Applied vote:%d (total: %d) to %O',voteSize, minCPUTarget.vote,minCPUTarget)
  }
}
