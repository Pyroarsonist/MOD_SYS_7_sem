import { EventEmitter } from 'events';
import _ from 'lodash';

class Node extends EventEmitter {
  inputArcs = [];
  outputArcs = [];
  name = null;
  type = 'node';

  constructor(name) {
    super();
    this.name = name;
  }

  inputs() {
    return this.inputArcs.map((arc) => arc.input);
  }

  outputs() {
    return this.outputArcs.map((arc) => arc.output);
  }

  toJSON() {
    return {
      name: this.name,
      type: this.type,
      input: this.inputs().map((n) => n.name),
      output: this.outputs().map((n) => n.name),
    };
  }
}

export default Node;
