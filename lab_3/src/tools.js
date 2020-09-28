export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const avg = (arr) => arr.reduce((acc, cal) => acc + cal, 0) / arr.length || 1;
