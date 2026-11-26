const endpoint = '/api/daily-standings';
const bands = [[0, 99], [100, 199], [200, 299], [300, 399], [400, 500]];

function reply(value, status = 200) {
  return Response.json(value, { status, headers: { 'Cache-Control': 'no-store' } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== endpoint) return env.ASSETS.fetch(request);
    if (request.method !== 'POST') return reply({ error: 'Use POST.' }, 405);
    if (request.headers.get('Origin') !== url.origin) return reply({ error: 'Invalid origin.' }, 403);

    const body = await request.text();
    if (body.length > 256) return reply({ error: 'Request too large.' }, 413);
    let entry;
    try { entry = JSON.parse(body); } catch { return reply({ error: 'Invalid JSON.' }, 400); }
    const today = new Date().toISOString().slice(0, 10);
    if (entry?.date !== today || typeof entry.player !== 'string'
      || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(entry.player)
      || !Number.isInteger(entry.score) || entry.score < 0 || entry.score > 500) {
      return reply({ error: 'Invalid daily score.' }, 400);
    }

    try {
      const [, own, histogram] = await env.SCORES.batch([
        env.SCORES.prepare('INSERT INTO daily_scores (day, player, score) VALUES (?, ?, ?) ON CONFLICT(day, player) DO NOTHING')
          .bind(today, entry.player.toLowerCase(), entry.score),
        env.SCORES.prepare('SELECT score FROM daily_scores WHERE day = ? AND player = ?')
          .bind(today, entry.player.toLowerCase()),
        env.SCORES.prepare('SELECT score, COUNT(*) AS players FROM daily_scores WHERE day = ? GROUP BY score')
          .bind(today)
      ]);
      const score = own.results[0].score;
      const count = predicate => histogram.results.reduce((total, row) => total + (predicate(row.score) ? row.players : 0), 0);
      const players = count(() => true);
      const rank = count(value => value > score) + 1;
      const lower = count(value => value < score);
      const tied = count(value => value === score);
      const average = Math.round(histogram.results.reduce((sum, row) => sum + row.score * row.players, 0) / players);
      return reply({
        score, players, rank, tied, average,
        percentile: players > 1 ? Math.round(100 * lower / (players - 1)) : null,
        bands: bands.map(([min, max]) => ({ min, max, count: count(value => value >= min && value <= max) }))
      });
    } catch (error) {
      console.error('Daily standings query failed', error);
      return reply({ error: 'Standings unavailable.' }, 503);
    }
  }
};
