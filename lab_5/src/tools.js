import unirand from 'unirand';

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const avg = (arr) => arr.reduce((acc, cal) => acc + cal, 0) / arr.length || 1;

export const erlang = (mu, k) => unirand.erlang(k, mu).random();

export const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));
