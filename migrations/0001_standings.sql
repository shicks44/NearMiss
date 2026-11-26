CREATE TABLE daily_scores (
  day TEXT NOT NULL,
  player TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 500),
  PRIMARY KEY (day, player)
);

CREATE INDEX daily_scores_by_score ON daily_scores (day, score);
