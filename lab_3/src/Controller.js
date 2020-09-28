import Emitter from 'events';
import { avg } from './tools';
import { clearIntervalAsync } from 'set-interval-async';
import { setIntervalAsync } from 'set-interval-async/fixed';
import Consumer from './Consumer';

// class Process
class Controller extends Emitter {
  static get endConsumingEvent() {
    return 'end';
  }

  consumers = [];
  jobAcceptedArr = [];

  constructor(props) {
    super();

    this.MAX_DELAY_TIME = props.MAX_DELAY_TIME;
    this.MAX_JOBS_COUNT = props.MAX_JOBS_COUNT;
    this.MAX_TIME = props.MAX_TIME;
    this.INTERVAL = props.INTERVAL;
    this.CONSUMER_COUNT = props.CONSUMER_COUNT;
    this.QUEUE_LIMIT = props.QUEUE_LIMIT;

    this.consumers = [...Array(this.CONSUMER_COUNT)].map((_, i) => new Consumer(i + 1, this));

    this.averageLoadCalculatorInterval = setIntervalAsync(
      () => Promise.all(this.consumers.map((c) => c.consume())),
      this.INTERVAL
    );
  }

  async addJob(job) {
    let added = false;

    for (const consumer of this.consumers.sort((a, b) => a.jobs.length - b.jobs.length)) {
      if (consumer.canAcceptJob(job)) {
        consumer.acceptJob(job);
        added = true;
        break;
      }
    }

    if (!added) console.info(`Returning job #${job.id} to primordial pool`);

    this.jobAcceptedArr.push(+added);

    return added;
  }

  async end() {
    await clearIntervalAsync(this.averageLoadCalculatorInterval);
    this.emit(Controller.endConsumingEvent);
  }

  get averageTimeWaited() {
    return avg(this.consumers.map((c) => c.averageTimeWaited));
  }

  get averageLoad() {
    return avg(this.consumers.map((c) => c.averageLoad));
  }

  get maxLoad() {
    return Math.max(...this.consumers.map((c) => c.averageLoad));
  }

  get averageJobRefusal() {
    return 1 - avg(this.jobAcceptedArr);
  }

  get maxQueueLength() {
    return Math.max(...this.consumers.map((c) => c.maxQueueLength));
  }

  get averageQueueLength() {
    return avg(this.consumers.map((c) => c.averageQueueLength));
  }
}

export default Controller;
