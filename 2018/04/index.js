import { readFile } from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFilePromise = promisify(readFile);
const getInput = async () => {
  try {
    const data = await readFilePromise(
      path.resolve(__dirname, 'input.txt'),
      'utf8'
    );
    return data.trim().split('\n');
  } catch (err) {
    console.log('ERROR:', err);
    return null;
  }
};
const dateRe = /(((?:(?:[1]{1}\d{1}\d{1}\d{1})|(?:[2]{1}\d{3}))[-:\/.](?:[0]?[1-9]|[1][012])[-:\/.](?:(?:[0-2]?\d{1})|(?:[3][01]{1})))(?![\d]))/;
const timeRe = /(((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9])?(?:\s?)?))/;
const msgRe = /(#\d*|falls asleep|wakes up)/;
const re = new RegExp(
  dateRe.source + '|' + timeRe.source + '|' + msgRe.source,
  ['gm']
);
const createMaps = input => {
  const minutes = new Map([...Array(60)].map((e, i) => [i, new Map()]));
  const sleepLog = new Map();
  let id = '';
  let start = 0;
  let end = 0;
  input.sort();
  input.forEach(line => {
    const [, time, msg] = line.match(re);
    const [, minute] = time.split(':').map(Number);
    switch (msg) {
      case 'falls asleep':
        start = minute;
        break;
      case 'wakes up':
        end = minute;
        // frequency of sleeping on a given minute
        for (let i = start; i < end; i++) {
          const currMinute = minutes.get(i);
          const numSleeps = currMinute.get(id);
          !numSleeps
            ? currMinute.set(id, 1)
            : currMinute.set(id, numSleeps + 1);
        }
        // total minutes slept
        const minsSlept = sleepLog.get(id);
        sleepLog.set(id, minsSlept + Math.abs(start - end));
        break;
      default:
        id = msg;
        if (!sleepLog.get(id)) {
          sleepLog.set(id, 0);
        }
        break;
    }
  });
  return [minutes, sleepLog];
};
const getSleepiestGuard = input => {
  const [minutes, sleepLog] = createMaps(input);
  const [sleepiestGuardId] = [...sleepLog.entries()].reduce(
    ([keyA, valA], [keyB, valB]) => (valA > valB ? [keyA, valA] : [keyB, valB]),
    ['', 0]
  );
  const [exactMinute] = [...[...minutes.values()].entries()].reduce(
    (p, [currMin, currMap]) => {
      if (!currMap.get(sleepiestGuardId)) {
        return p;
      }
      const [prevMin, prevVal] = p;
      const currVal = currMap.get(sleepiestGuardId);
      return currVal > prevVal ? [currMin, currVal] : [prevMin, prevVal];
    },
    [0, 0]
  );
  return +sleepiestGuardId.slice(1) * exactMinute;
};
const getMostFrequentlyAsleep = input => {
  const [minutes] = createMaps(input);
  const [min, [sleepiestGuardId]] = [...[...minutes.values()].entries()].reduce(
    (p, [currMinute, currMap]) => {
      if (!currMap.size) {
        return p;
      }
      const [, [, prevVal]] = p;
      const [currMinuteMaxId, currMinuteMaxVal] = [...currMap.entries()].reduce(
        ([accId, accVal], [currId, currVal]) =>
          accVal > currVal ? [accId, accVal] : [currId, currVal]
      );
      return prevVal > currMinuteMaxVal
        ? p
        : [currMinute, [currMinuteMaxId, currMinuteMaxVal]];
    },
    ['', [0, 0]]
  );
  return +sleepiestGuardId.slice(1) * min;
};

(async () => {
  const input = await getInput();
  console.log(getSleepiestGuard(input)); // 39422
  console.log(
    getSleepiestGuard([
      '[1518-11-01 00:00] Guard #10 begins shift',
      '[1518-11-01 00:05] falls asleep',
      '[1518-11-01 00:25] wakes up',
      '[1518-11-01 00:30] falls asleep',
      '[1518-11-01 00:55] wakes up',
      '[1518-11-01 23:58] Guard #99 begins shift',
      '[1518-11-02 00:40] falls asleep',
      '[1518-11-02 00:50] wakes up',
      '[1518-11-03 00:05] Guard #10 begins shift',
      '[1518-11-03 00:24] falls asleep',
      '[1518-11-03 00:29] wakes up',
      '[1518-11-04 00:02] Guard #99 begins shift',
      '[1518-11-04 00:36] falls asleep',
      '[1518-11-04 00:46] wakes up',
      '[1518-11-05 00:03] Guard #99 begins shift',
      '[1518-11-05 00:45] falls asleep',
      '[1518-11-05 00:55] wakes up',
    ])
  ); // 240
  console.log(getMostFrequentlyAsleep(input)); // 65474
  console.log(
    getMostFrequentlyAsleep([
      '[1518-11-01 00:00] Guard #10 begins shift',
      '[1518-11-01 00:05] falls asleep',
      '[1518-11-01 00:25] wakes up',
      '[1518-11-01 00:30] falls asleep',
      '[1518-11-01 00:55] wakes up',
      '[1518-11-01 23:58] Guard #99 begins shift',
      '[1518-11-02 00:40] falls asleep',
      '[1518-11-02 00:50] wakes up',
      '[1518-11-03 00:05] Guard #10 begins shift',
      '[1518-11-03 00:24] falls asleep',
      '[1518-11-03 00:29] wakes up',
      '[1518-11-04 00:02] Guard #99 begins shift',
      '[1518-11-04 00:36] falls asleep',
      '[1518-11-04 00:46] wakes up',
      '[1518-11-05 00:03] Guard #99 begins shift',
      '[1518-11-05 00:45] falls asleep',
      '[1518-11-05 00:55] wakes up',
    ])
  ); // 4455
})();
