import Job from './Job';
import { avg, delay } from './tools';
import _ from 'lodash';
import { once } from 'events';
import Consumer from './Consumer';
import debugHandler from 'debug';

const debug = debugHandler('lab:auto');

const constant = { MAX_JOBS_COUNT: 50, MAX_DELAY_TIME: 500, INTERVAL: 10, QUEUE_LIMIT: 3 };

(async () => {
  const consumer1 = new Consumer(constant, 1, () => 1000 + Math.random() * 300);
  const consumer2 = new Consumer(constant, 2, () => 1000 + Math.random() * 300);

  const jobs = [...Array(constant.MAX_JOBS_COUNT)].map((_, i) => new Job(i, constant.MAX_DELAY_TIME));
  _.last(jobs).last = true;

  debug('\nStarting consuming....');
  const consumers = [consumer1, consumer2];
  let jobsNow = [];
  const calcInterval = setInterval(() => {
    jobsNow.push(_.sum(consumers.map((c) => c.jobs.length)));
  }, constant.INTERVAL);
  let shuffleCount = 0;

  for (const j of jobs) {
    await delay(j.delay);

    if (!consumer2.canAcceptJob && !consumer1.canAcceptJob) {
      debug(`Job ${j.id} is gone out`);
      if (j.last) {
        _.sample(consumers.map((c) => _.last(c.jobs))).last = true;
      }
      continue;
    }

    if (consumer2.jobs.length < consumer1.jobs.length) {
      if (consumer2.jobs.length <= consumer1.jobs.length - 2) {
        const lastJob = consumer1.jobs.pop();
        debug(`Shuffle job #${lastJob.id} from consumer 2 to consumer 1`);
        shuffleCount++;
        await consumer2.acceptJob(lastJob);
      }
      await consumer2.acceptJob(j);
    } else {
      if (consumer1.jobs.length <= consumer2.jobs.length - 2) {
        const lastJob = consumer2.jobs.pop();
        debug(`Shuffle job #${lastJob.id} from consumer 1 to consumer 2`);
        await consumer1.acceptJob(lastJob);
        shuffleCount++;
      }

      await consumer1.acceptJob(j);
    }
  }

  await once(consumer1, Consumer.endConsumingEvent);
  clearInterval(calcInterval);
  debug('Ending consuming...\n');

  debug({
    MAX_DELAY_TIME: consumer1.MAX_DELAY_TIME,
    MAX_JOBS_COUNT: consumer1.MAX_JOBS_COUNT,
    INTERVAL: consumer1.INTERVAL,

    averageLoadArr: consumers.map((c) => c.averageLoad),
    averageLoad: avg(consumers.map((c) => c.averageLoad)),
    averageJobsLength: avg(jobsNow),
    averageJobsDoneTime: avg(consumers.map((c) => c.averageJobsDoneInterval)),
    averageTimeWaited: avg(consumers.map((c) => c.averageTimeWaited)),
    averageQueueLengthArr: consumers.map((c) => c.averageQueueLength),
    rejectedJobsPercents: `${(_.sum(consumers.map((c) => c.jobsDone.length)) / constant.MAX_JOBS_COUNT) * 100}%`,
    shuffleCount,
  });
})();
