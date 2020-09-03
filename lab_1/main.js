const fs = require('fs');
const {convertArrayToCSV} = require('convert-array-to-csv');


const randomFunctions = {
    first: (lambda) => -1 / lambda * Math.log(Math.random()),
    second: (sigma, a) => {
        const mu = Array(11).map(() => Math.random()).reduce((acc, item) => acc + item, 0) - 6;
        return sigma * mu + a
    },
    third: (a = 5 ** 13, c = 2 ** 31, i = 1) => {
        const zFunc = () => {
            if (i === 0) return 1;
            return a * zFunc(i - 1) % c
        }

        const z = zFunc();
        return z / c;
    }
}

const distributions = {
    first: (x, lambda) => 1 - Math.E ** (-lambda * x),
    second: (x, sigma, a) => (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - a) ** 2 / (2 * sigma ** 2))),
    third: (x, a, b) => {
        if (x <= a) return 0
        if (x > b) return 1

        return (x - a) / (b - a)
    }
}

const ITEMS_NUM = 10000;
const nf = new Intl.NumberFormat('uk-UA');


const lambda = 1;
const firstArr = [...Array(ITEMS_NUM)].map(() => randomFunctions.first(lambda))
const f = firstArr.map(x => distributions.first(x, 1))
// console.log()

// const csv = convertArrayToCSV(firstArr.map(x => [nf.format(x)]));
const csv = convertArrayToCSV(f.map(x => [nf.format(x)]));

fs.writeFileSync('./data.csv', csv);


