# NEAR MISS

A small daily browser game of nerve. Five rounds, five targets: name an item with a value as close as possible without going over.

## Play

Open `index.html` in a browser or serve this repository with any static host. No build step, account, or environment variables are required.

- The daily puzzle is deterministic and changes at midnight UTC.
- An exact match earns 100 points and a hole in one. Short guesses earn up to 99 using `round(100 × answer value ÷ target)`. Going over scores zero.
- Each round has a 30-second shot clock. Clear typos are autocorrected, and unrecognized answers can be retried while the clock runs. A timeout scores zero.
- The game panel clears while the camera follows the ball. You can skip the animation or replay the shot from the result. A guess that goes over the target lands in the water or, for a huge overshoot, flies off the course.
- Daily attempts, results, streaks, and score history stay in local browser storage.
- Practice rounds do not change daily stats.

## Courses

Finish the daily puzzle on 7, 30, 60, 90, 120, 150, 180, and 210 consecutive days to unlock eight courses. Preview any course in the Clubhouse; shots keep the same scoring even when the surface changes their flight or roll. If you earned a course under the previous streak rules, it stays unlocked. Courses stay unlocked and can be selected in the Clubhouse. Earn the Golden Ace ball with a daily hole in one and the Coral Tour ball with a daily score of 400 or more. Practice does not count toward a streak.

## Data

The daily and practice schedules draw from separate, non-repeating sequences. New five-hole sets use five distinct topics, with coin weight and diameter grouped together and at most two World Bank questions per set. The game favors an accessible opening clue and keeps exact hits for 100 points. Named rounds distinguish each question by topic and displayed target. The answer is revealed after the shot finishes or the animation is skipped. The game stops offering new sets once the relevant sequence is exhausted.

The trivia bank links records to their sources in the data files. The original questions in `fact-pack.js` cover animals, food records, sports, music, toys, art, landmarks, engineering, and more. Candidates belong to either Daily or Practice, with extra questions held in reserve to avoid repeating questions from older saves. The geography sample in `world-data.js` uses World Bank Open Data (CC BY 4.0): population for 2024 and land area, forest cover, life expectancy, and urban population share for 2023. Food data comes from FDA nutrition posters. MLB reference questions use historical regular-season standings.

## Hosting

This is a static site with `index.html` at the repository root. It can be imported as a static project by a host such as Vercel without a build command or dependencies.

## Known limits

Progress is local to the browser. The question data and scoring code ship to each visitor, so daily scores are not cheat-resistant. There are no accounts, server-backed submissions, leaderboards, or shared group challenges yet.
## Editorial weeks

1. Start the local web server and open [Weekly Editor](http://127.0.0.1:3000/tools/weekly-editor.html). Pick the Monday for the week. The editor creates a draft for Monday through Sunday.
2. Ask Codex to prepare a NearMiss week draft for that Monday, or enter the questions directly. Import or export the draft JSON to share it with teammates. Drafts stay in the browser or the files you share.
3. Open each source, use **Playtest day**, and leave review notes or approve the five holes. Editing a question clears that day's approval. Importing a teammate’s copy combines approvals for matching questions. The editor asks before replacing conflicting local questions.
4. Export the reviewed week. From the repository folder run:

   ```powershell
   node tools/publish-week.cjs "C:\path\to\nearmiss-YYYY-MM-DD-reviewed.json" --check
   node tools/publish-week.cjs "C:\path\to\nearmiss-YYYY-MM-DD-reviewed.json"
   ```

The second command stages reviewed questions in `weekly-schedule.js` locally. Commit and deploy that file before the week starts. Each set takes over at 00:00 UTC on its date. The automatic rotation supplies any unplanned day. Existing in-progress or completed daily rounds stay saved.

The publisher requires five distinct topics per day, a clue, an exact answer, an HTTPS source for every hole, and approvals for all seven days. It rejects repeated questions and already-scheduled dates. Playtests leave Daily and Practice progress alone. Local draft files are not read by the public game.

Draft JSON uses `{ "version": 1, "monday": "YYYY-MM-DD", "days": { "YYYY-MM-DD": { "questions": [ ... ] } } }`. A numeric hole has `numeric: true` and fields `category`, `prompt`, `unit`, `target`, `hint`, `source`, and `url`. A name-a-match hole has `numeric: false` and an `answers` array of `{ "name": "...", "value": 1, "aliases": [] }`. Use the editor to record approvals.
