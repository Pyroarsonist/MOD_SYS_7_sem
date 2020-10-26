import debugHandler from 'debug';

class ConsumerSystem {
  consumers = [];

  input = null;
  output = null;

  outputSystem = null;

  constructor(id) {
    this.id = id;
    this.debug = debugHandler('lab:consumer-system:' + id);
  }

  acceptJob(job) {
    this.debug(`${new Date().toISOString()} | Job #${job.id} put to queue`);

    this.input.acceptJob(job);
  }

  async end() {
    await Promise.all(this.consumers.map((c) => c.end()));
  }

  async endJob(job) {
    if (this.outputSystem) {
      this.outputSystem.acceptJob(job);
    }

    if (job.last) {
      await this.end();
    }
  }
}

export default ConsumerSystem;
