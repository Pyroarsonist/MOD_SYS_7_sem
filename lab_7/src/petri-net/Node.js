import { EventEmitter } from 'events';
import _ from 'lodash';

class Node extends EventEmitter {
  inputArcs = [];
  outputArcs = [];
  name = null;

  constructor(name) {
    super();
    this.name = name;
  }

  inputs() {
    return _.map(this.inputArcs, 'input');
  }

  outputs() {
    return _.map(this.outputArcs, 'output');
  }

  toJSON() {
    return {
      name: this.name,
    };
  }
}

export default Node;
