import Job from './Job';
import { avg, delay } from './tools';
import _ from 'lodash';
import { once } from 'events';
import Consumer from './Consumer';
import debugHandler from 'debug';

const debug = debugHandler('lab:test');

const constant = { MAX_JOBS_COUNT: 30, MAX_DELAY_TIME: 2000, INTERVAL: 10, QUEUE_LIMIT: null };

(async () => {
  const consumer1 = new Consumer(constant, 1, 600);
  const consumer2 = new Consumer(constant, 2, 300);
  const consumer3 = new Consumer(constant, 3, 400);
  const consumer4 = new Consumer(constant, 4, 100, 2);

  consumer1.setOutput([
    { consumer: consumer2, probability: 0.15 },
    {
      consumer: consumer3,
      probability: 0.13,
    },
    { consumer: consumer4, probability: 0.3 },
  ]);
  consumer2.setOutput(consumer1);
  consumer3.setOutput(consumer1);
  consumer4.setOutput(consumer1);

  const jobs = [...Array(constant.MAX_JOBS_COUNT)].map((_, i) => new Job(i, constant.MAX_DELAY_TIME));
  _.last(jobs).last = true;

  debug('\nStarting consuming....');
  for (const j of jobs) {
    await delay(j.delay);
    await consumer1.acceptJob(j);
  }

  await once(consumer1, Consumer.endConsumingEvent);
  debug('Ending consuming...\n');

  const consumers = [consumer1, consumer2, consumer3, consumer4];
  debug({
    MAX_DELAY_TIME: consumer1.MAX_DELAY_TIME,
    MAX_JOBS_COUNT: consumer1.MAX_JOBS_COUNT,
    INTERVAL: consumer1.INTERVAL,

    averageTimeWaited: avg(consumers.map((c) => c.averageTimeWaited)),
    maxLoad: avg(consumers.map((c) => c.maxLoad)),
    averageLoad: avg(consumers.map((c) => c.averageLoad)),
    maxQueueLength: avg(consumers.map((c) => c.maxQueueLength)),
    averageQueueLength: avg(consumers.map((c) => c.averageQueueLength)),
  });
})();
