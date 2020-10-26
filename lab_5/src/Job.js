import { avg } from './tools';

class Job {
  addedToQueueAt = null;
  doneAt = null;
  createdAt = new Date().toISOString();
  last = false;

  constructor(i, maxDelayTime) {
    this.id = i + 1;
    const delays = [...Array(i)].map(() => Math.random() * maxDelayTime);
    this.delay = avg(delays);
  }
}

export default Job;
