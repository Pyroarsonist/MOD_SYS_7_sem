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

  executeNextStep() {
    const firedTransition = this.transitions.find((x) => x.isFired);

    if (firedTransition) {
      firedTransition.produceOutputTokens();
    }

    const availableTransitions = this.transitions.filter((x) => x.isAvailable());
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
