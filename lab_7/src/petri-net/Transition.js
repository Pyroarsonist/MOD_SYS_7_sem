import _ from 'lodash';
import Node from './Node';
import Arc from './Arc';

class Transition extends Node {
  isFired = false;
  type = 'transition';

  constructor(name) {
    super(name);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      isFired: this.isFired,
    };
  }

  consumeInputTokens() {
    this.inputArcs.forEach((x) => x.setInputMarking());
    this.isFired = true;
  }
  produceOutputTokens() {
    this.outputArcs.forEach((x) => x.setOutputMarking());
    this.isFired = false;
  }

  isAvailable() {
    return this.inputArcs.every((x) => x.isAvailable());
  }

  getInputPlaces() {
    return this.inputArcs.map((arc) => arc.place);
  }
}

export default Transition;
