(() => {
  const DATA = window.nearMissDecks;
  const $=id=>document.getElementById(id), views=['intro','game','results','stats'];
  const state={rounds:[],index:0,practice:false,preview:false,date:null,deadline:null};
  const read=()=>{try{return JSON.parse(localStorage.getItem('nearmiss-v1')||'{}')}catch{return{}}};
  const write=o=>localStorage.setItem('nearmiss-v1',JSON.stringify(o));
  const utcDate=()=>new Date().toISOString().slice(0,10);
  const dayNumber=()=>Math.floor((Date.parse(utcDate()+'T00:00:00Z')-Date.UTC(2026,0,1))/86400000)+1;
  function formatValue(value, unit) {
    const number = value.toLocaleString(undefined, { maximumFractionDigits: 4 });
    if (unit === 'year') return String(value);
    if (unit === 'atomic number') return number;
    if (unit === 'thousand km²') return `${number}k km²`;
    const shorthand = { 'km across': 'km', 'metres above sea level': 'm', minutes: 'min' };
    return unit === '%' ? `${number}%` : `${number} ${shorthand[unit] ?? unit}`;
  }

  function exactTargets(answers) {
    const countByValue = new Map();
    for (const { value } of answers) {
      if (Number.isFinite(value) && value > 0) {
        countByValue.set(value, (countByValue.get(value) ?? 0) + 1);
      }
    }
    return Array.from(countByValue.keys()).filter(value => countByValue.get(value) === 1);
  }

  const trivia = window.nearMissTrivia;
  const weekly = window.NearMissWeekly;
  const authoredSchedule = window.nearMissWeeklySchedule;

  function readWeeklyPreview() {
    if (!weekly.loopback(location.hostname) || !new URLSearchParams(location.search).has('weekly-preview')) return null;
    try {
      const day = JSON.parse(sessionStorage.getItem(weekly.previewKey));
      return day && weekly.validationErrors(day.questions, trivia.topicOf).length === 0 ? day : null;
    } catch {
      return null;
    }
  }
  const hydrate = round => round.bank ? { ...round, answers: trivia.answersFor(round.bank) } : round;

  function storedRounds(rounds) {
    return rounds.map(round => {
      if (!round.bank) return round;
      const { answers, ...compact } = round;
      return compact;
    });
  }

  function makePuzzle(index, practice, seen = new Set()) {
    const mode = Number(practice);
    const scheduled = trivia.schedules[mode][index];
    if (!scheduled) return [];
    const unseen = scheduled.filter(q => !seen.has(trivia.identity(q)));
    const topicsUsed = new Set(unseen.map(trivia.topicOf));
    const used = new Set(seen);
    const rounds = [];
    for (const question of scheduled) {
      let selected = question;
      if (used.has(trivia.identity(question))) {
        const topic = trivia.topicOf(question);
        const valid = candidate => !used.has(trivia.identity(candidate)) && !topicsUsed.has(trivia.topicOf(candidate));
        selected = trivia.reserves[mode].find(candidate => valid(candidate) && trivia.topicOf(candidate) === topic)
          ?? trivia.reserves[mode].find(valid);
        if (!selected) return [];
      }
      used.add(trivia.identity(selected));
      topicsUsed.add(trivia.topicOf(selected));
      rounds.push(hydrate({ ...selected }));
    }
    return rounds;
  }

  function playedQuestions(saved) {
    const oldPractice = trivia.legacy[1].slice(0, saved.triviaPracticeCursor ?? 0).flat();
    const savedDaily = Object.values(saved.days ?? {}).flatMap(day => day.rounds ?? []);
    return new Set([
      ...oldPractice.map(trivia.identity),
      ...savedDaily.map(trivia.identity),
      ...(saved.balancedPracticeSeen ?? [])
    ]);
  }
  function show(name){views.forEach(v=>$(v).classList.toggle('hidden',v!==name));window.scrollTo(0,0)}
  function current(){return state.rounds[state.index]}
  const roundDuration = 30000;
  let roundClock;
  let statsReturn = 'intro';

  const courses = [
    { id: 'pine', name: 'Pine Hollow', days: 0, feel: 'Classic flight and rollout' },
    { id: 'desert', name: 'Copper Dunes', days: 7, feel: 'Firm sand gives the ball an extra bounce' },
    { id: 'coast', name: 'Beacon Bay', days: 30, feel: 'A low shot that skims the coastal fairway' },
    { id: 'alpine', name: 'Frostline Ridge', days: 60, feel: 'Frost makes the ball slide farther' },
    { id: 'autumn', name: 'Maple Run', days: 90, feel: 'Soft leaves shorten the rollout' },
    { id: 'marsh', name: 'Reedwater Marsh', days: 120, feel: 'Wet turf slows the ball quickly' },
    { id: 'volcano', name: 'Ember Caldera', days: 150, feel: 'Hard basalt makes the ball bounce high' },
    { id: 'moon', name: 'Moonlight Links', days: 180, feel: 'Low gravity keeps the ball airborne longer' },
    { id: 'aurora', name: 'Aurora Summit', days: 210, feel: 'A high arc and a long glide over ice' }
  ];
  const coursesPerPage = 3;
  let coursePage = 0;
  let previewCourseId = courses[0].id;

  function preserveLegacyCourses() {
    const saved = read();
    if (saved.courseUnlockVersion || !saved.stats?.games) return;
    const longest = Math.max(saved.stats.longest ?? 0, saved.stats.streak ?? 0);
    const previous = [['desert', 3], ['alpine', 7], ['moon', 14]];
    saved.legacyCourses = previous.filter(([, days]) => longest >= days).map(([id]) => id);
    saved.courseUnlockVersion = 2;
    write(saved);
  }

  const balls = [
    { id: 'pearl', name: 'Pearl', color: '#fff9df', condition: 'Starting ball' },
    { id: 'gold', name: 'Golden Ace', color: '#ffd276', condition: 'Get a daily hole in one', requires: 'ace' },
    { id: 'coral', name: 'Coral Tour', color: '#ff9c8c', condition: 'Score 400 on a daily', requires: 'score' }
  ];

  function currentStreak(stats = {}) {
    const today = utcDate();
    const yesterday = new Date(Date.parse(today) - 86400000).toISOString().slice(0, 10);
    return stats.lastDate === today || stats.lastDate === yesterday ? stats.streak ?? 0 : 0;
  }

  function collection(saved) {
    const longest = Math.max(saved.stats?.longest ?? 0, saved.stats?.streak ?? 0);
    const completed = Object.values(saved.days ?? {}).filter(day => day.done);
    const hasAce = completed.some(day => day.rounds?.some(round => round.result?.value === round.target));
    const hasScore = (saved.stats?.best ?? 0) >= 400 || completed.some(day => day.score >= 400);
    return {
      courses: courses.filter(course => course.days <= longest || saved.legacyCourses?.includes(course.id)),
      balls: balls.filter(ball => !ball.requires || (ball.requires === 'ace' ? hasAce : hasScore))
    };
  }

  function renderCollection(grid, items, allowed, selected, type) {
    const focused = grid.contains(document.activeElement) ? document.activeElement.dataset.choice : null;
    grid.replaceChildren(...items.map(item => {
      const unlocked = allowed.includes(item);
      const active = item === selected;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `collection-card ${type}-card`;
      button.disabled = type === 'ball' && !unlocked;
      button.dataset.choice = item.id;
      button.setAttribute('aria-pressed', String(type === 'course' ? item.id === previewCourseId : active));
      if (type === 'course' && active) button.dataset.equipped = 'true';
      const requirement = type === 'course'
        ? item.days ? `${item.days}-day streak` : 'Starting course'
        : item.condition;
      const status = active ? 'In use' : unlocked ? 'Unlocked' : 'Locked';
      button.innerHTML = `<span class="collection-preview" aria-hidden="true"></span><span class="collection-name">${item.name}</span><span class="collection-status">${status}</span><small>${requirement}</small>`;
      if (item.color) button.style.setProperty('--ball-swatch', item.color);
      return button;
    }));
    if (focused) {
      Array.from(grid.children).find(button => button.dataset.choice === focused)?.focus({ preventScroll: true });
    }
  }

  function renderCoursePage(unlocked, equipped) {
    const visibleCourses = courses.slice(coursePage * coursesPerPage, (coursePage + 1) * coursesPerPage);
    renderCollection($('course-grid'), visibleCourses, unlocked, equipped, 'course');
    $('course-before').disabled = coursePage === 0;
    $('course-after').disabled = (coursePage + 1) * coursesPerPage >= courses.length;
    $('course-page').textContent = `Page ${coursePage + 1} of ${Math.ceil(courses.length / coursesPerPage)}`;
    const preview = courses.find(course => course.id === previewCourseId);
    const canEquip = unlocked.includes(preview);
    $('preview-name').textContent = preview.name;
    $('preview-physics').textContent = preview.feel;
    const equip = $('equip-course');
    equip.disabled = !canEquip || preview === equipped;
    equip.textContent = preview === equipped ? 'Equipped' : canEquip ? 'Equip course' : `${preview.days}-day streak`;
    window.drawCoursePreview?.($('course-preview'), preview.id);
  }

  function updateClubhouse() {
    const saved = read();
    const unlocked = collection(saved);
    const selectedCourse = unlocked.courses.find(course => course.id === saved.course) ?? unlocked.courses.at(-1);
    const selectedBall = unlocked.balls.find(ball => ball.id === saved.ball) ?? unlocked.balls[0];
    renderCoursePage(unlocked.courses, selectedCourse);
    renderCollection($('ball-grid'), balls, unlocked.balls, selectedBall, 'ball');
    const next = courses.find(course => !unlocked.courses.includes(course));
    $('course-caption').textContent = selectedCourse.name;
    const streak = currentStreak(saved.stats);
    $('clubhouse-progress').textContent = next
      ? `Daily streak: ${streak} / ${next.days} days for ${next.name}.`
      : 'All courses unlocked.';
    window.setGolfCourse?.(selectedCourse.id);
    window.setGolfBall?.(selectedBall.color);
  }

  function chooseBall(event) {
    const choice = event.target.closest('button[data-choice]');
    if (!choice || choice.disabled) return;
    const saved = read();
    if (!collection(saved).balls.some(ball => ball.id === choice.dataset.choice)) return;
    saved.ball = choice.dataset.choice;
    write(saved);
    updateClubhouse();
  }

  function equipCourse() {
    const saved = read();
    if (!collection(saved).courses.some(course => course.id === previewCourseId)) return;
    saved.course = previewCourseId;
    write(saved);
    updateClubhouse();
    $('course-grid').querySelector('[aria-pressed="true"]')?.focus({ preventScroll: true });
  }

  function selectClubhouseTab(id) {
    for (const name of ['courses', 'balls']) {
      const selected = id === name;
      $(`${name}-tab`).setAttribute('aria-selected', String(selected));
      $(`${name}-tab`).tabIndex = selected ? 0 : -1;
      $(`${name}-panel`).classList.toggle('hidden', !selected);
    }
  }

  function openClubhouse() {
    selectClubhouseTab('courses');
    updateClubhouse();
    $('clubhouse-dialog').showModal();
  }

  function resume() {
    const date = utcDate();
    const daily = read().days?.[date];
    if (!daily) return false;
    state.practice = false;
    state.date = date;
    state.rounds = (daily.rounds || []).map(savedRound => {
      const round = hydrate(savedRound);
      if (round.bank) return round;
      const deck = DATA.find(item => item.category === round.category);
      if (!deck || !round.answers) return round;
      // Older saves copied the answer bank before the current aliases were added.
      const aliasesByName = new Map(deck.items.map(([name, , ...aliases]) => [name, aliases]));
      const answers = round.answers.map(answer => ({
        ...answer,
        aliases: [...new Set([...(answer.aliases ?? []), ...(aliasesByName.get(answer.name) ?? [])])]
      }));
      if (round.result) return { ...round, answers };
      const targets = exactTargets(answers);
      // Keep the target when it already has one exact match. For older rounds,
      // choose the nearest eligible value without changing any completed shots.
      const target = targets.reduce((nearest, candidate) =>
        Math.abs(candidate - round.target) < Math.abs(nearest - round.target) ? candidate : nearest,
      targets[0] ?? round.target);
      return { ...round, target, answers };
    });
    state.index = daily.index || 0;
    state.deadline = daily.deadline ?? null;
    if (daily.done) {
      renderResults(daily);
      return true;
    }
    if (!state.rounds.length) return false;
    show('game');
    renderRound();
    return true;
  }

  function persist() {
    if (state.practice) return;
    const all = read();
    all.days ||= {};
    if (all.days[state.date]?.done) return;
    all.days[state.date] = {
      rounds: storedRounds(state.rounds), index: state.index, deadline: state.deadline, done: false
    };
    write(all);
  }

  function start(practice = false) {
    const date = utcDate();
    const saved = read();
    let index = practice ? saved.curatedPracticeCursor ?? 0
      : Math.max(0, Math.floor((Date.parse(date) - weekly.rotationStart) / 86400000));
    const seen = playedQuestions(saved);
    const authored = practice ? null : authoredSchedule[date];
    let rounds = authored ? authored.map(q => ({ ...q })) : makePuzzle(index, practice, seen);
    while (practice && !rounds.length && index + 1 < trivia.schedules[1].length) {
      rounds = makePuzzle(++index, practice, seen);
    }
    if (!rounds.length) {
      toast(practice ? 'You’ve played every available practice question.' : 'The daily question bank needs more questions.');
      return;
    }
    if (practice) {
      saved.curatedPracticeCursor = index + 1;
      saved.balancedPracticeSeen = [...(saved.balancedPracticeSeen ?? []), ...rounds.map(trivia.identity)];
      write(saved);
    }
    state.practice = practice;
    state.date = date;
    state.rounds = rounds;
    state.index = 0;
    state.deadline = null;
    show('game');
    renderRound();
  }

  function renderRound() {
    const q = current();
    if (!q) {
      finish();
      return;
    }
    $('round-category').textContent = q.category;
    $('round-difficulty').textContent = q.difficulty;
    $('round-count').innerHTML = `${String(state.index + 1).padStart(2, '0')} <b>/ 05</b>`;
    $('round-progress').style.width = `${((state.index + 1) / 5) * 100}%`;
    $('question-prompt').textContent = q.prompt;
    $('baseline-hint').textContent = `For scale: ${trivia.hintFor(q)}`;
    $('target-label').textContent = q.numeric ? 'GUESS IN' : 'THE TARGET';
    $('target-value').textContent = q.numeric ? q.unit : formatValue(q.target, q.unit);
    $('answer-input').inputMode = q.numeric ? 'decimal' : 'text';
    $('answer-input').placeholder = q.numeric ? 'Enter a number…' : 'Type your answer…';
    $('daily-label').textContent = state.preview ? 'WEEKLY PLAYTEST' : state.practice ? 'PRACTICE MODE' : `DAILY NO. ${String(dayNumber()).padStart(3, '0')}`;
    if (q.result) {
      renderShot(q);
      return;
    }
    $('question-card').classList.remove('hidden');
    $('entry-area').classList.remove('hidden');
    $('reveal').classList.add('hidden');
    $('round-clock').classList.remove('hidden');
    $('answer-input').value = '';
    clearAnswerError();
    window.renderGolf?.();
    state.deadline ??= Date.now() + roundDuration;
    persist();
    clearInterval(roundClock);
    updateRoundClock();
    if (!q.result) {
      roundClock = setInterval(updateRoundClock, 100);
      $('answer-input').focus({ preventScroll: true });
    }
  }

  function updateRoundClock() {
    const remaining = Math.max(0, state.deadline - Date.now());
    const seconds = Math.ceil(remaining / 1000);
    const clock = $('round-clock');
    const display = `${seconds}s`;
    if ($('round-seconds').textContent !== display) $('round-seconds').textContent = display;
    clock.style.setProperty('--time-remaining', remaining / roundDuration);
    clock.classList.toggle('urgent', seconds <= 5);
    if (remaining === 0) {
      completeShot(current(), { name: 'No shot', score: 0, timedOut: true, label: 'Whiff! Time’s up - No points' });
    }
  }

  const answerHint = 'Type your answer, then lock it in.';
  const normalizeAnswer = value => value.toLowerCase().normalize('NFD')
    .replace(/\p{M}/gu, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

  function editDistance(a, b) {
    let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
    let earlier;
    for (let i = 1; i <= a.length; i++) {
      const row = [i];
      for (let j = 1; j <= b.length; j++) {
        row[j] = Math.min(row[j - 1] + 1, previous[j] + 1,
          previous[j - 1] + Number(a[i - 1] !== b[j - 1]));
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          row[j] = Math.min(row[j], earlier[j - 2] + 1);
        }
      }
      earlier = previous;
      previous = row;
    }
    return previous[b.length];
  }

  function answerForms(value) {
    const normalized = normalizeAnswer(value);
    const withoutArticle = normalized.replace(/^the /, '');
    return [...new Set([normalized, withoutArticle].map(name => name.replaceAll(' ', '')))];
  }

  function matchAnswer(raw, answers) {
    const guesses = answerForms(raw);
    const candidates = answers.map(answer => ({
      answer,
      names: [...new Set([answer.name, ...(answer.aliases ?? [])].flatMap(answerForms))]
    }));
    const exact = candidates.filter(({ names }) => guesses.some(guess => names.includes(guess)));
    if (exact.length) {
      return exact.length === 1 ? { answer: exact[0].answer, corrected: false } : null;
    }

    let bestDistance = Infinity;
    let bestAnswer = null;
    for (const { answer, names } of candidates) {
      for (const guess of guesses) {
        if (guess.length < 3) continue;
        const maxEdits = guess.length >= 12 ? 3 : guess.length >= 7 ? 2 : 1;
        for (const name of names) {
          if (name.length < 3 || Math.abs(name.length - guess.length) > maxEdits) continue;
          // For two three-letter forms, accept swapped letters but avoid changing one word into another.
          if (guess.length === 3 && name.length === 3 && [...name].sort().join('') !== [...guess].sort().join('')) continue;
          const distance = editDistance(guess, name);
          if (distance > maxEdits) continue;
          if (distance < bestDistance) {
            bestDistance = distance;
            bestAnswer = answer;
          } else if (distance === bestDistance && bestAnswer !== answer) {
            bestAnswer = null;
          }
        }
      }
    }
    return bestAnswer ? { answer: bestAnswer, corrected: true } : null;
  }

  function clearAnswerError() {
    $('answer-input').removeAttribute('aria-invalid');
    $('input-hint').textContent = current()?.numeric ? 'Get as close as you can without going over.' : answerHint;
  }

  function score(q, a) {
    if (a.value > q.target) return 0;
    if (a.value === q.target) return 100;
    return Math.min(99, Math.max(0, Math.round(100 * a.value / q.target)));
  }
  function shotLabel(q, a, points) {
    if (a.value > q.target) return 'OB - No points';
    if (a.value === q.target) return 'Hole in one!';
    if (a.value / q.target >= 0.9) return 'On the green';
    if (points >= 75) return 'Just off the green';
    if (points >= 50) return 'Fairway finder';
    return 'In the rough';
  }

  function readEstimate(typed, unit) {
    const match = /^(\+?(?:(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?|\.\d+))\s*(.*)$/.exec(typed);
    if (!match) return NaN;
    const suffix = match[2].toLowerCase().trim();
    if (suffix === unit.toLowerCase()) return Number(match[1].replaceAll(',', ''));
    const scaleMatch = /^(thousand|million|billion|trillion)\b\s*(.*)$/.exec(suffix);
    const scales = { thousand: 1e3, million: 1e6, billion: 1e9, trillion: 1e12 };
    const multiplier = scaleMatch ? scales[scaleMatch[1]] : 1;
    const typedUnit = scaleMatch ? scaleMatch[2] : suffix;
    const units = [unit.toLowerCase(), unit.toLowerCase().replace(/s$/, '')];
    if (unit === '%') units.push('percent');
    if (unit === 'hours') units.push('h', 'hr', 'hrs');
    if (unit === 'minutes') units.push('min', 'mins');
    if (unit === 'metres') units.push('m', 'meter', 'meters');
    if (unit === 'feet') units.push('ft', 'foot');
    if (unit === 'miles') units.push('mi');
    if (unit === 'yards') units.push('yd', 'yds');
    if (unit === 'inches') units.push('in', 'inch');
    if (unit === 'mL') units.push('millilitre', 'millilitres', 'milliliter', 'milliliters');
    if (unit === 'cm') units.push('centimetre', 'centimetres', 'centimeter', 'centimeters');
    if (unit === 'mm') units.push('millimetre', 'millimetres', 'millimeter', 'millimeters');
    if (unit === 'g') units.push('gram', 'grams');
    if (unit === 'pounds') units.push('lb', 'lbs', 'pound');
    if (unit === 'ounces') units.push('oz', 'ounce');
    if (unit === 'seconds') units.push('s', 'sec', 'secs');
    if (unit === 'metres') units.push('meters');
    if (unit === 'million people') units.push('people');
    return !typedUnit || units.includes(typedUnit) ? Number(match[1].replaceAll(',', '')) * multiplier : NaN;
  }

  function submit(event) {
    event.preventDefault();
    if ($('entry-area').classList.contains('hidden')) return;
    if (Date.now() >= state.deadline) {
      updateRoundClock();
      return;
    }
    const q = current();
    const input = $('answer-input');
    const typed = input.value.trim();
    const raw = normalizeAnswer(typed);
    const numericValue = q.numeric ? readEstimate(typed, q.unit) : NaN;
    const match = q.numeric
      ? Number.isFinite(numericValue) && { answer: { name: formatValue(numericValue, q.unit), value: numericValue } }
      : raw && matchAnswer(raw, q.answers);
    if (!match) {
      input.setAttribute('aria-invalid', 'true');
      $('input-hint').textContent = typed ? q.numeric ? `Enter a number in ${q.unit}, such as 12 or 12.5.` : 'Wrong hole, try again' : 'Enter an answer first.';
      input.focus();
      return;
    }
    const { answer: a, corrected } = match;
    const points = score(q, a);
    completeShot(q, {
      name: a.name, value: a.value, score: points, bust: a.value > q.target,
      corrected, label: shotLabel(q, a, points), source: q.source, url: q.url
    });
  }

  function completeShot(q, result) {
    q.result = result;
    state.deadline = null;
    persist();
    renderShot(q, true);
  }

  function renderShot(q, animate = false) {
    clearInterval(roundClock);
    const result = q.result;
    const { name, value, score: points, bust, timedOut, corrected } = result;
    $('replay-shot').classList.toggle('hidden', matchMedia('(prefers-reduced-motion: reduce)').matches);
    $('round-clock').classList.add('hidden');
    $('question-card').classList.add('hidden');
    $('entry-area').classList.add('hidden');
    $('reveal').classList.add('hidden');
    $('reveal').dataset.outcome = bust ? 'bust' : timedOut ? 'timeout' : value === q.target ? 'exact' : 'under';
    $('result-pick-label').textContent = corrected ? 'AUTOCORRECTED PICK' : timedOut ? 'ROUND RESULT' : 'YOUR PICK';
    $('result-name').textContent = name;
    $('result-label').textContent = result.label;
    $('score-chip').textContent = points;
    const target = formatValue(q.target, q.unit);
    const closest = q.answers?.reduce((best, answer) => {
      if (answer.value > q.target || (best && answer.value <= best.value)) return best;
      return answer;
    }, null);
    $('answer-reveal-label').textContent = q.numeric ? 'Correct answer'
      : closest?.value === q.target ? 'Exact match' : closest ? 'Closest valid answer' : 'Target';
    $('correct-answer').textContent = closest ? `${closest.name} · ${formatValue(closest.value, q.unit)}` : target;
    $('score-chip').className = 'score-chip ' + (bust || timedOut ? 'bust' : points < 75 ? 'close' : '');
    $('next-btn').innerHTML = state.index === 4 ? 'See your score <span>↗</span>' : 'Next round <span>↗</span>';
    const watchShot = animate && !matchMedia('(prefers-reduced-motion: reduce)').matches && window.renderGolf;
    if (watchShot) {
      document.body.classList.add('watching-shot');
      $('shot-controls').classList.remove('hidden');
      $('shot-hole').textContent = `Hole ${state.index + 1} of ${state.rounds.length}`;
      $('skip-shot').focus({ preventScroll: true });
    }
    const showResult = () => {
      document.body.classList.remove('watching-shot');
      $('shot-controls').classList.add('hidden');
      $('reveal').classList.remove('hidden');
      if (animate && !$('game').classList.contains('hidden')) $('next-btn').focus({ preventScroll: true });
    };
    if (window.renderGolf) window.renderGolf(result, q.target, animate, showResult);
    else showResult();
  }

  function advance() {
    if (!current()?.result || $('reveal').classList.contains('hidden')) return;
    state.index++;
    state.deadline = null;
    if (state.index >= 5) {
      finish();
      return;
    }
    renderRound();
  }
  function titleFor(n){return n>=475?'INSANE':n>=450?'SHARPSHOOTER':n>=400?'DANGEROUS':n>=350?'SOLID':n>=250?'MID':'ROUGH DAY'}
  function finish() {
    const score = state.rounds.reduce((sum, q) => sum + (q.result?.score ?? 0), 0);
    const result = { rounds: storedRounds(state.rounds), index: 5, done: true, score, date: state.date };
    if (state.practice) {
      renderResults(result);
      return;
    }
    const all = read();
    all.days ||= {};
    if (all.days[state.date]?.done) {
      renderResults(all.days[state.date]);
      return;
    }
    const before = collection(all);
    all.days[state.date] = result;
    all.history ||= [];
    if (!all.history.some(day => day.date === state.date)) all.history.push({ date: state.date, score });
    all.history = all.history.slice(-14);
    const stats = all.stats ?? { games: 0, best: 0, streak: 0, longest: 0, lastDate: null };
    const yesterday = new Date(Date.parse(state.date) - 86400000).toISOString().slice(0, 10);
    stats.games++;
    stats.best = Math.max(stats.best, score);
    stats.streak = stats.lastDate === yesterday ? stats.streak + 1 : stats.lastDate === state.date ? stats.streak : 1;
    stats.longest = Math.max(stats.longest, stats.streak);
    stats.lastDate = state.date;
    all.stats = stats;
    all.courseUnlockVersion = 2;
    write(all);
    const after = collection(all);
    const previousItems = [...before.courses, ...before.balls];
    const newUnlocks = [...after.courses, ...after.balls]
      .filter(item => !previousItems.includes(item)).map(item => item.name);
    renderResults(result, newUnlocks);
  }
  function renderResults(result, newUnlocks = []){updateClubhouse();const notice=$('unlock-notice');notice.classList.toggle('hidden',!newUnlocks.length);notice.textContent=newUnlocks.length?`Unlocked: ${newUnlocks.join(', ')}`:'';
    $('daily-from-practice').classList.toggle('hidden',!state.practice);
    if (state.preview) $('daily-from-practice').textContent = 'Back to Weekly Editor';
    const rounds=result.rounds||[],score=result.score??rounds.reduce((a,q)=>a+(q.result?.score||0),0),busts=rounds.filter(q=>q.result?.bust).length,perfect=rounds.filter(q=>q.result?.value===q.target).length;$('final-title').textContent=titleFor(score)+'.';$('total-score').textContent=String(score).padStart(3,'0');$('results-sub').textContent=state.preview?'Playtest complete. Daily scores and streaks are unchanged.':state.practice?'Practice round complete. Daily stats stay untouched.':`Daily no. ${String(dayNumber()).padStart(3,'0')} · ${new Intl.DateTimeFormat('en',{weekday:'long',month:'short',day:'numeric',timeZone:'UTC'}).format(new Date(utcDate()+'T00:00:00Z'))} UTC`;$('score-list').innerHTML=rounds.map((q,i)=>`<div class="score-row"><span class="score-index">0${i+1}</span><div><div class="score-name">${escapeHtml(q.result?.name||'—')}</div><div class="score-category">${escapeHtml(q.category)} · ${escapeHtml(q.result?.label||'')}</div></div><span class="score-points">${q.result?.score??0}</span><span class="score-symbol ${q.result?.bust?'bust':''}">${q.result?.timedOut?'–':q.result?.bust?'×':q.result?.value===q.target?'★':'●'}</span></div>`).join('');const best=rounds.reduce((a,q)=>!a||q.result.score>a.result.score?q:a,null);$('result-metrics').innerHTML=`<div class="metric"><span>BUSTS</span><b>${busts}</b></div><div class="metric"><span>HOLES IN ONE</span><b>${perfect}</b></div><div class="metric"><span>BEST ROUND</span><b>${escapeHtml(best?.category||'—')}</b></div>`;$('practice-btn').textContent=state.practice?'Try another practice':'Practice mode';$('share-btn').onclick=()=>share(rounds,score,busts);tick();show('results');window.updateDailyStandings?.(result.date ?? state.date, score, state.practice)}
  const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  async function share(rounds,score,busts){const text=`NEAR MISS #${String(dayNumber()).padStart(3,'0')} 🎯\n\n${rounds.map(q=>q.result?.timedOut?'⌛':q.result?.bust?'🟥':q.result?.value===q.target?'🎯':q.result?.score>=90?'🟩':q.result?.score>=75?'🟨':q.result?.score>=50?'🟧':'⬜').join('  ')}\n\n${score}/500 · ${busts} BUST${busts===1?'':'S'}\n${window.location.host}`;try{if(navigator.share)await navigator.share({title:'My NEAR MISS score',text});else{await navigator.clipboard.writeText(text);toast('Score copied. Go compare.')}}catch(e){if(e.name!=='AbortError')toast('Could not share right now.')}}
  function tick(){const update=()=>{const n=new Date(),next=Date.UTC(n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate()+1),d=Math.max(0,next-n.getTime()),h=Math.floor(d/3600000),m=Math.floor(d%3600000/60000),s=Math.floor(d%60000/1000);$('countdown').textContent=[h,m,s].map(x=>String(x).padStart(2,'0')).join(':')};update();clearInterval(window.countdownInterval);window.countdownInterval=setInterval(update,1000)}
  function openStats(){if(!$('stats').classList.contains('hidden'))return;statsReturn=views.find(view=>!$(view).classList.contains('hidden'));const all=read(),s=all.stats||{games:0,best:0,streak:0,longest:0},hist=all.history||[];$('stats-grid').innerHTML=[[s.games,'GAMES'],[s.best,'BEST SCORE'],[currentStreak(s),'CURRENT STREAK'],[s.longest,'BEST STREAK'],[hist.length?Math.round(hist.reduce((a,x)=>a+x.score,0)/hist.length):0,'AVG SCORE'],[hist.reduce((a,x)=>a+x.score,0),'TOTAL POINTS']].map(([v,l])=>`<div class="stat-cell"><label>${l}</label><strong>${String(v).padStart(2,'0')}</strong></div>`).join('');$('chart').innerHTML=Array.from({length:7},(_,i)=>hist[hist.length-7+i]).map(x=>`<div class="chart-col"><div class="chart-bar" style="height:${Math.max(3,(x?.score||0)/5)}%" title="${x?.score||0}"></div><span>${x?.date?.slice(5)||'·'}</span></div>`).join('');show('stats')}
  function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2300)}
  $('start-btn').onclick = $('daily-from-practice').onclick = () => resume() || start(false);
  $('intro-practice').onclick = () => start(true);
  $('answer-input').addEventListener('input', clearAnswerError);
  $('clear-input').onclick = () => {
    $('answer-input').value = '';
    clearAnswerError();
    $('answer-input').focus();
  };
  $('entry-area').addEventListener('submit', submit);
  $('skip-shot').addEventListener('click', () => window.skipGolfShot?.());
  $('replay-shot').addEventListener('click', () => renderShot(current(), true));
  $('course-grid').addEventListener('click', event => {
    const card = event.target.closest('button[data-choice]');
    if (!card) return;
    previewCourseId = card.dataset.choice;
    updateClubhouse();
  });
  $('ball-grid').addEventListener('click', chooseBall);
  $('equip-course').addEventListener('click', equipCourse);
  for (const [id, offset] of [['course-before', -1], ['course-after', 1]]) {
    $(id).addEventListener('click', () => {
      coursePage += offset;
      previewCourseId = courses[coursePage * coursesPerPage].id;
      updateClubhouse();
      if ($(id).disabled) $('course-grid').firstElementChild.focus({ preventScroll: true });
    });
  }
  for (const id of ['courses', 'balls']) {
    const tab = $(`${id}-tab`);
    tab.addEventListener('click', () => selectClubhouseTab(id));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 'courses' : event.key === 'End' ? 'balls'
        : id === 'courses' ? 'balls' : 'courses';
      selectClubhouseTab(next);
      $(`${next}-tab`).focus();
    });
  }
  for (const id of ['clubhouse-open', 'stats-clubhouse', 'course-caption']) {
    $(id).addEventListener('click', openClubhouse);
  }
  const preview = readWeeklyPreview();
  if (weekly.loopback(location.hostname) && !preview) {
    $('editor-local-link').classList.remove('hidden');
    $('footer-build').classList.add('hidden');
  }
  if (!preview) preserveLegacyCourses();
  updateClubhouse();
  $('next-btn').onclick=advance;$('practice-btn').onclick=()=>start(true);$('stats-open').onclick=openStats;$('stats-close').onclick=()=>show(statsReturn);$('help-open').onclick=()=>$('help-dialog').showModal();$('about-open').onclick=()=>$('about-dialog').showModal();document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());$('daily-label').textContent=`DAILY NO. ${String(dayNumber()).padStart(3,'0')}`;$('footer-today').textContent=new Intl.DateTimeFormat('en',{month:'short',day:'numeric',timeZone:'UTC'}).format(new Date());
  if (preview) {
    state.preview = true;
    state.practice = true;
    state.date = preview.date;
    state.rounds = preview.questions.map(weekly.cleanQuestion);
    document.body.classList.add('weekly-playtest');
    $('weekly-return').classList.remove('hidden');
    $('daily-from-practice').onclick = () => location.assign('/tools/weekly-editor.html');
    show('game');
    renderRound();
  } else {
    resume();
  }
})();
