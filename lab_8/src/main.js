import debugHandler from 'debug';
import generateFirstNet from './generateFirstNet';
import inquirer from 'inquirer';
import generateSecondNet from './generateSecondNet';
import generateThirdNet from './generateThirdNet';

const debug = debugHandler('lab:main');

const getNet = async () => {
  const { task } = await inquirer.prompt([
    {
      type: 'list',
      name: 'task',
      message: 'Choose task',
      choices: ['Task 1', 'Task 2', 'Task 3', new inquirer.Separator(), 'Exit'],
    },
  ]);

  if (task === 'Task 1') return generateFirstNet();
  if (task === 'Task 2') {
    const { number } = await inquirer.prompt({
      type: 'input',
      message: 'Enter buffer size',
      name: 'number',
    });
    if (isNaN(+number)) throw new Error('Invalid buffer size');
    return generateSecondNet(+number);
  }
  if (task === 'Task 3') {
    const { number } = await inquirer.prompt({
      type: 'input',
      message: 'Enter jobs number',
      name: 'number',
    });
    if (isNaN(+number) || number % 6 !== 0) throw new Error('Invalid jobs number');
    return generateThirdNet(+number);
  }
  process.exit(1);
};

const main = async () => {
  while (true) {
    const net = await getNet();

    debug('Start simulation');
    net.simulate(100, false, true);

    debug('End simulation');

    if (net.isThirdTask) {
      const firstType = net.places[2];
      const secondType = net.places[3];
      const thirdType = net.places[5];
      debug(
        `Jobs correlate in this order: (${firstType.name}) ${firstType.tokens} : (${secondType.name}) ${secondType.tokens} : (${thirdType.name}) ${thirdType.tokens}`
      );
    }
  }
};

main().catch((e) => console.error(e));
