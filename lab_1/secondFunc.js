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

const distributionsArrs = constants.map((c, i) => arrs[i].map(x => distributions.normal(x, c.sigma, c.lambda)))
const data = constants.map((c, i) => ({x: arrs[i], y: distributionsArrs[i], type: 'histogram'}))

data.forEach((d, i) => {
    stack([d])

    console.log(`${i + 1} arr, lambda: ${constants[i].lambda}, sigma: ${constants[i].sigma}`)
    console.log(`Average: ${tools.average(d.x)}`)
    console.log(`Dispersion: ${tools.dispersion(d.x)}`)
    console.log(`Chi squared test: ${tools.chi(d.x, defaultArrs[i])}`)
    console.log(`Default chi: ${ss.chiSquaredDistributionTable["1"]["0.05"]}`)
    console.log('\n')

})
plot();