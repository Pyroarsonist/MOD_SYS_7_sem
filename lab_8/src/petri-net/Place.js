import _ from 'lodash';
import Node from './Node';

class Place extends Node {
  tokensCount = 0;
  type = 'place';

  // optional metadata
  metadata = { observableTokensCountArr: [] };

  constructor(name, tokens = 0) {
    super(name);
    this.tokens = tokens;
  }

  get tokens() {
    return this.tokensCount;
  }

  set tokens(tokens) {
    this.tokensCount = tokens;

    this.saveStats(tokens);
  }

  saveStats(tokens) {
    // saving optional metadata
    this.metadata.observableTokensCountArr.push(tokens);
  }

  summarize() {
    return {
      avg: _.sum(this.metadata.observableTokensCountArr) / this.metadata.observableTokensCountArr.length,
      max: _.max(this.metadata.observableTokensCountArr),
      min: _.min(this.metadata.observableTokensCountArr),
    };
  }

  toJSON() {
    return {
      ...super.toJSON(),
      tokens: this.tokens,
    };
  }
}

export default Place;
