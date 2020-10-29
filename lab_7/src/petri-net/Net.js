import _ from 'lodash';
import debugHandler from 'debug';

const debug = debugHandler('lab:net');

class Net {
  transitions = null;
  places = null;
  arcs = null;

  constructor(transitions, places, arcs) {
    this.transitions = transitions;
    this.places = places;
    this.arcs = arcs;
  }

  removeNeighbours(_transitions) {
    const transitions = _.shuffle(_transitions);

    for (let i = 0; i < transitions.length; i++) {
      const t = transitions[i];
      const currentPlaces = t.getInputPlaces();

      for (let j = i + 1; j < transitions.length; j++) {
        const deepT = transitions[j];
        const nextPlaces = deepT.getInputPlaces();

        const intersection = _.intersectionBy(currentPlaces, nextPlaces);

        if (intersection.length === 0) {
          continue;
        }

        if (_.sample([true, false])) {
          transitions.splice(i, 1);
          i--;
          break;
        } else {
          transitions.splice(j, 1);
          j--;
        }
      }
    }

    return transitions;
  }

  executeNextStep() {
    const firedTransition = this.transitions.find((x) => x.isFired);

    if (firedTransition) {
      firedTransition.produceOutputTokens();
    }

    const availableTransitions = this.removeNeighbours(this.transitions.filter((x) => x.isAvailable()));
    if (!availableTransitions.length) {
      return;
    }

    _.sample(availableTransitions).consumeInputTokens();
  }

  summary() {
    const summarize = (node) => ({
      ...node.toJSON(),
      ...node?.summarize?.(),
    });

    return [...this.places, ...this.transitions].map((n) => summarize(n));
  }

  toJSON() {
    return [...this.places, ...this.transitions].map((x) => x.toJSON());
  }

  simulate(steps, withDebug = true, withSummary = true) {
    _.times(steps, (i) => {
      if (withDebug) {
        debug(`Step ${i + 1}`);
        debug('Before: %O\n\n', this.toJSON());
        debug('\n\n\n');
      }
      this.executeNextStep();
      if (withDebug) debug('After: %O\n\n', this.toJSON());
    });

    if (withSummary) debug(`Summary: %O`, this.summary());
  }
}

export default Net;
