import Job from './Job';
import { avg, delay, erlang } from './tools';
import _ from 'lodash';
import { once } from 'events';
import Consumer from './Consumer';
import debugHandler from 'debug';
import moment from 'moment';

const debug = debugHandler('lab:hospital');

const constant = { MAX_JOBS_COUNT: 30, MAX_DELAY_TIME: 150, INTERVAL: 10 };

const TIME_MULTIPLIER = 10;

const jobTypes = [
  {
    type: 1,
    probability: 0.5,
    time: 15 * TIME_MULTIPLIER,
  },
  {
    type: 2,
    probability: 0.3,
    time: 40 * TIME_MULTIPLIER,
  },
  { type: 3, probability: 0.4, time: 30 * TIME_MULTIPLIER },
];

(async () => {
  // приймальне відділення
  const consumer1 = new Consumer(
    constant,
    1,
    (job) => Math.random() * jobTypes.find((t) => t.type === job.type).time,
    2
  );

  // палата
  const consumer2 = new Consumer(constant, 2, () => (Math.random() * (8 - 3) + 3) * TIME_MULTIPLIER, 3);

  // реєстрація
  const consumer3 = new Consumer(constant, 3, () => erlang(4.5, 3));

  // лабораторія
  const consumer4 = new Consumer(constant, 4, () => erlang(4, 2), 2);

  consumer1.setRoute(async (job) => {
    if (job.type === jobTypes[0].type) return consumer2.acceptJob(job);

    await delay((Math.random() * (5 - 2) + 2) * TIME_MULTIPLIER);
    return consumer3.acceptJob(job);
  });

  consumer3.setOutput(consumer4);

  consumer4.setRoute(async (job, endJob) => {
    if (job.type === jobTypes[1].type) {
      job.type = jobTypes[0].type;
      return consumer1.acceptJob(job);
    }

    await delay((Math.random() * (5 - 2) + 2) * TIME_MULTIPLIER);
    return endJob();
  });

  const jobs = [...Array(constant.MAX_JOBS_COUNT)].map((_, i) => new Job(i, constant.MAX_DELAY_TIME));
  _.last(jobs).last = true;

  jobs.forEach((j) => {
    const randomValue = Math.random();

    let currentProbability = 0;

    const next =
      jobTypes.find(({ probability }) => {
        currentProbability += probability;

        return currentProbability > randomValue;
      }) || jobTypes[0];

    j.type = next.type;
    j.firstType = next.type;
  });

  debug('\nStarting consuming....');

  for (const j of jobs) {
    await delay(j.delay);
    j.firstAddedToQueueAt = new Date().toISOString();
    await consumer1.acceptJob(j);
  }

  await once(consumer1, Consumer.endConsumingEvent);
  debug('Ending consuming...\n');

  debug({
    MAX_DELAY_TIME: consumer1.MAX_DELAY_TIME,
    MAX_JOBS_COUNT: consumer1.MAX_JOBS_COUNT,
    INTERVAL: consumer1.INTERVAL,

    averageTimeInSystem1:
      _.sum(
        consumer2.jobsDone
          .filter((j) => j.firstType === jobTypes[0].type)
          .map((j) => moment(j.doneAt).diff(moment(j.firstAddedToQueueAt)))
      ) / consumer2.jobsDone.filter((j) => j.firstType === jobTypes[0].type).length,

    averageTimeInSystem2:
      _.sum(
        consumer2.jobsDone
          .filter((j) => j.firstType === jobTypes[1].type)
          .map((j) => moment(j.doneAt).diff(moment(j.firstAddedToQueueAt)))
      ) / consumer2.jobsDone.filter((j) => j.firstType === jobTypes[1].type).length,

    averageTimeInSystem3:
      _.sum(
        consumer4.jobsDone
          .filter((j) => j.firstType === jobTypes[2].type)
          .map((j) => moment(j.doneAt).diff(moment(j.firstAddedToQueueAt)))
      ) / consumer4.jobsDone.filter((j) => j.firstType === jobTypes[2].type).length,

    averageAcceptedJobTime: consumer4.averageAcceptedJobTime,
  });
})();
