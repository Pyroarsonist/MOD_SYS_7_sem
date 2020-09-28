import _ from 'lodash';
import Emitter from 'events';
import moment from 'moment';
import { avg, delay } from './tools';

class Consumer extends Emitter {
  jobs = [];
  jobsDone = [];
  loaded = [];
  queueLength = [];
  id = null;
  controller = null;
  maxQueueLength = 0;

  constructor(id, controller) {
    super();

    this.id = id;
    this.controller = controller;
  }

  async consume() {
    this.loaded.push(+!!this.jobs.length);
    this.queueLength.push(this.jobs.length);

    if (this.jobs.length) {
      const job = this.jobs[0];
      console.info(`Job #${job.id} is processing on consumer #${this.id}`);
      await delay(job.time);
      job.doneAt = new Date().toISOString();
      console.info(`Job #${job.id} done for ${job.time}ms on consumer #${this.id}`);
      this.jobsDone.push(job);
      this.jobs.shift();

      if (job.last) {
        await this.controller.end();
      }
    }
  }

  canAcceptJob() {
    return this.controller.QUEUE_LIMIT > this.jobs.length;
  }

  acceptJob(job) {
    job.addedToQueueAt = new Date().toISOString();

    this.jobs.push(job);
    console.info(`Job #${job.id} put to queue on consumer #${this.id}`);

    this.maxQueueLength = Math.max(this.maxQueueLength, this.jobs.length);
  }

  get averageTimeWaited() {
    return _.sum(this.jobsDone.map((j) => moment(j.doneAt).diff(moment(j.createdAt)))) / this.jobsDone.length;
  }

  get averageLoad() {
    return avg(this.loaded);
  }

  get averageQueueLength() {
    return avg(this.queueLength);
  }
}

export default Consumer;
