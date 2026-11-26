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

  const storageKey = 'nearmiss-weekly-editor-v1';
  let workspace;
  try { workspace = JSON.parse(localStorage.getItem(storageKey)) ?? {}; } catch { workspace = {}; }
  workspace.weeks ||= {};
  let draft;
  let activeDate;

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
    const dates = weekly.weekDates(monday);
    if (!dates.length) {
      notice('Pick a Monday to open its seven-day week.', true);
      return;
    }
    draft = workspace.weeks[monday] ?? { version: 1, monday, days: {} };
    for (const date of dates) draft.days[date] ??= blankDay();
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
      status.textContent = weekly.isApproved(draft.days[date]) ? 'Approved' : date.slice(5);
      button.append(status);
      return button;
    }));
    const day = draft.days[activeDate];
    const validity = weekly.validationErrors(day.questions, trivia.topicOf);
    $('editor-day-title').textContent = `${weekly.daysOfWeek[week.indexOf(activeDate)]} · ${activeDate}`;
    $('editor-day-progress').textContent = weekly.isApproved(day)
      ? `Approved by ${day.approval.by}` : validity.length ? 'Draft in progress' : 'Ready for playtest and review';
    $('clear-approval').disabled = !day.approval;
  }

  function renderDay() {
    renderDays();
    $('review-note').value = draft.days[activeDate].note ?? '';
    const template = $('editor-hole-template');
    $('editor-holes').replaceChildren(...draft.days[activeDate].questions.map((q, index) => {
      const card = template.content.firstElementChild.cloneNode(true);
      card.dataset.hole = index;
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
    if (save()) notice('');
    renderDays();
  }

  function readyDay() {
    const day = draft.days[activeDate];
    const errors = weekly.validationErrors(day.questions, trivia.topicOf);
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
  $('editor-holes').addEventListener('input', event => {
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
