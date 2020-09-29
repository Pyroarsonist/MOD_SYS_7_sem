import _ from 'lodash';
import Emitter from 'events';
import moment from 'moment';
import { avg, delay } from './tools';
import { setIntervalAsync } from 'set-interval-async/fixed';
import { clearIntervalAsync } from 'set-interval-async';

class Consumer extends Emitter {
  static get endConsumingEvent() {
    return 'end';
  }

  jobs = [];
  jobsDone = [];
  loaded = [];
  queueLength = [];
  id = null;
  maxQueueLength = 0;
  output = null;

  constructor(props, id) {
    super();

    this.MAX_DELAY_TIME = props.MAX_DELAY_TIME;
    this.MAX_JOBS_COUNT = props.MAX_JOBS_COUNT;
    this.MAX_TIME = props.MAX_TIME;
    this.INTERVAL = props.INTERVAL;
    this.CONSUMER_COUNT = props.CONSUMER_COUNT;
    this.QUEUE_LIMIT = props.QUEUE_LIMIT;
    this.id=id

    this.averageLoadCalculatorInterval = setIntervalAsync(() => this.consume(), this.INTERVAL);
  }

  async consume() {
    this.loaded.push(+!!this.jobs.length);
    this.queueLength.push(this.jobs.length);

    if (this.jobs.length) {
      const job = this.jobs[0];
      console.info(`${new Date().toISOString()} | Job #${job.id} is processing on consumer #${this.id}`);
      await delay(job.time);
      job.doneAt = new Date().toISOString();
      console.info(`${new Date().toISOString()} | Job #${job.id} done for ${job.time}ms  on consumer #${this.id}`);
      this.jobs.shift();

      const end = async () => {
        this.jobsDone.push(job);
        if (job.last) {
          await this.end();
        }
      };

      if (this.output) {
        const next = _.sample(this.output);
        if (next) {
          await next.acceptJob(job);
        } else {
          await end();
        }
      } else {
        await end();
      }
    }
  }

  setOutput(output) {
    this.output = output;
  }

  canAcceptJob() {
    return this.controller.QUEUE_LIMIT > this.jobs.length;
  }

  acceptJob(job) {
    job.addedToQueueAt = new Date().toISOString();

    this.jobs.push(job);
    console.info(`${new Date().toISOString()} | Job #${job.id} put to queue  on consumer #${this.id}`);

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

  async end() {
    await clearIntervalAsync(this.averageLoadCalculatorInterval);
    this.emit(Consumer.endConsumingEvent);
  }
}

export default Consumer;
