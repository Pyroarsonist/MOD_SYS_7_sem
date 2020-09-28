import Job from './Job';
import { delay } from './tools';
import Bluebird from 'bluebird';
import _ from 'lodash';
import { once } from 'events';
import Controller from './Controller';

const constants = [
  { MAX_JOBS_COUNT: 20, MAX_TIME: 600, MAX_DELAY_TIME: 10, INTERVAL: 10, CONSUMER_COUNT: 4, QUEUE_LIMIT: 5 },
  { MAX_JOBS_COUNT: 50, MAX_TIME: 300, MAX_DELAY_TIME: 10, INTERVAL: 13, CONSUMER_COUNT: 3, QUEUE_LIMIT: 3 },
  { MAX_JOBS_COUNT: 40, MAX_TIME: 100, MAX_DELAY_TIME: 10, INTERVAL: 15, CONSUMER_COUNT: 5, QUEUE_LIMIT: 2 },
  { MAX_JOBS_COUNT: 10, MAX_TIME: 100, MAX_DELAY_TIME: 10, INTERVAL: 20, CONSUMER_COUNT: 3, QUEUE_LIMIT: 10 },
];

(async () => {
  const controllers = await Bluebird.map(
    constants,
    async (c) => {
      const controller = new Controller(c);
      const jobs = [...Array(c.MAX_JOBS_COUNT)].map((_, i) => new Job(i, c.MAX_TIME, c.MAX_DELAY_TIME));
      _.last(jobs).last = true;

      console.info('\nStarting consuming....');
      for (const j of jobs) {
        await delay(j.delay);
        const added = await controller.addJob(j);
        if (!added) jobs.unshift(j);
      }

      await once(controller, Controller.endConsumingEvent);
      console.info('Ending consuming...\n');
      return controller;
    },
    { concurrency: 1 }
  );

  console.table(
    controllers.map((c) => ({
      MAX_DELAY_TIME: c.MAX_DELAY_TIME,
      MAX_JOBS_COUNT: c.MAX_JOBS_COUNT,
      MAX_TIME: c.MAX_TIME,
      INTERVAL: c.INTERVAL,
      averageTimeWaited: c.averageTimeWaited,
      maxLoad: c.maxLoad,
      averageLoad: c.averageLoad,
      averageJobRefusal: c.averageJobRefusal,
      maxQueueLength: c.maxQueueLength,
      averageQueueLength: c.averageQueueLength,
    }))
  );
})();
