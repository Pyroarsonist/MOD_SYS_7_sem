import _ from 'lodash';

const visit = (start, result = { places: [], transitions: [] }) => {
  if (_.includes(result.places, start)) {
    return result;
  }

  result.places.push(start);

  const transitions = start.outputs();

  if (transitions.length === 0) {
    return result;
  }

  result.transitions = [...result.transitions, ...transitions];

  _.each(transitions, (transition) => {
    _.each(transition.outputs(), (place) => {
      visit(place, result);
    });
  });

  return result;
};

class Net {
  transitions = null;
  places = null;
  start = null;

  constructor(start) {
    this.start = start;
    const visitResult = visit(this.start);

    this.transitions = visitResult.transitions;
    this.places = visitResult.places;
  }

  produce(tokens = 1) {
    this.start.tokens += tokens;
  }

  executeNextStep() {
    _.each(this.transitions, (t) => t.fire());
  }

  summary() {
    const summarize = (place) => [place.name, place.tokens].join(': ');

    return _.map(this.places, summarize);
  }

  toJSON() {
    const places = _.map(this.places, (place) => place.toJSON());

    const transitions = _.map(this.transitions, (transition) => transition.toJSON());

    return [...places, ...transitions];
  }
}

export default Net;
