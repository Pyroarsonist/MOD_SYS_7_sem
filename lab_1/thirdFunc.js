const {plot, stack} = require('nodeplotlib');
const {distributions, ITEMS_NUM, randomFunctions, tools} = require('./main')
const _ = require('lodash')
const ss = require('simple-statistics')


const constants = [{a: -1, c: 1}, {a: 1, c: 0.2}, {a: 3, c: 2}, {a: 5, c: 10}, {a: 10, c: 4}];
const defaultArrs = constants.map(constant => [...Array(ITEMS_NUM)].map(() => randomFunctions.third(0.5, constant.a, constant.c)))
const arrs = constants.map(lambda => [...Array(ITEMS_NUM)].map(() => randomFunctions.third(Math.random(), lambda)))

const distributionsArrs = constants.map((constant, i) => arrs[i].map(x => distributions.uniform(x, constant.a, constant.c)))
const data = constants.map((constant, i) => ({x: arrs[i], y: distributionsArrs[i], type: 'histogram'}))

data.forEach((d, i) => {
    stack([d])

    console.log(`${i + 1} arr, a: ${constants[i].a}, c: ${constants[i].c}`)
    console.log(`Average: ${tools.average(d.x)}`)
    console.log(`Dispersion: ${tools.dispersion(d.x)}`)
    console.log(`Chi squared test: ${tools.chi(d.x, defaultArrs[i])}`)
    console.log(`Default chi: ${ss.chiSquaredDistributionTable["1"]["0.05"]}`)
    console.log('\n')

})
plot();