(() => {
  const panel = document.getElementById('daily-standings');
  const content = document.getElementById('standings-content');
  let renderId = 0;

  function render(stats) {
    const heading = document.createElement('div');
    heading.className = 'standings-heading';
    const average = document.createElement('h2');
    const value = document.createElement('span');
    value.className = 'standings-average';
    value.textContent = stats.average.toLocaleString();
    average.append(value);
    const scale = document.createElement('span');
    scale.textContent = '/ 500 average';
    heading.append(average, scale);

    const summary = document.createElement('p');
    summary.className = 'standings-summary';
    const rank = document.createElement('strong');
    const place = stats.tied > 1 ? 'Tied for #' : '#';
    rank.textContent = stats.players === 1 ? 'First finisher' : place + stats.rank + ' of ' + stats.players.toLocaleString();
    summary.append(rank, ' · Daily average ' + stats.average);

    const plot = document.createElement('div');
    plot.className = 'standings-plot';
    plot.setAttribute('role', 'list');
    plot.setAttribute('aria-label', 'Finishers by score range');
    plot.style.setProperty('--band-count', stats.bands.length);
    const maxCount = Math.max(1, ...stats.bands.map(band => band.count));

    for (const { min, max, count } of stats.bands) {
      const column = document.createElement('div');
      column.className = 'standings-column';
      column.setAttribute('role', 'listitem');
      const yours = stats.score >= min && stats.score <= max;
      const label = min + '–' + max + ' points: ' + count.toLocaleString() + (count === 1 ? ' finisher' : ' finishers');
      column.title = yours ? label + ' · You scored ' + stats.score : label;
      column.setAttribute('aria-label', column.title);
      column.style.setProperty('--bar-height', 100 * count / maxCount + '%');

      if (count) {
        const bar = document.createElement('div');
        bar.className = 'standings-bar';
        column.append(bar);
      }
      if (yours) {
        column.classList.add('your-band');
        const marker = document.createElement('div');
        marker.className = 'standings-marker';
        marker.setAttribute('aria-hidden', 'true');
        const golfer = document.createElement('canvas');
        golfer.width = 30;
        golfer.height = 36;
        window.drawStandingsGolfer?.(golfer);
        const you = document.createElement('span');
        you.textContent = 'You';
        marker.append(you, golfer);
        column.append(marker);
      }
      plot.append(column);
    }

    const axis = document.createElement('div');
    axis.className = 'standings-axis';
    axis.setAttribute('aria-hidden', 'true');
    for (let score = 0; score <= 500; score += 100) {
      const tick = document.createElement('span');
      tick.textContent = score;
      axis.append(tick);
    }

    const caption = document.createElement('p');
    caption.className = 'standings-caption';
    caption.textContent = stats.percentile === null ? 'Check back as more players finish.'
      : 'You scored higher than ' + stats.percentile + '% of other finishers.';
    content.replaceChildren(heading, summary, plot, axis, caption);
  }

  window.updateDailyStandings = async (date, score, practice) => {
    const run = ++renderId;
    const eligible = !practice && date === new Date().toISOString().slice(0, 10);
    panel.classList.toggle('hidden', !eligible);
    content.textContent = eligible ? 'Loading daily standings…' : '';
    if (!eligible) return;
    let response;
    try {
      const key = 'nearmiss-standings-id';
      const player = localStorage.getItem(key) || crypto.randomUUID();
      localStorage.setItem(key, player);
      response = await fetch('/api/daily-standings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, score, player })
      });
      if (!response.ok) throw new Error('Standings unavailable');
      const stats = await response.json();
      if (run === renderId) render(stats);
    } catch {
      if (run !== renderId) return;
      const message = document.createElement('p');
      message.className = 'standings-message';
      message.textContent = 'Daily standings are unavailable right now.';
      const localStaticPreview = window.NearMissWeekly?.loopback(location.hostname)
        && location.port !== '8787' && [404, 405, 501].includes(response?.status);
      if (localStaticPreview) {
        message.textContent = 'This preview has no standings service. ';
        const preview = document.createElement('a');
        preview.href = 'http://127.0.0.1:8787/';
        preview.textContent = 'Open the Wrangler preview';
        message.append(preview, '.');
        content.replaceChildren(message);
        return;
      }
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'secondary-button';
      retry.textContent = 'Retry standings';
      retry.onclick = () => window.updateDailyStandings(date, score, practice);
      content.replaceChildren(message, retry);
    }
  };
})();
