import Job from './Job';
import { avg, delay, getRandomInt } from './tools';
import _ from 'lodash';
import { once } from 'events';
import Consumer from './Consumer';
import debugHandler from 'debug';
import ConsumerSystem from './ConsumerSystem';
import moment from 'moment';

const debug = debugHandler('lab:main');

const constant = { MAX_JOBS_COUNT: 30, MAX_DELAY_TIME: 400, INTERVAL: 10 };

const N = 3;

export const main = async (n) => {
  let timeBefore = moment();
  const consumerSystems = [...Array(n)].map((_, i) => new ConsumerSystem(i + 1));

  let consumerId = 0;

  const generateConsumer = (system) => {
    consumerId++;
    return new Consumer({ ...constant, system: system }, consumerId, 50 + Math.random() * 300, _.sample([null, 2, 3]));
  };

  consumerSystems.forEach((s, i) => {
    const numOfConsumers = 1 + getRandomInt(n);

    const consumers = [...Array(numOfConsumers)].map(() => generateConsumer(s));

    s.consumers = consumers;

    s.input = consumers[0];
    s.output = _.last(consumers);

    s.consumers.forEach((c, j) => {
      if (j !== s.consumers.length - 1) {
        c.setOutput(s.consumers[j + 1]);
      }
    });

    if (i !== consumerSystems.length - 1) {
      s.outputSystem = consumerSystems[i + 1];
    }
  });

  const jobs = [...Array(constant.MAX_JOBS_COUNT)].map((_, i) => new Job(i, constant.MAX_DELAY_TIME));
  _.last(jobs).last = true;

  debug('\nStarting consuming....');
  for (const j of jobs) {
    await delay(j.delay);
    await consumerSystems[0].acceptJob(j);
  }

  await once(_.last(_.last(consumerSystems).consumers), Consumer.endConsumingEvent);
  debug('Ending consuming...\n');

  const consumers = consumerSystems.flatMap((s) => s.consumers);
  debug({
    MAX_DELAY_TIME: constant.MAX_DELAY_TIME,
    MAX_JOBS_COUNT: constant.MAX_JOBS_COUNT,
    INTERVAL: constant.INTERVAL,

    averageTimeWaited: avg(consumers.map((c) => c.averageTimeWaited)),
    maxLoad: avg(consumers.map((c) => c.maxLoad)),
    averageLoad: avg(consumers.map((c) => c.averageLoad)),
    maxQueueLength: avg(consumers.map((c) => c.maxQueueLength)),
    averageQueueLength: avg(consumers.map((c) => c.averageQueueLength)),
  });

  let timeAfter = moment();

  return timeAfter.diff(timeBefore, 'ms');
};

main(N).then((x) => debug(`done with ${x}ms`));
