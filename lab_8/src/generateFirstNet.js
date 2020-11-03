import petri from './petri-net';

const generateFirstNet = () => {
  const p1 = new petri.Place('p1', 1);
  const p2 = new petri.Place('p2');
  const p3 = new petri.Place('p3');
  const p4 = new petri.Place('p4', 1);
  const p5 = new petri.Place('p5');
  const p6 = new petri.Place('p6', 1);
  const p7 = new petri.Place('p7', 1);
  const p8 = new petri.Place('p8');
  const p9 = new petri.Place('p9');
  const p10 = new petri.Place('p10');
  const p11 = new petri.Place('p11', 1);
  const p12 = new petri.Place('p12', 1);

  const t1 = new petri.Transition('t1');
  const t2 = new petri.Transition('t2');
  const t3 = new petri.Transition('t3');
  const t4 = new petri.Transition('t4');
  const t5 = new petri.Transition('t5');
  const t6 = new petri.Transition('t6');

  const arc1 = new petri.Arc(p1, t1);
  const arc2 = new petri.Arc(t1, p1);
  const arc3 = new petri.Arc(p4, t1);
  const arc4 = new petri.Arc(t3, p4);
  const arc5 = new petri.Arc(t3, p5);
  const arc6 = new petri.Arc(p3, t3);
  const arc7 = new petri.Arc(t2, p3);
  const arc8 = new petri.Arc(p2, t2);
  const arc9 = new petri.Arc(t1, p2);
  const arc10 = new petri.Arc(t2, p6);
  const arc11 = new petri.Arc(p6, t1);
  const arc12 = new petri.Arc(t3, p7);
  const arc13 = new petri.Arc(p7, t3);
  const arc14 = new petri.Arc(t4, p6);
  const arc15 = new petri.Arc(p6, t4);
  const arc16 = new petri.Arc(t4, p8);
  const arc17 = new petri.Arc(p9, t4);
  const arc18 = new petri.Arc(t5, p9);
  const arc19 = new petri.Arc(p10, t5);
  const arc20 = new petri.Arc(t6, p10);
  const arc21 = new petri.Arc(t5, p7);
  const arc22 = new petri.Arc(p7, t6);
  const arc23 = new petri.Arc(p11, t6);
  const arc24 = new petri.Arc(t6, p11);
  const arc25 = new petri.Arc(t4, p12);
  const arc26 = new petri.Arc(p12, p6);

  const transitions = [t1, t2, t3, t4, t5, t6];
  const places = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12];
  const arcs = [
    arc1,
    arc2,
    arc3,
    arc4,
    arc5,
    arc6,
    arc7,
    arc8,
    arc9,
    arc10,
    arc11,
    arc12,
    arc13,
    arc14,
    arc15,
    arc16,
    arc17,
    arc18,
    arc19,
    arc20,
    arc21,
    arc22,
    arc23,
    arc24,
    arc25,
    arc26,
  ];

  const net = new petri.Net(transitions, places, arcs);

  return net;
};

export default generateFirstNet;
