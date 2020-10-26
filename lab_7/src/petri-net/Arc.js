class Arc {
  input = null;
  output = null;

  constructor(input, output) {
    this.input = input;
    this.output = output;

    input.outputArcs.push(this);
    output.inputArcs.push(this);
  }
}

export default Arc;
