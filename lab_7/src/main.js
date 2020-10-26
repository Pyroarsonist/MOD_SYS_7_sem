import _ from 'lodash';
import debugHandler from 'debug';
import petri from './petri-net';

const debug = debugHandler('lab:main');

const p1 = new petri.Place('p1'),
  p2 = new petri.Place('p2'),
  p3 = new petri.Place('p3'),
  t1 = new petri.Transition('t1', [p1], [p2, p3]),
  net = new petri.Net(p1);

/*
      p1 (start with 10 tokens)  ->  t1  ->  p2
                                         ->  p3
 */

net.produce(10);
// t1.on('fire', function () {
//   debug('t1 fired');
// });

_.times(5, (i) => {
  debug(`Step ${i + 1}`);
  debug(net.toJSON());
  debug('\n\n\n');
  net.executeNextStep();
});
