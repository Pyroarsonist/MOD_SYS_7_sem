const {plot, stack} = require('nodeplotlib');
const {distributions, ITEMS_NUM, randomFunctions, tools} = require('./main')
const _ = require('lodash')
const ss = require('simple-statistics')


const lambdas = [-1, 1, 2, 3, 10]
const defaultArrs = lambdas.map(lambda => [...Array(ITEMS_NUM)].map(() => randomFunctions.first(0.5, lambda)))
const arrs = lambdas.map(lambda => [...Array(ITEMS_NUM)].map(() => randomFunctions.first(Math.random(), lambda)))

const intervals = arrs.map(arr => tools.intervals(arr))
const intervalLabels = arrs.map(arr => tools.intervalLabels(arr))


const distributionsArrs = lambdas.map((lambda, i) => arrs[i].map(x => distributions.exp(x, lambda)))
const data = lambdas.map((l, i) => [({x: intervalLabels[i], y: intervals[i], type: 'line'}), {
    x: arrs[i],
    y: distributionsArrs[i],
    type: 'histogram'
}]);


data.forEach((d, i) => {
    stack(d)

    const degreeOfFreedom = d[0].x.length - 1

    console.info(`${i + 1} arr, lambda: ${lambdas[i]}`)
    console.info(`Average: ${tools.average(arrs[i])}`)
    console.info(`Dispersion: ${tools.dispersion(arrs[i])}`)
    const chi = tools.chi(arrs[i], defaultArrs[i])
    console.info(`Chi squared test: ${chi}`)
    console.info(`Degree of freedom: ${degreeOfFreedom}`)
    const criteriaChi = ss.chiSquaredDistributionTable[degreeOfFreedom]["0.05"]
    console.info(`Criteria chi: ${criteriaChi}`)
    console.info(`Chi test passed: ${chi < criteriaChi}`)
    console.info('\n')

})
plot();