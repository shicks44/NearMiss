(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const weekly = window.NearMissWeekly;
  const trivia = window.nearMissTrivia;
  if (!weekly.loopback(location.hostname)) {
    $('editor-intro').classList.add('hidden');
    $('editor-unavailable').classList.remove('hidden');
    return;
  }

  // Shared alternates from the existing estimate bank. Already-used questions
  // are filtered out by the Weekly Editor.
  const weeklyAlternateClues = {
    'BIG LANDMARKS': 'The Grand Canyon is wide enough that the far rim can look hazy from the other side.',
    'ON THE COURT': 'Picture one net and two service boxes on each side. A tennis court is longer than it is wide.',
    'ON THE PITCH': 'The goal is wider than a car. A goalkeeper can almost reach the crossbar with a jump.'
  };
  const sharedAlternates = (window.nearMissQuestions?.estimates ?? [])
    .filter(question => weeklyAlternateClues[question.category])
    .map(question => ({
      ...question,
      category: question.category === 'BIG LANDMARKS' ? 'LANDMARKS' : 'SPORTS',
      hint: weeklyAlternateClues[question.category]
    }));

  const storageKey = 'nearmiss-weekly-editor-v1';
  let workspace;
  try { workspace = JSON.parse(localStorage.getItem(storageKey)) ?? {}; } catch { workspace = {}; }
  workspace.weeks ||= {};
  let draft;
  let activeDate;
  let candidates = [];
  const published = window.nearMissWeeklySchedule;
  const publishedIds = new Set(Object.values(published).flat().map(weekly.questionIdentity));
  const rotationIds = weekly.existingIdentities(trivia, {});

  function save() {
    workspace.weeks[draft.monday] = draft;
    workspace.currentMonday = draft.monday;
    try {
      localStorage.setItem(storageKey, JSON.stringify(workspace));
      return true;
    } catch {
      notice('Browser storage is full. Export the draft to keep your changes.', true);
      return false;
    }
  }

  function notice(message, failed = false) {
    $('editor-status').textContent = message;
    $('editor-status').dataset.error = String(failed);
  }

  function blankDay() {
    return { questions: Array.from({ length: 5 }, () => weekly.cleanQuestion({ numeric: true })) };
  }

  function openWeek(monday, selectedDate) {
    try {
      loadWeek(monday, selectedDate);
    } catch (error) {
      console.error('Unable to load the weekly editor', error);
      notice('This week could not load. Refresh the editor and try again. Your saved draft is still available to export.', true);
    }
  }

  function loadWeek(monday, selectedDate) {
    const dates = weekly.weekDates(monday);
    if (!dates.length) {
      notice('Pick a Monday to open its seven-day week.', true);
      return;
    }
    draft = workspace.weeks[monday] ?? { version: 1, monday, days: {} };
    for (const date of dates) draft.days[date] ??= blankDay();
    const pool = window.nearMissWeeklyCandidates?.[monday] ?? [];
    candidates = [...(Array.isArray(pool) ? pool : []), ...(window.nearMissEditorialAlternates ?? []), ...sharedAlternates]
      .filter(q => q?.prompt && !publishedIds.has(weekly.questionIdentity(q)) && !rotationIds.has(weekly.questionIdentity(q)))
      .map(weekly.cleanQuestion);
    for (const date of dates) {
      const day = draft.days[date];
      if (Object.hasOwn(published, date)) {
        day.questions = published[date].map(weekly.cleanQuestion);
        continue;
      }
      if (date < new Date().toISOString().slice(0, 10)) continue;
      day.questions.forEach((question, index) => {
        if (question.prompt) return;
        const next = availableCandidates(date, index)[0];
        if (next) day.questions[index] = next;
      });
    }
    activeDate = dates.includes(selectedDate) ? selectedDate : dates[0];
    $('week-monday').value = monday;
    if (save()) notice('');
    renderDay();
  }

  function renderDays() {
    const week = weekly.weekDates(draft.monday);
    $('editor-days').replaceChildren(...week.map((date, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.date = date;
      if (date === activeDate) button.setAttribute('aria-current', 'date');
      button.textContent = weekly.daysOfWeek[index];
      const status = document.createElement('small');
      const filled = draft.days[date].questions.filter(q => q.prompt).length;
      status.textContent = Object.hasOwn(published, date) ? 'Scheduled'
        : weekly.isApproved(draft.days[date]) ? 'Approved' : `${filled}/5 picked`;
      button.append(status);
      return button;
    }));
    const day = draft.days[activeDate];
    const scheduled = Object.hasOwn(published, activeDate);
    $('approve-day').disabled = scheduled;
    const validity = weekly.validationErrors(day.questions, trivia.topicOf);
    $('editor-day-title').textContent = `${weekly.daysOfWeek[week.indexOf(activeDate)]} · ${activeDate}`;
    $('editor-day-progress').textContent = scheduled ? 'Scheduled on the Daily' : weekly.isApproved(day)
      ? `Approved by ${day.approval.by}` : validity.length ? 'Draft in progress' : 'Ready for playtest and review';
    $('clear-approval').disabled = !day.approval;
  }

  function renderDay() {
    renderDays();
    $('candidate-summary').textContent = candidates.length
      ? `${candidates.length} extra candidates available for review.`
      : 'Suggestions come from each day’s unused Daily lineup. Add extra candidates to make more swaps.';
    $('review-note').value = draft.days[activeDate].note ?? '';
    const template = $('editor-hole-template');
    $('editor-holes').replaceChildren(...draft.days[activeDate].questions.map((q, index) => {
      const card = template.content.firstElementChild.cloneNode(true);
      card.dataset.hole = index;
      card.disabled = Object.hasOwn(published, activeDate);
      fillCandidatePicker(card.querySelector('[data-candidate]'), index);
      renderCandidateSummary(card, q);
      const swap = card.querySelector('[data-swap]');
      swap.disabled = !availableCandidates(activeDate, index).some(candidate =>
        weekly.questionIdentity(candidate) !== weekly.questionIdentity(q));
      if (!q.prompt) card.querySelector('details').open = true;
      card.querySelector('legend').textContent = `Hole ${index + 1}`;
      for (const field of card.querySelectorAll('[data-field]')) {
        const key = field.dataset.field;
        field.value = key === 'answers' ? (q.answers ?? []).map(a => [
          a.name, a.value ?? '', ...a.aliases
        ].join(' | ')).join('\n') : q[key] ?? '';
      }
      card.querySelector('.answer-list').classList.toggle('hidden', q.numeric);
      setSourceLink(card, q.url);
      return card;
    }));
  }

  function availableCandidates(date, hole) {
    if (Object.hasOwn(published, date) || date < new Date().toISOString().slice(0, 10)) return [];
    const day = draft.days[date];
    const excluded = new Set(day.rejected ?? []);
    const topics = new Set(day.questions.filter((q, index) => index !== hole && q.prompt && q.category).map(trivia.topicOf));
    const drafts = { ...workspace.weeks, [draft.monday]: draft };
    const used = new Set(Object.values(drafts).flatMap(week => Object.entries(week.days)
      .flatMap(([otherDate, otherDay]) => otherDay.questions
        .filter((q, index) => q.prompt && (otherDate !== date || index !== hole))
        .map(weekly.questionIdentity))));
    const standard = weekly.dailyCandidates(date, trivia);
    const pool = [...standard, ...candidates];
    return pool.filter(q => {
      const id = weekly.questionIdentity(q);
      if (publishedIds.has(id) || used.has(id) || excluded.has(id) || topics.has(trivia.topicOf(q))) return false;
      if (!weekly.availableForDate(q, rotationIds, standard)) return false;
      used.add(id);
      return true;
    });
  }

  function renderCandidateSummary(card, q) {
    card.querySelector('.candidate-question').textContent = q.prompt || 'No unused suggestion available for this hole.';
    const match = q.answers?.find(answer => answer.value === q.target);
    card.querySelector('.candidate-answer').textContent = q.prompt
      ? `Answer: ${match ? match.name + ' · ' : ''}${q.target} ${q.unit}` : '';
    card.querySelector('.candidate-hint').textContent = q.hint ? `Clue: ${q.hint}` : '';
  }

  function fillCandidatePicker(picker, hole) {
    const options = availableCandidates(activeDate, hole);
    picker.closest('label').classList.toggle('hidden', !options.length);
    picker.setAttribute('aria-label', `Pick or replace question for hole ${hole + 1}`);
    picker.replaceChildren(new Option('Choose a candidate…', ''));
    picker.questions = options;
    const current = draft.days[activeDate].questions[hole];
    for (const [index, question] of options.entries()) {
      picker.append(new Option(`${question.category} · ${question.prompt}`, String(index)));
      if (weekly.questionIdentity(current) === weekly.questionIdentity(question)) picker.value = String(index);
    }
  }

  function setSourceLink(card, value) {
    const link = card.querySelector('.source-preview');
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:') throw new Error();
      link.href = url.href;
      link.classList.remove('hidden');
    } catch {
      link.removeAttribute('href');
      link.classList.add('hidden');
    }
  }

  function answersFrom(text) {
    return text.split('\n').filter(line => line.trim()).map(line => {
      const [name, value, ...aliases] = line.split('|').map(part => part.trim());
      return { name, value: value ? Number(value) : null, aliases: aliases.filter(Boolean) };
    });
  }

  function updateHole(card) {
    const fields = Object.fromEntries([...card.querySelectorAll('[data-field]')].map(field => [field.dataset.field, field.value]));
    const numeric = fields.numeric === 'true';
    const target = fields.target === '' ? null : Number(fields.target);
    const day = draft.days[activeDate];
    day.questions[Number(card.dataset.hole)] = weekly.cleanQuestion({
      ...fields, numeric, target, answers: answersFrom(fields.answers)
    });
    delete day.approval;
    card.querySelector('.answer-list').classList.toggle('hidden', numeric);
    setSourceLink(card, fields.url);
    renderCandidateSummary(card, day.questions[Number(card.dataset.hole)]);
    for (const picker of $('editor-holes').querySelectorAll('[data-candidate]')) {
      fillCandidatePicker(picker, Number(picker.closest('[data-hole]').dataset.hole));
    }
    if (save()) notice('');
    renderDays();
  }

  function readyDay() {
    const day = draft.days[activeDate];
    const errors = weekly.validationErrors(day.questions, trivia.topicOf);
    if (!Object.hasOwn(published, activeDate)) {
      const standard = weekly.dailyCandidates(activeDate, trivia);
      const otherDays = Object.entries(draft.days).filter(([date]) => date !== activeDate);
      const used = new Set([...publishedIds, ...otherDays.flatMap(([, other]) =>
        other.questions.filter(q => q.prompt).map(weekly.questionIdentity))]);
      day.questions.forEach((q, index) => {
        if (q.prompt && (used.has(weekly.questionIdentity(q)) || !weekly.availableForDate(q, rotationIds, standard))) {
          errors.push(`Hole ${index + 1}: Swap this question. It is already used in another lineup.`);
        }
      });
    }
    if (errors.length) {
      notice(errors.slice(0, 12).join('\n'), true);
      return null;
    }
    return day;
  }

  function exportWeek(reviewed) {
    if (reviewed) {
      const errors = weekly.checkWeek(draft, trivia, window.nearMissWeeklySchedule);
      if (errors.length) {
        notice(errors.slice(0, 12).join('\n'), true);
        return;
      }
    }
    const url = URL.createObjectURL(new Blob([JSON.stringify(draft, null, 2) + '\n'], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `nearmiss-${draft.monday}-${reviewed ? 'reviewed' : 'draft'}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notice(reviewed ? 'Reviewed file exported. Use the publish command to stage the week.' : 'Draft exported for your team.');
  }

  async function importWeek(file) {
    try {
      const incoming = JSON.parse(await file.text());
      const dates = weekly.weekDates(incoming?.monday);
      if (incoming?.version !== 1 || !dates.length || !incoming.days || typeof incoming.days !== 'object') {
        throw new Error('Choose a NearMiss week JSON with a valid Monday.');
      }
      const local = workspace.weeks[incoming.monday];
      const merged = { version: 1, monday: incoming.monday, days: {} };
      const conflicts = [];
      for (const date of dates) {
        const remoteDay = incoming.days[date] ?? blankDay();
        if (!Array.isArray(remoteDay.questions) || remoteDay.questions.length !== 5
          || !remoteDay.questions.every(q => q && typeof q === 'object')) {
          throw new Error(`${date} needs five question objects.`);
        }
        const questions = remoteDay.questions.map(weekly.cleanQuestion);
        const remote = { questions };
        if (Array.isArray(remoteDay.rejected)) remote.rejected = remoteDay.rejected.filter(id => typeof id === 'string');
        if (typeof remoteDay.note === 'string') remote.note = remoteDay.note.slice(0, 600);
        if (weekly.isApproved(remoteDay)) remote.approval = { ...remoteDay.approval };
        const localDay = local?.days[date];
        if (!localDay?.questions.some(q => q.prompt)) {
          merged.days[date] = remote;
        } else if (!questions.some(q => q.prompt)) {
          merged.days[date] = localDay;
        } else if (weekly.fingerprint(questions) === weekly.fingerprint(localDay.questions)) {
          merged.days[date] = {
            ...localDay, ...remote,
            approval: remote.approval ?? localDay.approval,
            note: remote.note ?? localDay.note
          };
        } else {
          conflicts.push(date);
          merged.days[date] = remote;
        }
      }
      if (conflicts.length && !window.confirm(`Replace conflicting local drafts for ${conflicts.join(', ')}?`)) {
        notice('Import cancelled. Your local draft is intact.');
        return;
      }
      workspace.weeks[merged.monday] = merged;
      openWeek(merged.monday);
      notice('Draft imported. Approvals from matching revisions were retained.');
    } catch (error) {
      notice(error.message, true);
    }
  }

  $('open-week').onclick = () => openWeek($('week-monday').value);
  $('editor-days').onclick = event => {
    const button = event.target.closest('button[data-date]');
    if (!button) return;
    activeDate = button.dataset.date;
    workspace.lastDate = activeDate;
    save();
    notice('');
    renderDay();
    $('editor-days').querySelector('[aria-current]').focus();
  };
  $('editor-holes').addEventListener('click', event => {
    const button = event.target.closest('[data-swap]');
    if (!button) return;
    const hole = Number(button.closest('[data-hole]').dataset.hole);
    const day = draft.days[activeDate];
    const oldId = weekly.questionIdentity(day.questions[hole]);
    const next = availableCandidates(activeDate, hole).find(q => weekly.questionIdentity(q) !== oldId);
    if (!next) return;
    day.rejected = [...(day.rejected ?? []), oldId];
    day.questions[hole] = next;
    delete day.approval;
    if (save()) notice(`Swapped question for hole ${hole + 1}.`);
    renderDay();
    const updated = $('editor-holes').querySelector(`[data-hole="${hole}"]`);
    const swap = updated.querySelector('[data-swap]');
    (swap.disabled ? updated.querySelector('summary') : swap).focus();
  });

  $('editor-holes').addEventListener('change', event => {
    const picker = event.target.closest('[data-candidate]');
    if (!picker || picker.value === '' || picker.selectedOptions[0]?.disabled) return;
    const hole = Number(picker.closest('[data-hole]').dataset.hole);
    const question = picker.questions[Number(picker.value)];
    if (!question) return;
    const day = draft.days[activeDate];
    day.questions[hole] = weekly.cleanQuestion(question);
    delete day.approval;
    if (save()) notice(`Selected a question for hole ${hole + 1}.`);
    renderDay();
    $('editor-holes').querySelector(`[data-hole="${hole}"] [data-candidate]`).focus();
  });

  $('editor-holes').addEventListener('input', event => {
    if (!event.target.matches('[data-field]')) return;
    const card = event.target.closest('[data-hole]');
    if (card) updateHole(card);
  });
  $('playtest-day').onclick = () => {
    const day = readyDay();
    if (!day || !save()) return;
    sessionStorage.setItem(weekly.previewKey, JSON.stringify({ date: activeDate, questions: day.questions }));
    location.assign('/?weekly-preview=1');
  };
  $('review-note').addEventListener('input', event => {
    draft.days[activeDate].note = event.target.value;
    save();
  });
  $('approve-day').onclick = () => {
    const day = readyDay();
    if (!day) return;
    const by = $('reviewer-name').value.trim();
    if (!by) {
      notice('Enter a reviewer name to approve this day.', true);
      $('reviewer-name').focus();
      return;
    }
    workspace.reviewer = by;
    day.approval = { by, at: new Date().toISOString(), snapshot: weekly.fingerprint(day.questions) };
    if (save()) notice(`Approved by ${by}.`);
    renderDays();
  };
  $('clear-approval').onclick = () => {
    delete draft.days[activeDate].approval;
    if (save()) notice('Approval reset.');
    renderDays();
  };
  $('export-draft').onclick = () => exportWeek(false);
  $('export-reviewed').onclick = () => exportWeek(true);
  $('import-week').onchange = async event => {
    if (event.target.files[0]) await importWeek(event.target.files[0]);
    event.target.value = '';
  };
  $('editor').classList.remove('hidden');
  $('reviewer-name').value = workspace.reviewer ?? '';
  openWeek(workspace.currentMonday ?? weekly.upcomingMonday(), workspace.lastDate);
})();
