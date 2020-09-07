const {plot, stack} = require('nodeplotlib');
const {distributions, ITEMS_NUM, randomFunctions, tools} = require('./main')
const _ = require('lodash')
const ss = require('simple-statistics')


const constants = [{lambda: -1, sigma: 1}, {lambda: 1, sigma: 2}, {lambda: 2, sigma: 0.5}, {
    lambda: 3,
    sigma: 0.3
}, {lambda: 10, sigma: 5}];
const defaultArrs = constants.map(c => [...Array(ITEMS_NUM)].map(() => randomFunctions.second(0.5, c.sigma, c.lambda)))
const arrs = constants.map(c => [...Array(ITEMS_NUM)].map(() => randomFunctions.second(Math.random(), c.sigma, c.lambda)))

const intervals = arrs.map(arr => tools.intervals(arr))
const intervalLabels = arrs.map(arr => tools.intervalLabels(arr))

const distributionsArrs = constants.map((c, i) => arrs[i].map(x => distributions.normal(x, c.sigma, c.lambda)))
const data = constants.map((l, i) => [({x: intervalLabels[i], y: intervals[i], type: 'line'}), {
    x: arrs[i],
    y: distributionsArrs[i],
    type: 'histogram'
}]);
data.forEach((d, i) => {
    stack(d)

    const degreeOfFreedom = d[0].x.length - 1

    console.log(`${i + 1} arr, lambda: ${constants[i].lambda}, sigma: ${constants[i].sigma}`)
    console.log(`Average: ${tools.average(arrs[i])}`)
    console.log(`Dispersion: ${tools.dispersion(arrs[i])}`)
    const chi = tools.chi(arrs[i], defaultArrs[i])
    console.log(`Chi squared test: ${chi}`)
    console.log(`Degree of freedom: ${degreeOfFreedom}`)
    const criteriaChi = ss.chiSquaredDistributionTable[degreeOfFreedom]["0.05"]
    console.log(`Criteria chi: ${criteriaChi}`)
    console.log(`Chi test passed: ${chi < criteriaChi}`)
    console.log('\n')
})
plot();