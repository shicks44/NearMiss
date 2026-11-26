(() => {
  const panel = document.getElementById('daily-standings');
  const switcher = document.getElementById('standings-toggle');
  const scoreList = document.getElementById('score-list');
  let renderId = 0;

  function showStandings(open) {
    panel.classList.toggle('hidden', !open);
    scoreList.classList.toggle('hidden', open);
    switcher.setAttribute('aria-expanded', String(open));
    switcher.textContent = open ? 'Hole scores' : 'Daily standings';
  }

  switcher.addEventListener('click', () => showStandings(panel.classList.contains('hidden')));

  function render(stats) {
    const summary = document.createElement('p');
    const place = stats.tied > 1 ? 'Tied for #' : '#';
    summary.textContent = stats.players === 1 ? 'You’re the first finisher. Daily average: ' + stats.average
      : place + stats.rank + ' of ' + stats.players + ' · Daily average: ' + stats.average;
    const comparison = document.createElement('p');
    comparison.textContent = stats.percentile === null ? 'Check back as more players finish.'
      : 'Higher than ' + stats.percentile + '% of other finishers · ' + stats.tied + ' scored ' + stats.score;
    const maxCount = Math.max(1, ...stats.bands.map(band => band.count));
    const rows = stats.bands.map(({ min, max, count }) => {
      const row = document.createElement('div');
      row.className = 'standings-row';
      const yours = stats.score >= min && stats.score <= max;
      const label = document.createElement('span');
      label.textContent = min + '–' + max + (yours ? ' · You' : '');
      const track = document.createElement('span');
      track.className = 'standings-track';
      track.setAttribute('aria-hidden', 'true');
      const bar = document.createElement('span');
      bar.className = 'standings-bar';
      bar.style.width = 100 * count / maxCount + '%';
      track.append(bar);
      const total = document.createElement('span');
      total.textContent = count.toLocaleString();
      if (yours) row.classList.add('your-band');
      row.append(label, track, total);
      return row;
    });
    panel.replaceChildren(summary, comparison, ...rows);
  }

  window.updateDailyStandings = async (date, score, practice) => {
    const run = ++renderId;
    showStandings(false);
    const eligible = !practice && date === new Date().toISOString().slice(0, 10);
    switcher.classList.toggle('hidden', !eligible);
    if (!eligible) return;
    panel.textContent = 'Loading daily standings…';
    try {
      const key = 'nearmiss-standings-id';
      const player = localStorage.getItem(key) || crypto.randomUUID();
      localStorage.setItem(key, player);
      const response = await fetch('/api/daily-standings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, score, player })
      });
      if (!response.ok) throw new Error('Standings unavailable');
      const stats = await response.json();
      if (run === renderId) render(stats);
    } catch {
      if (run === renderId) panel.textContent = 'Daily standings are unavailable right now.';
    }
  };
})();
