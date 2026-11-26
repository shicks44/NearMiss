'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const scripts = [
  'questions.js', 'world-data.js', 'food-data.js', 'fact-pack.js', 'sports-data.js',
  'rotation.js', 'trivia-bank.js', 'weekly-core.js', 'weekly-schedule.js'
];

function run() {
  const [draftPath, flag, ...extra] = process.argv.slice(2);
  if (!draftPath || (flag && flag !== '--check') || extra.length) {
    throw new Error('Usage: node tools/publish-week.cjs <reviewed-week.json> [--check]');
  }
  const lockPath = path.join(root, 'weekly-schedule.lock');
  const lock = flag === '--check' ? null : fs.openSync(lockPath, 'wx');
  try {
    publish(draftPath, flag === '--check');
  } finally {
    if (lock !== null) {
      fs.closeSync(lock);
      fs.unlinkSync(lockPath);
    }
  }
}

function publish(draftPath, checkOnly) {
  const draft = JSON.parse(fs.readFileSync(path.resolve(draftPath), 'utf8').replace(/^\uFEFF/, ''));
  const context = vm.createContext({ URL });
  context.window = context;
  for (const file of scripts) {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
  }
  const { NearMissWeekly: weekly, nearMissTrivia: trivia, nearMissWeeklySchedule: existing } = context;
  const dates = weekly.weekDates(draft?.monday);
  const errors = weekly.checkWeek(draft, trivia, existing);
  const today = new Date().toISOString().slice(0, 10);
  if (dates.length && dates[0] < today) errors.push('Choose a week that has not yet started in UTC.');
  if (errors.length) throw new Error(errors.join('\n'));
  if (checkOnly) {
    console.log(`Ready to publish 35 reviewed questions for ${dates[0]} through ${dates[6]} UTC.`);
    return;
  }

  const merged = { ...existing };
  for (const date of dates) merged[date] = draft.days[date].questions.map(weekly.cleanQuestion);
  const sorted = Object.fromEntries(Object.entries(merged).sort(([a], [b]) => a.localeCompare(b)));
  const content = '// Reviewed Daily sets keyed by UTC date. Updated by tools/publish-week.cjs.\n'
    + `window.nearMissWeeklySchedule = ${JSON.stringify(sorted, null, 2)};\n`;
  const target = path.join(root, 'weekly-schedule.js');
  const temporary = `${target}.${process.pid}.tmp`;
  try {
    fs.writeFileSync(temporary, content, { flag: 'wx', encoding: 'utf8' });
    fs.renameSync(temporary, target);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
  console.log(`Staged 35 Daily questions for ${dates[0]} through ${dates[6]} UTC in weekly-schedule.js.`);
}

try {
  run();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
