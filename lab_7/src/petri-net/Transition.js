import _ from 'lodash';
import Node from './Node';
import Arc from './Arc';

class Transition extends Node {
  constructor(name, inputs, outputs) {
    super(name);

    inputs.forEach((input) => {
      new Arc(input, this);
    });

    outputs.forEach((output) => {
      new Arc(this, output);
    });
  }

  enabled() {
    const places = this.inputs();

    // todo: more then x tokens (weighted arcs)
    const placeHasToken = (p) => p.tokens > 0;

    return _.filter(places, placeHasToken).length === places.length;
  }

  fire() {
    if (!this.enabled()) return;

    _.each(this.inputs(), (p) => p.consume());
    _.each(this.outputs(), (p) => p.produce());
    this.emit('fire');
  }

  toJSON() {
    return _.extend(super.toJSON(), {
      type: 'transition',
      places: _.map(this.outputs(), 'name'),
    });
  }
}

export default Transition;
