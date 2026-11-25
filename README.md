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

The daily and practice schedules draw from separate, non-repeating sequences. Sets mix surprising numerical facts with name-a-match questions. Named rounds distinguish each question by topic and displayed target. The answer is revealed after the shot finishes or the animation is skipped. The game stops offering new sets once the relevant sequence is exhausted.

The trivia bank links records to their sources in the data files. The geography sample in `world-data.js` uses World Bank Open Data (CC BY 4.0): population for 2024 and land area, forest cover, life expectancy, and urban population share for 2023. Food data comes from the FDA fruit and vegetable nutrition posters.

## Hosting

This is a static site with `index.html` at the repository root. It can be imported as a static project by a host such as Vercel without a build command or dependencies.

## Known limits

Progress is local to the browser. The question data and scoring code ship to each visitor, so daily scores are not cheat-resistant. There are no accounts, server-backed submissions, leaderboards, or shared group challenges yet.