import debugHandler from 'debug';
import petri from './petri-net';

const debug = debugHandler('lab:main');

const generateNet = () => {
  const p1 = new petri.Place('p1', 10);
  const p2 = new petri.Place('p2');
  const p3 = new petri.Place('p3');
  const p4 = new petri.Place('p4');
  const p5 = new petri.Place('p5');

  const t1 = new petri.Transition('t1');
  const t2 = new petri.Transition('t2');
  const t3 = new petri.Transition('t3');

  const arc1 = new petri.Arc(p1, t1);
  const arc2 = new petri.Arc(t1, p2, 5);
  const arc3 = new petri.Arc(t1, p3);
  const arc4 = new petri.Arc(p3, t2);
  const arc5 = new petri.Arc(t2, p1);
  const arc6 = new petri.Arc(p4, t2);
  const arc7 = new petri.Arc(p3, t3);
  const arc8 = new petri.Arc(t3, p5);

  const transitions = [t1, t2, t3];
  const places = [p1, p2, p3, p4, p5];
  const arcs = [arc1, arc2, arc3, arc4, arc5, arc6, arc7, arc8];

  const net = new petri.Net(transitions, places, arcs);

  return net;
};

const net = generateNet();

debug('Start simulation');
net.simulate(1000, false, true);

debug('End simulation');

/*
      p1 (start with 10 tokens)  ->  t1  ->  p2
                                         ->  p3 -> p1
 */
