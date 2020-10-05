import { avg } from './tools';

class Job {
  addedToQueueAt = null;
  addedToJobAt = null;
  createdAt = new Date().toISOString();
  last = false;

  constructor(i, maxTime, maxDelayTime) {
    this.id = i + 1;
    this.time = Math.random() * maxTime;
    const delays = [...Array(i)].map(() => Math.random() * maxDelayTime);
    this.delay = avg(delays);
  }
}

export default Job;
