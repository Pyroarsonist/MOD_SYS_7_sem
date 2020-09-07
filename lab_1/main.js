'use strict'

const fs = require('fs');
// const {convertArrayToCSV} = require('convert-array-to-csv');
const _ = require('lodash')


const randomFunctions = {
    first: (randomValue, lambda) => -1 / lambda * Math.log(randomValue),
    second: (randomValue, sigma, a) => {
        const mu = _.sum(Array.from({length: 12}).map(() => randomValue)) - 6;
        return sigma * mu + a
    },
    third: (randomValue, a = 5 ** 13, c = 2 ** 31, i = 1) => {
        const arr = [1, 1];
        const zFunc = (iVal) => {
            // if (iVal === 0) return 1;
            if (arr[iVal]) return arr[iVal];

            const val = a * zFunc(iVal - 1) % c;
            arr[iVal] = val;
            return val;
        }

        const z = zFunc(i);
        return z / c;
    }
}

const distributions = {
    exp: (x, lambda) => 1 - Math.E ** (-lambda * x),
    normal: (x, sigma, a) => (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - a) ** 2 / (2 * sigma ** 2))),
    uniform: (x, a, b) => {
        if (x <= a) return 0
        if (x > b) return 1

        return (x - a) / (b - a)
    }
}

const tools = {
    average: (arr) => {
        return _.sum(arr) / arr.length
    },
    dispersion: (arr) => {
        const avg = tools.average(arr)

        const sum = arr.reduce((acc, x) => {
            const n = (x - avg) ** 2;
            return acc + n;
        }, 0)
        return sum / (arr.length - 1);
    },
    chi: (arr, expectedArr) => {
        let hi = 0;
        for (let i = 0; i < arr.length; i++) {
            hi += (arr[i] - expectedArr[i]) ** 2 / (expectedArr[i]);
        }
        return hi / arr.length;
    }
}

const ITEMS_NUM = 10000;


// const csv = convertArrayToCSV(firstArr.map(x => [nf.format(x)]));
// const csv = convertArrayToCSV(f.map(x => [nf.format(x)]));
//
// fs.writeFileSync('./data.csv', csv);

module.exports = {
    randomFunctions,
    distributions,
    ITEMS_NUM,
    tools
}
