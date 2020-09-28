export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

export const avg = (arr) => arr.reduce((acc, cal) => acc + cal, 0) / arr.length || 1;
