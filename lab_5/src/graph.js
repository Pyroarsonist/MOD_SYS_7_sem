import { main } from './main';
import { plot, stack } from 'nodeplotlib';

const nArr = [...Array(30)].map((_, i) => i + 1);

const graph = async () => {
  const results = await Promise.all(nArr.map((n) => main(n)));

  stack([{ x: nArr, y: results, type: 'line' }]);
  plot();
};

graph();
