const {plot, stack} = require('nodeplotlib');
const {distributions, ITEMS_NUM, randomFunctions, tools} = require('./main')
const _ = require('lodash')
const ss = require('simple-statistics')


const lambdas = [-1, 1, 2, 3, 10]
const defaultArrs = lambdas.map(lambda => [...Array(ITEMS_NUM)].map(() => randomFunctions.first(0.5, lambda)))
const arrs = lambdas.map(lambda => [...Array(ITEMS_NUM)].map(() => randomFunctions.first(Math.random(), lambda)))

const distributionsArrs = lambdas.map((lambda, i) => arrs[i].map(x => distributions.exp(x, lambda)))
const data = lambdas.map((l, i) => ({x: arrs[i], y: distributionsArrs[i], type: 'histogram'}))

data.forEach((d, i) => {
    stack([d])

    console.log(`${i + 1} arr, lambda: ${lambdas[i]}`)
    console.log(`Average: ${tools.average(d.x)}`)
    console.log(`Dispersion: ${tools.dispersion(d.x)}`)
    console.log(`Chi squared test: ${tools.chi(d.x, defaultArrs[i])}`)
    console.log(`Default chi: ${ss.chiSquaredDistributionTable["1"]["0.05"]}`)
    console.log('\n')

})
plot();