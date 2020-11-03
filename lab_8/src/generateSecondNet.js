import petri from './petri-net';

const generateSecondNet = (n) => {
  const p1 = new petri.Place('p1', 1);
  const p2 = new petri.Place('p2');
  const p3 = new petri.Place('p3');
  const p4 = new petri.Place('p4', n);

  const t1 = new petri.Transition('t1');
  const t2 = new petri.Transition('t2');

  const arc1 = new petri.Arc(p1, t1);
  const arc2 = new petri.Arc(t1, p1);
  const arc3 = new petri.Arc(t1, p2);
  const arc4 = new petri.Arc(p2, t2);
  const arc5 = new petri.Arc(t2, p3);
  const arc6 = new petri.Arc(t2, p4);
  const arc7 = new petri.Arc(p4, t1);

  const transitions = [t1, t2];
  const places = [p1, p2, p3, p4];
  const arcs = [arc1, arc2, arc3, arc4, arc5, arc6, arc7];

  const net = new petri.Net(transitions, places, arcs);

  return net;
};

export default generateSecondNet;
