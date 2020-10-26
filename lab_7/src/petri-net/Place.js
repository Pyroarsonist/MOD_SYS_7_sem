import _ from 'lodash';
import Node from './Node';

class Place extends Node {
  tokens = 0;

  constructor(name) {
    super(name);
  }

  // todo: dont use tokens var (weighted arcs)
  consume(tokens = 1) {
    if (this.tokens < tokens) {
      return;
    }

    this.tokens -= tokens;
  }

  // todo: dont use tokens var (weighted arcs)
  produce(tokens = 1) {
    this.tokens += tokens;
  }

  toJSON() {
    return _.extend(super.toJSON(), {
      type: 'place',
      tokens: this.tokens,
      transitions: _.map(this.outputs(), 'name'),
    });
  }
}

export default Place;
