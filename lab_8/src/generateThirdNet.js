import petri from './petri-net';

const generateThirdNet = (jobsCount) => {
  const p1 = new petri.Place('p1', 1);
  const p2 = new petri.Place('p2', 1);
  const p3 = new petri.Place('p3');
  const p4 = new petri.Place('p4');
  const p5 = new petri.Place('p5', 1);
  const p6 = new petri.Place('p6');
  const p7 = new petri.Place('p7', jobsCount);

  const t1 = new petri.Transition('t1');
  const t2 = new petri.Transition('t2');
  const t3 = new petri.Transition('t3');

  const arc1 = new petri.Arc(p1, t1);
  const arc2 = new petri.Arc(t1, p1);
  const arc3 = new petri.Arc(t1, p3);
  const arc4 = new petri.Arc(p7, t1, jobsCount);
  const arc5 = new petri.Arc(p7, t2, jobsCount / 3);
  const arc6 = new petri.Arc(p7, t3, jobsCount / 2);
  const arc7 = new petri.Arc(t1, p7, jobsCount);
  const arc8 = new petri.Arc(t2, p7, jobsCount / 3);
  const arc9 = new petri.Arc(t3, p7, jobsCount / 2);
  const arc10 = new petri.Arc(t2, p4);
  const arc11 = new petri.Arc(t2, p5);
  const arc12 = new petri.Arc(p5, t2);
  const arc13 = new petri.Arc(t3, p2);
  const arc14 = new petri.Arc(p2, t3);
  const arc15 = new petri.Arc(t3, p6);

  const transitions = [t1, t2, t3];
  const places = [p1, p2, p3, p4, p5, p6, p7];
  const arcs = [arc1, arc2, arc3, arc4, arc5, arc6, arc7, arc8, arc9, arc10, arc11, arc12, arc13, arc14, arc15];

  const net = new petri.Net(transitions, places, arcs);
  net.isThirdTask = true;

  return net;
};

export default generateThirdNet;
