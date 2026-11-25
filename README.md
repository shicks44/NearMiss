# NEAR MISS

A small daily browser game of nerve. Five rounds, five targets: name an item with a value as close as possible without going over.

## Play

Open `index.html` in a browser or serve this repository with any static host. No build step, account, or environment variables are required.

- The daily puzzle is deterministic and changes at midnight UTC.
- Score: `round(100 × answer value ÷ target)`, capped at 100. Going over scores zero.
- Each round has a 30-second shot clock. Clear typos are autocorrected, and unrecognized answers can be retried while the clock runs. A timeout scores zero.
- The camera follows the pixel golfer’s ball toward the flag for valid guesses. A guess that goes over the target lands in the water.
- Daily attempts, results, streaks, and score history stay in local browser storage.
- Practice rounds do not change daily stats.

## Data

The launch edition includes curated answer sets for elements, planets, mountains, movies, countries, and animals. Each question links to a source reference. Some measurements vary by source, year, or method; those limitations are noted in the game.

## Hosting

This is a static site with `index.html` at the repository root. It can be imported as a static project by a host such as Vercel without a build command or dependencies.

## Known limits

Progress is local to the browser. The question data and scoring code ship to each visitor, so daily scores are not cheat-resistant. There are no accounts, server-backed submissions, leaderboards, or shared group challenges yet.