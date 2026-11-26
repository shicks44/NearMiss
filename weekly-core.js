(() => {
  'use strict';
  const dayMs = 86400000;
  const rotationStart = Date.UTC(2026, 10, 25);
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const previewKey = 'nearmiss-weekly-playtest-v1';
  const loopback = host => ['localhost', '127.0.0.1', '[::1]'].includes(host);
  const dateKey = date => new Date(date).toISOString().slice(0, 10);
  const nonempty = value => typeof value === 'string' && Boolean(value.trim());
  const normalize = value => String(value ?? '').normalize('NFD').toLowerCase().replace(/\p{M}/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const answerKey = value => normalize(value).replace(/^the /, '').replaceAll(' ', '');

  function weekDates(monday) {
    if (typeof monday !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(monday)) return [];
    const date = new Date(monday + 'T00:00:00Z');
    if (!Number.isFinite(date.getTime()) || dateKey(date) !== monday || date.getUTCDay() !== 1) return [];
    return daysOfWeek.map((_, i) => dateKey(date.getTime() + i * dayMs));
  }

  function upcomingMonday(now = new Date()) {
    const daysToMonday = (8 - now.getUTCDay()) % 7 || 7;
    return dateKey(now.getTime() + daysToMonday * dayMs);
  }

  function questionIdentity(q) {
    return q.numeric === false ? `named|${normalize(q.prompt)}|${q.target}` : `number|${normalize(q.prompt)}`;
  }

  function cleanQuestion(q) {
    const result = {};
    for (const key of ['category', 'prompt', 'unit', 'hint', 'source', 'url']) result[key] = String(q[key] ?? '').trim();
    result.category = result.category.toUpperCase();
    result.target = q.target;
    result.numeric = q.numeric;
    result.difficulty = q.numeric ? 'ESTIMATE' : 'NAME ONE';
    if (q.numeric === false) {
      result.answers = (Array.isArray(q.answers) ? q.answers : []).map(answer => ({
        name: String(answer?.name ?? '').trim(), value: answer?.value,
        aliases: (Array.isArray(answer?.aliases) ? answer.aliases : []).map(alias => String(alias).trim()).filter(Boolean)
      }));
    }
    return result;
  }

  function validationErrors(questions, topicOf = q => normalize(q.category)) {
    if (!Array.isArray(questions) || questions.length !== 5) return ['Add exactly five holes.'];
    const errors = [];
    const topics = new Set();
    const identities = new Set();
    questions.forEach((q, index) => {
      const issue = text => errors.push(`Hole ${index + 1}: ${text}`);
      if (!q || typeof q !== 'object') { issue('Add a question.'); return; }
      for (const [key, label, limit] of [
        ['category', 'topic', 40], ['prompt', 'question', 220], ['unit', 'answer unit', 45],
        ['hint', 'For scale clue', 165], ['source', 'source name', 140]
      ]) {
        if (!nonempty(q[key])) issue(`Add the ${label}.`);
        else if (q[key].trim().length > limit) issue(`Keep the ${label} to ${limit} characters.`);
      }
      try {
        if (new URL(q.url).protocol !== 'https:') throw new Error();
      } catch { issue('Use an HTTPS source link.'); }
      if (!Number.isFinite(q.target) || q.target <= 0) issue('Enter a positive exact answer or target.');
      if (typeof q.numeric !== 'boolean') issue('Choose Number guess or Name a match.');
      if (q.numeric === false) {
        const answers = Array.isArray(q.answers) ? q.answers : [];
        if (answers.length < 2) issue('Add at least two accepted names.');
        if (answers.filter(answer => answer?.value === q.target).length !== 1) issue('Exactly one named answer must match the target.');
        const names = new Map();
        for (const [answerIndex, answer] of answers.entries()) {
          if (!nonempty(answer?.name) || !Number.isFinite(answer.value) || answer.value < 0) {
            issue('Each name needs a valid number.');
            continue;
          }
          for (const name of [answer.name, ...(Array.isArray(answer.aliases) ? answer.aliases : [])]) {
            const key = answerKey(name);
            if (!key) issue('Use letters or numbers in each name and alias.');
            if (names.has(key) && names.get(key) !== answerIndex) issue(`“${name}” matches multiple answers.`);
            names.set(key, answerIndex);
          }
        }
      }
      if (nonempty(q.category)) {
        const topic = topicOf(cleanQuestion(q));
        if (topics.has(topic)) issue(`The topic “${q.category}” repeats in this set.`);
        topics.add(topic);
      }
      if (nonempty(q.prompt)) {
        const id = questionIdentity(q);
        if (identities.has(id)) issue('This question repeats in the set.');
        identities.add(id);
      }
    });
    return errors;
  }

  function fingerprint(questions) {
    return JSON.stringify(questions.map(cleanQuestion));
  }

  const isApproved = day => nonempty(day?.approval?.by) && Array.isArray(day.questions)
    && day.questions.every(q => q && typeof q === 'object')
    && day.approval.snapshot === fingerprint(day.questions);

  function existingIdentities(trivia, schedule) {
    return new Set([
      ...trivia.schedules.flat(2), ...trivia.legacy.flat(2), ...trivia.reserves.flat(),
      ...Object.values(schedule).flat()
    ].map(questionIdentity));
  }

  function dailyCandidates(date, trivia) {
    const index = Math.max(0, (Date.parse(date) - rotationStart) / dayMs);
    return (trivia.schedules[0][index] ?? []).map(q =>
      cleanQuestion(q.bank ? { ...q, numeric: false, answers: trivia.answersFor(q.bank) } : q));
  }

  function gameplayKey(question) {
    const { category, unit, target, answers } = cleanQuestion(question);
    return JSON.stringify([questionIdentity(question), category, unit, target, answers]);
  }

  function availableForDate(question, reserved, sameDay) {
    return !reserved.has(questionIdentity(question))
      || sameDay.some(original => gameplayKey(original) === gameplayKey(question));
  }

  function checkWeek(draft, trivia, schedule = {}) {
    const dates = weekDates(draft?.monday);
    if (draft?.version !== 1 || !dates.length || !draft.days || typeof draft.days !== 'object') {
      return ['Use a version 1 draft with a Monday in YYYY-MM-DD format and seven dated days.'];
    }
    const errors = [];
    const reserved = existingIdentities(trivia, {});
    const used = new Set(Object.values(schedule).flat().map(questionIdentity));
    for (const date of dates) {
      const day = draft.days[date];
      const sameDay = dailyCandidates(date, trivia);
      if (Object.hasOwn(schedule, date)) errors.push(`${date}: A reviewed set is already scheduled.`);
      if (!isApproved(day)) errors.push(`${date}: Needs a reviewer’s approval for the current questions.`);
      errors.push(...validationErrors(day?.questions, trivia.topicOf).map(error => `${date}: ${error}`));
      for (const q of Array.isArray(day?.questions) ? day.questions : []) {
        if (!nonempty(q?.prompt)) continue;
        const id = questionIdentity(q);
        if (used.has(id) || !availableForDate(q, reserved, sameDay)) errors.push(`${date}: Question already in Daily, Practice, or this week: ${q.prompt}`);
        used.add(id);
      }
    }
    return errors;
  }

  globalThis.NearMissWeekly = {
    daysOfWeek, previewKey, loopback, weekDates, upcomingMonday, cleanQuestion, questionIdentity,
    validationErrors, fingerprint, isApproved, existingIdentities, dailyCandidates, availableForDate, rotationStart, checkWeek
  };
})();
