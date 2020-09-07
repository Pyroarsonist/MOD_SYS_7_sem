const {plot, stack} = require('nodeplotlib');
const {distributions, ITEMS_NUM, randomFunctions, tools} = require('./main')
const _ = require('lodash')
const ss = require('simple-statistics')


const constants = [{a: -1, c: 1}, {a: 1, c: 0.2}, {a: 3, c: 2}, {a: 5, c: 10}, {a: 10, c: 4}];
const defaultArrs = constants.map(constant => [...Array(ITEMS_NUM)].map(() => randomFunctions.third(0.5, constant.a, constant.c)))
const arrs = constants.map(lambda => [...Array(ITEMS_NUM)].map(() => randomFunctions.third(Math.random(), lambda)))


const intervals = arrs.map(arr => tools.intervals(arr))
const intervalLabels = arrs.map(arr => tools.intervalLabels(arr))

const distributionsArrs = constants.map((constant, i) => arrs[i].map(x => distributions.uniform(x, constant.a, constant.c)))
const data = constants.map((l, i) => [({x: intervalLabels[i], y: intervals[i], type: 'line'}), {
    x: arrs[i],
    y: distributionsArrs[i],
    type: 'histogram'
}]);
data.forEach((d, i) => {
    stack(d)

    const degreeOfFreedom = d[0].x.length - 1


    console.log(`${i + 1} arr, a: ${constants[i].a}, c: ${constants[i].c}`)
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