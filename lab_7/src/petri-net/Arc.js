class Arc {
  input = null;
  output = null;
  multiplicity = null;

  place = null;
  transition = null;

  constructor(input, output, multiplicity = 1) {
    this.input = input;
    this.output = output;
    this.multiplicity = multiplicity;

    this.transition = [input, output].find((x) => x.type === 'transition');
    this.place = [input, output].find((x) => x.type === 'place');

    input.outputArcs.push(this);
    output.inputArcs.push(this);
  }

  isAvailable() {
    return this.place.tokens >= this.multiplicity;
  }
  setOutputMarking() {
    this.place.tokens += this.multiplicity;
  }
  setInputMarking() {
    this.place.tokens -= this.multiplicity;
  }
}

export default Arc;
