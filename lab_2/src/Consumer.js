import _ from 'lodash';
import Emitter from 'events';
import moment from 'moment';
import { avg, delay, getRandomInt } from './tools';
import { clearIntervalAsync } from 'set-interval-async'
import { setIntervalAsync } from 'set-interval-async/fixed'


class Consumer extends Emitter {
  static get consumeEvent() {
    return 'consume';
  }

  static get endConsumingEvent() {
    return 'end';
  }

  jobs = [];
  jobsDone = [];
  loaded = [];

  constructor(props) {
    super(props);

    this.MAX_DELAY_TIME = props.MAX_DELAY_TIME;
    this.MAX_JOBS_COUNT = props.MAX_JOBS_COUNT;
    this.MAX_TIME = props.MAX_TIME;
    this.INTERVAL = props.INTERVAL;

    this.on(Consumer.consumeEvent, async (job) => {
      await this.addJob(job);
    });

    this.averageLoadCalculatorInterval = setIntervalAsync(() => this.consume(), this.INTERVAL);
  }

  async consume() {
    this.loaded.push(+!!this.jobs.length);

    if (this.jobs.length) {

      const job = this.jobs[0];
      console.info(`Job #${job.id} is processing`);
      await delay(job.time);
      job.doneAt = new Date().toISOString();
      console.info(`Job #${job.id} done for ${job.time}ms`);
      this.jobsDone.push(job);
      this.jobs.shift();

      if (job.last) {
        this.end();
      }
    }

  }

  async addJob(job) {
    job.addedToQueueAt = new Date().toISOString();

    this.jobs.push(job);
    console.info(`Job #${job.id} put to queue`);
  }

  end() {
    clearIntervalAsync(this.averageLoadCalculatorInterval);
    console.info(`Average time waited: ${this.averageTimeWaited}ms`);
    console.info(`Average jobs loaded onto consumer: ${this.averageLoad}`);
    this.emit(Consumer.endConsumingEvent);
  }

  get averageTimeWaited() {
    return _.sum(this.jobsDone.map((j) => moment(j.doneAt).diff(moment(j.createdAt)))) / this.jobsDone.length;
  }

  get averageLoad() {
    return avg(this.loaded);
  }
}

export default Consumer;
