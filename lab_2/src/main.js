import Consumer from './Consumer';
import Job from './Job';
import { delay } from './tools';
import Bluebird from 'bluebird';
import _ from 'lodash';
import { once } from 'events';

const constants = [
  { MAX_JOBS_COUNT: 20, MAX_TIME: 200, MAX_DELAY_TIME: 10, INTERVAL: 10 },
  { MAX_JOBS_COUNT: 5, MAX_TIME: 300, MAX_DELAY_TIME: 10, INTERVAL: 13 },
  { MAX_JOBS_COUNT: 4, MAX_TIME: 100, MAX_DELAY_TIME: 10, INTERVAL: 15 },
  { MAX_JOBS_COUNT: 1, MAX_TIME: 100, MAX_DELAY_TIME: 10, INTERVAL: 20 },
];

(async () => {
  const consumers = await Bluebird.map(
    constants,
    async (c) => {
      const consumer = new Consumer(c);
      const jobs = [...Array(c.MAX_JOBS_COUNT)].map((_, i) => new Job(i, c.MAX_TIME, c.MAX_DELAY_TIME));
      _.last(jobs).last = true;

      console.info('\nStarting consuming....');
      for (const j of jobs) {
        await delay(j.delay );
        consumer.emit(Consumer.consumeEvent, j);
      }

      await once(consumer, Consumer.endConsumingEvent);
      console.info('Ending consuming...\n');
      return consumer;
    },
    { concurrency: 1 }
  );

  console.table(
    consumers.map(c => ({
        MAX_DELAY_TIME: c.MAX_DELAY_TIME,
        MAX_JOBS_COUNT: c.MAX_JOBS_COUNT,
        MAX_TIME: c.MAX_TIME,
        INTERVAL: c.INTERVAL,
        averageTimeWaited: c.averageTimeWaited,
        averageLoad: c.averageLoad,
    }))
  );
})();
