import Job from './Job';
import { avg, delay } from './tools';
import Bluebird from 'bluebird';
import _ from 'lodash';
import { once } from 'events';
import Consumer from './Consumer';

const constants = [
  { MAX_JOBS_COUNT: 20, MAX_TIME: 600, MAX_DELAY_TIME: 10, INTERVAL: 10, CONSUMER_COUNT: 4, QUEUE_LIMIT: 5 },
  { MAX_JOBS_COUNT: 50, MAX_TIME: 300, MAX_DELAY_TIME: 10, INTERVAL: 13, CONSUMER_COUNT: 3, QUEUE_LIMIT: 3 },
  { MAX_JOBS_COUNT: 40, MAX_TIME: 100, MAX_DELAY_TIME: 10, INTERVAL: 15, CONSUMER_COUNT: 5, QUEUE_LIMIT: 2 },
  { MAX_JOBS_COUNT: 10, MAX_TIME: 100, MAX_DELAY_TIME: 10, INTERVAL: 20, CONSUMER_COUNT: 3, QUEUE_LIMIT: 10 },
];

(async () => {
  const consumers = await Bluebird.map(
    constants,
    async (c) => {
      const consumer1 = new Consumer(c, 1);
      const consumer2 = new Consumer(c, 2);
      const consumer3 = new Consumer(c, 3);
      const consumer4 = new Consumer(c, 4);

      consumer1.setOutput([consumer2, consumer3]);
      consumer2.setOutput(null);
      consumer3.setOutput([consumer4]);
      consumer4.setOutput([consumer1, null]);

      const jobs = [...Array(c.MAX_JOBS_COUNT)].map((_, i) => new Job(i, c.MAX_TIME, c.MAX_DELAY_TIME));
      _.last(jobs).last = true;

      console.info('\nStarting consuming....');
      for (const j of jobs) {
        await delay(j.delay);
        await consumer1.acceptJob(j);
      }

      await Promise.race([consumer2, consumer4].map((c) => once(c, Consumer.endConsumingEvent)));
      console.info('Ending consuming...\n');
      return { consumer1, consumer2, consumer3, consumer4 };
    },
    { concurrency: 1 }
  );

  console.table(
    consumers.map((c) => {
      const consumers = Object.values(c);
      return {
        MAX_DELAY_TIME: c.consumer1.MAX_DELAY_TIME,
        MAX_JOBS_COUNT: c.consumer1.MAX_JOBS_COUNT,
        MAX_TIME: c.consumer1.MAX_TIME,
        INTERVAL: c.consumer1.INTERVAL,

        averageTimeWaited: avg(consumers.map((c) => c.averageTimeWaited)),
        maxLoad: avg(consumers.map((c) => c.maxLoad)),
        averageLoad: avg(consumers.map((c) => c.averageLoad)),
        maxQueueLength: avg(consumers.map((c) => c.maxQueueLength)),
        averageQueueLength: avg(consumers.map((c) => c.averageQueueLength)),
      };
    })
  );
})();
