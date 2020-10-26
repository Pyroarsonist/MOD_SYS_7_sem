import _ from 'lodash';
import Emitter from 'events';
import moment from 'moment';
import { avg, delay } from './tools';
import { setIntervalAsync } from 'set-interval-async/fixed';
import { clearIntervalAsync } from 'set-interval-async';
import debugHandler from 'debug';
import Job from './Job';

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
  deviceCount = null;
  route = null;
  system = null;

  constructor(props, id, maxProcessingFunc, deviceCount) {
    super();

    this.debug = debugHandler('lab:consumer:' + id);

    this.MAX_DELAY_TIME = props.MAX_DELAY_TIME;
    this.MAX_JOBS_COUNT = props.MAX_JOBS_COUNT;
    this.MAX_TIME = props.MAX_TIME;
    this.INTERVAL = props.INTERVAL;
    this.QUEUE_LIMIT = props.QUEUE_LIMIT;
    this.system = props.system;
    this.id = id;
    this.maxProcessingFunc =
      typeof maxProcessingFunc !== 'function' ? () => Math.random() * maxProcessingFunc : maxProcessingFunc;
    this.deviceCount = deviceCount;

    if (this.deviceCount) this.averageLoadCalculatorInterval = setIntervalAsync(() => this.consume(), this.INTERVAL);
    else
      this.averageLoadCalculatorIntervalArr = [...Array(this.deviceCount)].map((_, i) =>
        setIntervalAsync(() => this.consume(), this.INTERVAL)
      );
  }

  pickNextConsumer() {
    if (!Array.isArray(this.output)) return this.output;

    const randomValue = Math.random();

    let currentProbability = 0;

    const next = this.output.find(({ probability }) => {
      currentProbability += probability;

      return currentProbability > randomValue;
    });

    return next?.consumer;
  }

  async consume() {
    this.loaded.push(+!!this.jobs.length);
    this.queueLength.push(this.jobs.length);

    if (this.jobs.length) {
      const job = this.jobs[0];
      this.jobs.shift();
      this.debug(`${new Date().toISOString()} | Job #${job.id} is processing`);
      const time = await this.maxProcessingFunc(job);
      await delay(time);
      job.doneAt = new Date().toISOString();
      this.debug(`${new Date().toISOString()} | Job #${job.id} done for ${time}ms`);

      const endJob = async () => {
        if (this.system?.output?.id === this.id) {
          await this.system.endJob(job);
          return;
        }

        this.jobsDone.push(job);
        if (job.last) {
          await this.end();
        }
      };

      if (this.route) {
        await this.route(job, async () => await endJob());
      }

      if (this.output) {
        const next = this.pickNextConsumer();
        if (next) {
          await next.acceptJob(job);
        } else {
          await endJob();
        }
      } else {
        await endJob();
      }
    }
  }

  setRoute(route) {
    this.route = route;
  }

  setOutput(output) {
    this.output = output;
  }

  get canAcceptJob() {
    if (!this.QUEUE_LIMIT) return true;
    return this.QUEUE_LIMIT > this.jobs.length;
  }

  acceptedJobsTimeArr = [];

  acceptJob(job) {
    job.addedToQueueAt = new Date().toISOString();

    this.acceptedJobsTimeArr.push(job.addedToQueueAt);

    this.jobs.push(job);
    this.debug(`${new Date().toISOString()} | Job #${job.id} put to queue`);

    this.maxQueueLength = Math.max(this.maxQueueLength, this.jobs.length);
  }

  get averageTimeWaited() {
    return _.sum(this.jobsDone.map((j) => moment(j.doneAt).diff(moment(j.addedToQueueAt)))) / this.jobsDone.length;
  }

  get averageLoad() {
    return avg(this.loaded);
  }

  get averageQueueLength() {
    return avg(this.queueLength);
  }

  get averageJobsDoneInterval() {
    if (!this.jobsDone.length) return 0;
    const intervals = [...Array(this.jobsDone.length - 1)].map((_, i) => {
      return moment(this.jobsDone[i + 1].doneAt).diff(moment(this.jobsDone[i].doneAt), 'ms');
    });

    return avg(intervals);
  }

  get averageAcceptedJobTime() {
    if (!this.acceptedJobsTimeArr.length) return 0;

    const intervals = [...Array(this.acceptedJobsTimeArr.length - 1)].map((_, i) => {
      return moment(this.acceptedJobsTimeArr[i + 1]).diff(moment(this.acceptedJobsTimeArr[i]), 'ms');
    });

    return avg(intervals);
  }

  async end() {
    if (this.averageLoadCalculatorInterval) await clearIntervalAsync(this.averageLoadCalculatorInterval);
    if (this.averageLoadCalculatorIntervalArr)
      await Promise.all(this.averageLoadCalculatorIntervalArr.map((interval) => clearIntervalAsync(interval)));

    this.emit(Consumer.endConsumingEvent);
  }
}

export default Consumer;
