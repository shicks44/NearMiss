(() => {
  const refs = {
    thanksgiving: ['UofL Health, estimates of a Thanksgiving dinner', 'https://uoflhealth.org/articles/eat-what-you-love-this-thanksgiving/'],
    fiona: ['Cincinnati Zoo, Fiona’s birth', 'https://cincinnatizoo.org/hippo-baby-arrives-six-weeks-early-cincinnati-zoo-staff-providing-critical-care-for-premature-calf/'],
    pygmy: ['San Diego Zoo, pygmy hippopotamus', 'https://animals.sandiegozoo.org/animals/pygmy-hippopotamus'],
    giraffe: ['San Diego Zoo, giraffe', 'https://animals.sandiegozoo.org/animals/giraffe'],
    panda: ['Smithsonian National Zoo, giant panda cubs', 'https://nationalzoo.si.edu/sites/default/files/documents/giantpandasbackgrounder_2021.01.28_v3.pdf'],
    zeus: ['Guinness World Records, Zeus', 'https://www.guinnessworldrecords.com/news/icons/zeus-the-tallest-dog'],
    liberty: ['National Park Service, Statue of Liberty statistics', 'https://www.nps.gov/stli/learn/historyculture/statue-statistics.htm'],
    libertySteps: ['National Park Service, Statue of Liberty facts', 'https://www.nps.gov/stli/learn/statue-of-liberty-facts.htm'],
    eiffel: ['Eiffel Tower operator, key figures', 'https://www.toureiffel.paris/en/the-monument/key-figures'],
    eiffelSteps: ['Eiffel Tower operator, stairs', 'https://www.toureiffel.paris/en/faq/spot/how-can-you-walk-eiffel-tower-foot'],
    oldFaithful: ['National Park Service, Old Faithful', 'https://www.nps.gov/yell/learn/nature/hydrothermal-features.htm'],
    pumpkin: ['Guinness World Records, 2023 Half Moon Bay pumpkin', 'https://www.guinnessworldrecords.com/news/2023/10/good-gourd-american-pumpkin-as-heavy-as-two-cows-squashes-all-past-rivals-759626'],
    pizza: ['Guinness World Records, 2016 Naples pizza', 'https://www.guinnessworldrecords.com/news/2016/5/italian-chefs-create-mile-long-neapolitan-to-break-longest-pizza-record-429657'],
    nails: ['Guinness World Records, Superlative States', 'https://www.guinnessworldrecords.com/products/books/bonus-content/superlative-states'],
    diamond: ['Smithsonian, Hope Diamond', 'https://naturalhistory.si.edu/explore/collections/hope-diamond'],
    wimbledon: ['Wimbledon, Championships compendium', 'https://www.wimbledon.com/pdf/Wimbledon_Compendium_2021v3.pdf'],
    puzzle: ['Guinness World Records, largest jigsaw puzzle', 'https://www.guinnessworldrecords.com/world-records/largest-jigsaw-puzzle-'],
    wright: ['Smithsonian National Air and Space Museum, Wright Flyer', 'https://collections.si.edu/search/detail/edanmdm%3Anasm_A19610048000'],
    octopus: ['NOAA library, Giant Pacific Octopus', 'https://repository.library.noaa.gov/view/noaa/34671/noaa_34671_DS1.pdf'],
    titanic: ['NOAA, RMS Titanic', 'https://www.gc.noaa.gov/documents/05varmer2006an.pdf'],
    mint: ['The Royal Mint, 12-sided £1 coin', 'https://www.royalmint.com/new-pound-coin/']
  };

  const oddFacts = [
    ['thanksgiving', 'FOOD', 'About how many calories are in a traditional American Thanksgiving dinner, before drinks and appetizers, in a widely cited estimate?', 'calories', 3000, 'A standard nutrition-label reference is 2,000 calories for an entire day.'],
    ['fiona', 'ANIMALS', 'How much did Fiona the hippo weigh at birth when she arrived six weeks early at the Cincinnati Zoo?', 'pounds', 29, 'A typical newborn hippo weighs 55–120 pounds. Fiona weighed less than that range.'],
    ['liberty', 'LANDMARKS', 'How long is the Statue of Liberty’s nose, in centimetres?', 'cm', 137, 'The statue’s hand alone is about 5 metres long.'],
    ['pizza', 'ODD RECORDS', 'How long was the enormous pizza that 250 chefs made along the Naples waterfront in 2016?', 'metres', 1853.88, 'A lap of an athletics track is 400 metres. This pizza would stretch for several laps.'],
    ['eiffel', 'LANDMARKS', 'How many rivets were used to put together the Eiffel Tower?', 'rivets', 2500000, 'The tower’s frame was assembled from about 18,000 iron parts.'],
    ['panda', 'ANIMALS', 'At the Smithsonian’s National Zoo, what is the upper end of the typical birth weight range for a giant panda cub?', 'ounces', 5, 'The Smithsonian compares a newborn panda’s size to a stick of butter.'],
    ['oldFaithful', 'NATURE', 'Roughly how high does Old Faithful’s average eruption rise above the ground?', 'feet', 130, 'A basketball rim is 10 feet above the floor.'],
    ['wimbledon', 'SPORTS', 'In 2010, Isner and Mahut played Wimbledon’s longest match. How many games did they play across all five sets?', 'games', 183, 'Most men’s Wimbledon singles matches are best of five sets. This one used all five.'],
    ['pumpkin', 'ODD RECORDS', 'How heavy was the giant pumpkin named Michael Jordan at the 2023 Half Moon Bay weigh-off?', 'pounds', 2749, 'Guinness compared its weight to two cows.'],
    ['zeus', 'ANIMALS', 'How tall was Zeus the Great Dane at the shoulder, measured in centimetres?', 'cm', 111.8, 'Guinness compared Zeus’s size to that of an average donkey.'],
    ['diamond', 'MUSEUM PIECES', 'How much did the Hope Diamond weigh when the Smithsonian took it out of its setting to weigh it?', 'carats', 45.52, 'A carat is a unit of weight used for gemstones.'],
    ['wright', 'HISTORY', 'How far did Orville Wright travel on the first powered flight at Kitty Hawk in 1903?', 'feet', 120, 'A U.S. football field is 300 feet between the goal lines.'],
    ['nails', 'ODD RECORDS', 'What was the combined length of Diana Armstrong’s record-breaking fingernails in 2022?', 'cm', 1306.58, 'The record adds up the nails on both hands.'],
    ['libertySteps', 'LANDMARKS', 'How many steps does the National Park Service count from ground level to the Statue of Liberty’s crown?', 'steps', 377, 'From the ground to the tip of the torch, the monument is about 305 feet tall.'],
    ['giraffe', 'ANIMALS', 'At the upper end of San Diego Zoo’s stated birth-weight range, how much can a newborn giraffe weigh?', 'pounds', 220, 'Cincinnati Zoo puts typical newborn hippos at 55–120 pounds.'],
    ['oldFaithful', 'NATURE', 'At the high end of its normal range, how many U.S. gallons can Old Faithful throw into the air in one eruption?', 'gallons', 8400, 'A typical large backyard pool holds thousands of gallons.'],
    ['titanic', 'HISTORY', 'Roughly how deep in the ocean was the Titanic wreck found, according to NOAA’s 2006 account?', 'metres', 3800, 'Think of a deep-ocean basin, on the scale of kilometres.'],
    ['puzzle', 'ODD RECORDS', 'How many pieces were in the enormous outdoor jigsaw recorded by Guinness at 6,122 square metres?', 'pieces', 12320, 'A standard large tabletop puzzle often has 1,000 pieces.'],
    ['eiffelSteps', 'LANDMARKS', 'How many stairs get you from the ground to the second floor of the Eiffel Tower?', 'steps', 674, 'The second floor is 377 feet above the ground.'],
    ['octopus', 'ANIMALS', 'How many hearts supply blood to a giant Pacific octopus?', 'hearts', 3, 'Octopuses breathe through gills, and their blood carries oxygen around the body.'],
    ['liberty', 'LANDMARKS', 'How many windows are in the Statue of Liberty’s crown?', 'windows', 25, 'The crown has seven rays. The windows sit below them.'],
    ['pygmy', 'ANIMALS', 'What is the upper end of the usual birth-weight range for a pygmy hippo, according to the San Diego Zoo?', 'pounds', 14, 'Newborn common hippos typically weigh at least 55 pounds. Pygmy hippos are much smaller.'],
    ['wimbledon', 'SPORTS', 'How many minutes did the 2010 Isner–Mahut match at Wimbledon take, counting actual match time?', 'minutes', 665, 'A standard soccer match is 90 minutes of play.'],
    ['mint', 'POCKET CHANGE', 'How much does the modern twelve-sided British one-pound coin weigh?', 'g', 8.75, 'A U.S. nickel weighs 5 grams.'],
    ['eiffel', 'LANDMARKS', 'About how much does the Eiffel Tower’s iron frame weigh, without the rest of the structure?', 'tonnes', 7300, 'The entire tower weighs about 10,100 tonnes, including more than the iron frame.'],
    ['nails', 'ODD RECORDS', 'How many casino chips did Travis Stich stack in his 2021 Guinness record?', 'chips', 340, 'A standard stack of poker chips at a table is often counted in groups of 20.'],
    ['wright', 'HISTORY', 'How long did Orville Wright stay in the air on the first powered flight at Kitty Hawk?', 'seconds', 12, 'The first flight covered roughly the length of a short city block.'],
    ['liberty', 'LANDMARKS', 'How long is the Statue of Liberty’s right arm, from shoulder to torch hand, in the park’s official statistics?', 'feet', 42, 'The statue stands about 151 feet above its base.'],
    ['zeus', 'ANIMALS', 'How tall could Zeus the Great Dane reach when standing on his hind legs?', 'cm', 223, 'Guinness compared Zeus’s size to that of an average donkey.'],
    ['fiona', 'ANIMALS', 'What is the upper end of the normal newborn weight range Cincinnati Zoo reported for a common hippo?', 'pounds', 120, 'A newborn pygmy hippo usually weighs under 15 pounds. Common hippos are substantially heavier.'],
    ['eiffelSteps', 'LANDMARKS', 'Counting stairways that visitors cannot use, how many steps run from the ground to the top of the Eiffel Tower?', 'steps', 1665, 'The second floor is 377 feet above ground. The top is much higher.'],
    ['oldFaithful', 'NATURE', 'How many gallons can a short Old Faithful eruption release, at the low end of the park’s estimate?', 'gallons', 3700, 'A large backyard pool holds thousands of gallons.'],
    ['liberty', 'LANDMARKS', 'In strong winds, how far can the Statue of Liberty’s torch sway?', 'inches', 6, 'The torch moves independently of the statue below it, which can sway a few inches.'],
    ['giraffe', 'ANIMALS', 'How fast is the reported record running speed of a giraffe, in miles per hour?', 'mph', 34.7, 'A brisk human walk is around 3 miles per hour.'],
    ['mint', 'POCKET CHANGE', 'How many millimetres across is a modern British one-pound coin at its widest point?', 'mm', 23.43, 'A U.S. dime is about 18 millimetres across.'],
    ['nails', 'ODD RECORDS', 'How many consecutive donuts did Bari Musawwir perform in a monster truck for his Guinness record?', 'spins', 58, 'Only full circles count as donuts for the record.']
  ].map(([ref, category, prompt, unit, target, hint]) => ({
    category, prompt, unit, target, hint, numeric: true, difficulty: 'ESTIMATE',
    source: refs[ref][0], url: refs[ref][1]
  }));

  function shuffle(items, random) {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function mix(buckets, random) {
    const queues = buckets.map(bucket => shuffle(bucket, random));
    const result = [];
    while (queues.some(queue => queue.length)) {
      for (const queue of shuffle(queues, random)) {
        if (queue.length) result.push(queue.pop());
      }
    }
    return result;
  }

  const worldMetrics = [
    { id: 'population', code: 'SP.POP.TOTL', year: 2024, unit: 'million people', factor: 1,
      direct: name => `Roughly how many million people lived in ${name} in 2024?`,
      named: 'Name a country or territory whose 2024 population is closest without going over.' },
    { id: 'land', code: 'AG.LND.TOTL.K2', year: 2023, unit: 'thousand km²', factor: 1000,
      direct: name => `How much land area did ${name} have in 2023, in thousands of square kilometres?`,
      named: 'Name a country or territory whose land area is closest without going over, using 2023 figures.' },
    { id: 'forest', code: 'AG.LND.FRST.ZS', year: 2023, unit: '%', factor: 1,
      direct: name => `In 2023, what percentage of ${name}’s land area was forest?`,
      named: 'Name a country or territory whose 2023 forest cover is closest to the target percentage without going over.' },
    { id: 'life', code: 'SP.DYN.LE00.IN', year: 2023, unit: 'years', factor: 1,
      direct: name => `What was life expectancy at birth in ${name} in 2023?`,
      named: 'Name a country or territory whose 2023 life expectancy is closest without going over.' },
    { id: 'urban', code: 'SP.URB.TOTL.IN.ZS', year: 2023, unit: '%', factor: 1,
      direct: name => `What percentage of ${name}’s population lived in urban areas in 2023?`,
      named: 'Name a country or territory whose 2023 urban population share is closest without going over.' }
  ];
  const foodMetrics = [
    { label: 'weight', unit: 'g' },
    { label: 'calorie count', unit: 'calories' },
    { label: 'potassium', unit: 'mg' },
    { label: 'fibre', unit: 'g' },
    { label: 'sugar', unit: 'g' },
    { label: 'protein', unit: 'g' }
  ];

  function exactValues(answers) {
    const counts = new Map();
    for (const { value } of answers) counts.set(value, (counts.get(value) ?? 0) + 1);
    return [...counts.keys()].filter(value => value > 0 && counts.get(value) === 1);
  }

  const numberHint = (value, unit) => {
    const amount = value.toLocaleString('en', { maximumFractionDigits: 3 });
    return unit === '%' ? `${amount}%` : `${amount} ${unit}`;
  };

  function comparisonFor(items, target, excluded = []) {
    const candidates = items.filter(item => item.value > 0 && !excluded.includes(item.name)
      && Math.abs(item.value - target) >= target * 0.18);
    return candidates.find(item => item.value >= target * 0.35 && item.value <= target * 2.5)
      ?? candidates[0];
  }

  function namedHint(answers, target, unit) {
    const safe = answers.reduce((best, answer) => answer.value > (best?.value ?? 0) && answer.value <= target * 0.7
      ? answer : best, null);
    if (safe) return `${safe.name} is a safe example at ${numberHint(safe.value, unit)}. Try something a little higher.`;
    const over = answers.find(answer => answer.value >= target * 1.18);
    if (over) return `${over.name} would overshoot at ${numberHint(over.value, unit)}.`;
    return 'Think of a familiar answer from this category that would come in under the target.';
  }

  const featuredHints = {
    'POCKET CHANGE': 'Modern coins are usually only a few grams and about as wide as a fingertip.',
    'ODD RECORDS': 'Think well beyond the everyday size of the same object. These examples were built to set records.',
    'DEEP WATER': 'Think in kilometres for deep-ocean distances. A thousand metres is one kilometre.',
    'MOON LANDING': 'The astronauts spent only part of the Apollo 11 trip working on the Moon itself.',
    'SPACE SOUVENIRS': 'The Golden Record was designed to fit on a disc roughly the size of an LP.',
    'ODD LAKES': 'Crater Lake is famously deep because it fills the basin of a collapsed volcano.'
  };

  const topics = {
    'POCKET CHANGE': 'currency', 'COIN DIAMETERS': 'currency', 'EVERYDAY ODDITIES': 'currency',
    'FOOD': 'food', 'FOOD FACTS': 'food', 'FOOD FACE-OFF': 'food', 'FOOD RECORDS': 'food',
    'ANIMALS': 'animals', 'OCEAN LIFE': 'animals', 'DINOSAURS': 'animals',
    'NATURE': 'nature', 'NATURAL WONDERS': 'nature', 'ODD LAKES': 'nature', 'DEEP WATER': 'nature',
    'FORESTS': 'forests', 'POPULATION': 'population', 'CITY LIVING': 'population',
    'LAND & MAPS': 'geography', 'LIFE EXPECTANCY': 'health',
    'LANDMARKS': 'structures', 'ENGINEERING': 'structures',
    'TRANSPORT': 'transport', 'AIR TRAVEL': 'transport',
    'SPACEFLIGHT': 'space', 'MOON LANDING': 'space', 'SPACE SOUVENIRS': 'space',
    'ART': 'culture', 'MUSEUM PIECES': 'culture', 'BOOKS & CULTURE': 'culture',
    'ODD RECORDS': 'records', 'ODD COLLECTIONS': 'records'
  };
  const topicOf = question => {
    if (question.category === 'ODD RECORDS' && /pancake|pumpkin|pizza/i.test(question.prompt)) return 'food';
    return topics[question.category] ?? question.category.toLowerCase();
  };

  const identity = question => `${question.prompt}|${question.target}`;
  const isWorldFact = question => question.url?.includes('data.worldbank.org') ?? false;

  function contextualNumberHint(benchmark, value, unit, prefix, noun = 'answer') {
    const direction = value < benchmark.value ? 'lower' : 'higher';
    const rounded = Number(benchmark.value.toPrecision(3));
    return `${prefix} ${numberHint(rounded, unit)}. The ${noun} here is ${direction}.`;
  }

  function familiarComparisons(decks) {
    return decks.flatMap(deck => {
      const questions = [];
      const subjects = { MOVIES: 'original theatrical runtime', ANIMALS: 'typical lifespan', MOUNTAINS: 'summit elevation' };
      const subject = subjects[deck.category];
      if (!subject) return questions;
      for (const [index, [first, a]] of deck.items.entries()) {
        for (const [second, b] of deck.items.slice(index + 1)) {
          const target = Math.abs(a - b);
          if (target < Math.max(a, b) * 0.15) continue;
          const hint = deck.category === 'MOVIES' ? 'A two-hour movie runs 120 minutes. Think of which title takes up more of an evening.'
            : deck.category === 'ANIMALS' ? 'Think about whether each animal lives for just a few years or for several decades.'
            : 'Compare their summit heights above sea level, not the height of the slopes themselves.';
          questions.push({
            category: deck.category, unit: deck.unit, source: deck.source, url: deck.url,
            numeric: true, difficulty: 'ESTIMATE', target, hint,
            prompt: `What is the difference in ${subject} between ${first} and ${second}?`
          });
        }
      }
      return questions;
    });
  }

  function sportsFacts() {
    return Object.entries(window.nearMissSportsData).reverse().flatMap(([season, teams]) =>
      teams.filter(([, wins, games]) => wins * 2 !== games).map(([team, wins, games]) => ({
        category: 'SPORTS', numeric: true, difficulty: 'ESTIMATE', unit: 'wins', target: wins,
        prompt: `How many regular-season games did the ${team} win in ${season}?`,
        hint: `They played ${games} games. They won ${wins > games / 2 ? 'more' : 'fewer'} than half.`,
        source: 'Major League Baseball regular-season standings', url: `https://www.mlb.com/standings/${season}`
      }))
    );
  }

  function buildBank(random, decks, estimates) {
    const featured = [...oddFacts, ...estimates.filter(q =>
      q.difficulty === 'CHALLENGE' && ['POCKET CHANGE', 'ODD RECORDS', 'DEEP WATER', 'MOON LANDING', 'SPACE SOUVENIRS', 'ODD LAKES'].includes(q.category)
    )].map(question => ({ ...question, hint: question.hint ?? featuredHints[question.category] }));
    const familiar = decks.filter(deck => ['ANIMALS', 'MOVIES', 'MOUNTAINS', 'POCKET CHANGE', 'COIN DIAMETERS'].includes(deck.category));
    const named = new Map();
    const namedOptions = (id, details, answers) => {
      named.set(id, answers);
      return exactValues(answers).map(target => ({
        ...details, target, bank: id, hint: namedHint(answers, target, details.unit)
      }));
    };
    const familiarCards = familiar.map(deck => {
      const { items, ...details } = deck;
      const answers = items.map(([name, value, ...aliases]) => ({ name, value, aliases }));
      return namedOptions(deck.category, { ...details, difficulty: 'NAME ONE' }, answers);
    });
    const countryCards = [];
    const worldFacts = worldMetrics.map((metric, index) => {
      const answers = window.nearMissWorldData
        .filter(row => row[index + 1] != null)
        .map(([name, ...values]) => ({
          name, value: Number((values[index] / metric.factor).toFixed(3)), aliases: values[5]
        }));
      const category = ['POPULATION', 'LAND & MAPS', 'FORESTS', 'LIFE EXPECTANCY', 'CITY LIVING'][index];
      const details = {
        category, difficulty: 'ESTIMATE', unit: metric.unit,
        source: `World Bank Open Data, ${metric.year}`, url: `https://data.worldbank.org/indicator/${metric.code}`
      };
      countryCards.push(namedOptions(metric.id, { ...details, difficulty: 'NAME ONE', prompt: metric.named }, answers));
      const referenceCountries = ['Canada', 'Japan', 'Brazil', 'Australia', 'United Kingdom', 'Mexico'];
      const references = referenceCountries.flatMap(name => answers.filter(answer => answer.name === name));
      return answers.filter(answer => answer.value > 0).map(({ name, value }) => {
        const benchmark = comparisonFor(references, value, [name]);
        return {
          ...details, numeric: true, prompt: metric.direct(name), target: value,
          hint: benchmark ? contextualNumberHint(benchmark, value, metric.unit, `${benchmark.name} was about`)
            : 'Think of a nearby country with a similar size or standard of living.'
        };
      });
    });

    const foods = Object.entries(window.nearMissFoodData).flatMap(([kind, rows]) => rows.map(row => ({
      kind, name: row[0], serving: row[1], values: row.slice(2)
    })));
    const foodSource = {
      source: 'FDA nutrition posters',
      url: 'https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/nutrition-information-raw-fruits-vegetables-and-fish'
    };
    const foodDirect = [];
    const foodCompared = [];
    for (const [index, metric] of foodMetrics.entries()) {
      const details = { ...foodSource, category: 'FOOD FACTS', unit: metric.unit, difficulty: 'ESTIMATE', numeric: true };
      const references = ['Banana', 'Carrot', 'Orange', 'Potato', 'Apple'].flatMap(name =>
        foods.filter(food => food.name === name).map(food => ({ ...food, value: food.values[index] }))
      );
      const foodHint = (target, excluded) => {
        const benchmark = comparisonFor(references, target, excluded);
        return benchmark ? contextualNumberHint(benchmark, target, metric.unit,
          `${benchmark.name} (${benchmark.serving}) is listed at`)
          : 'Use the serving size as a guide. The chart is for the edible portion only.';
      };
      foodDirect.push(foods.filter(food => food.values[index] > 0).map(food => ({
        ...details, prompt: `What is the ${metric.label} for ${food.name.toLowerCase()} (${food.serving}) on the FDA chart?`,
        target: food.values[index], hint: foodHint(food.values[index], [food.name])
      })));
      if (index === 0) continue;
      const comparisons = [];
      for (const [i, food] of foods.entries()) {
        for (const other of foods.slice(i + 1)) {
          const a = food.values[index];
          const b = other.values[index];
          const target = Math.abs(a - b);
          if (!target || !a || !b || target < Math.max(a, b) * 0.2) continue;
          comparisons.push({
            ...details, category: 'FOOD FACE-OFF',
            prompt: `What’s the difference in ${metric.label} between ${food.name.toLowerCase()} (${food.serving}) and ${other.name.toLowerCase()} (${other.serving}) on the FDA chart?`,
            target, hint: foodHint(target, [food.name, other.name])
          });
        }
      }
      foodCompared.push(comparisons);
    }
    const familiarFacts = familiar.map(({ items, category, source, url, unit }) => items.map(([name, target]) => {
      const subject = category === 'MOVIES' ? 'original theatrical runtime'
        : category === 'ANIMALS' ? 'typical lifespan'
        : category === 'MOUNTAINS' ? 'summit elevation'
        : category === 'POCKET CHANGE' ? 'weight' : 'diameter';
      const references = items.map(([name, value]) => ({ name, value }));
      const benchmark = comparisonFor(references, target, [name]);
      return {
        category, unit, source, url, target, numeric: true, difficulty: 'ESTIMATE',
        prompt: `What is the ${subject} of ${name}?`,
        hint: benchmark ? contextualNumberHint(benchmark, target, unit, `${benchmark.name} is about`)
          : 'Start with a familiar example from this category and estimate from there.'
      };
    }));
    return {
      named,
      namePool: [...mix(familiarCards, random), ...mix(countryCards, random)],
      featured,
      world: mix(worldFacts, random),
      general: mix([...foodDirect, ...familiarFacts], random),
      comparison: mix(foodCompared, random),
      additional: [...familiarComparisons(familiar), ...sportsFacts()]
    };
  }

  const split = (list, mode) => list.filter((_, index) => index % 2 === mode);

  function scheduleFactPack(sets, mode) {
    const additions = split(window.nearMissFactPack, mode);
    const holesPerSet = 5;
    // Replace a single early numeric hole without shifting any existing question
    // to another date or practice slot. Old browser saves keep their own rounds.
    const earlyCount = 26;
    for (const [index, fact] of additions.slice(0, earlyCount).entries()) {
      sets[index * 2][2] = fact;
    }
    const extra = additions.slice(earlyCount);
    for (let i = 0; i + holesPerSet <= extra.length; i += holesPerSet) {
      sets.push(extra.slice(i, i + holesPerSet));
    }
  }

  function variedSchedule(original, additional, priority) {
    const groups = new Map();
    for (const question of [...original.flat(), ...additional]) {
      const topic = topicOf(question);
      if (!groups.has(topic)) groups.set(topic, []);
      groups.get(topic).push(question);
    }
    const buckets = [...groups.values()].map(questions => ({
      questions: questions.sort((a, b) => Number(priority.has(b)) - Number(priority.has(a))),
      world: isWorldFact(questions[0]),
      remaining: 0, index: 0
    }));
    const world = buckets.filter(bucket => bucket.world);
    const other = buckets.filter(bucket => !bucket.world);
    const capacity = (group, length) => group.reduce((sum, bucket) => sum + Math.min(length, bucket.questions.length), 0);
    let length = original.length;
    while (length && capacity(other, length) + Math.min(length * 2, capacity(world, length)) < length * 5) length--;
    const worldSlots = Math.max(0, length * 5 - capacity(other, length));
    for (const [group, limit] of [[world, worldSlots], [other, length * 5 - worldSlots]]) {
      for (const bucket of group) bucket.remaining = Math.min(length, bucket.questions.length);
      let excess = group.reduce((sum, bucket) => sum + bucket.remaining, 0) - limit;
      while (excess > 0) {
        const largest = group.reduce((a, b) => a.remaining >= b.remaining ? a : b);
        largest.remaining--;
        excess--;
      }
    }

    const sets = [];
    let previous = new Set();
    for (let left = length; left > 0; left--) {
      const available = buckets.filter(bucket => bucket.remaining > 0);
      const required = available.filter(bucket => bucket.remaining === left);
      const selected = [...required];
      const choices = available.filter(bucket => !required.includes(bucket));
      const head = bucket => bucket.questions[bucket.index];
      const worldRemaining = world.reduce((sum, bucket) => sum + bucket.remaining, 0);
      const minimumWorld = Math.max(0, worldRemaining - 2 * (left - 1), 5 - available.filter(q => !q.world).length);
      let worldCount = selected.filter(bucket => bucket.world).length;
      choices.sort((a, b) => Number(previous.has(a)) - Number(previous.has(b))
        || Number(priority.has(head(b))) - Number(priority.has(head(a))) || a.remaining - b.remaining);
      const remainingSlots = () => 5 - selected.length;
      for (const bucket of choices) {
        if (worldCount >= minimumWorld) break;
        if (bucket.world) {
          selected.push(bucket);
          worldCount++;
        }
      }
      const canSelect = bucket => !selected.includes(bucket) && (!bucket.world || worldCount < 2);
      if (remainingSlots() && !selected.some(bucket => !head(bucket).numeric)) {
        const named = choices.find(bucket => canSelect(bucket) && !head(bucket).numeric);
        if (named) {
          selected.push(named);
          if (named.world) worldCount++;
        }
      }
      for (const bucket of choices) {
        if (!remainingSlots()) break;
        if (!canSelect(bucket)) continue;
        selected.push(bucket);
        if (bucket.world) worldCount++;
      }
      const questions = selected.map(bucket => {
        bucket.remaining--;
        return bucket.questions[bucket.index++];
      });
      // Give the player a foothold before the biggest leaps of scale.
      const warmUp = questions.findIndex(q => !q.numeric && /safe example/.test(q.hint));
      const countRange = questions.findIndex(q => q.numeric && q.unit === 'wins');
      const opening = warmUp >= 0 ? warmUp : countRange >= 0 ? countRange
        : questions.findIndex(q => q.numeric && !priority.has(q));
      if (opening > 0) questions.unshift(...questions.splice(opening, 1));
      sets.push(questions);
      previous = new Set(selected);
    }
    return { sets, reserve: buckets.flatMap(bucket => bucket.questions.slice(bucket.index)) };
  }

  window.buildNearMissRotation = (random, decks, estimates) => {
    const bank = buildBank(random, decks, estimates);
    const legacy = [0, 1].map(mode => {
      const names = split(bank.namePool, mode);
      const odd = split(bank.featured, mode);
      const general = split(bank.general, mode);
      const world = split(bank.world, mode);
      const comparison = split(bank.comparison, mode);
      const sets = [];
      // All questions are drawn from separate mode queues without replacement.
      while (names.length && (odd.length + general.length + world.length + comparison.length) >= 4) {
        const name = names.shift();
        const first = odd.shift() ?? general.shift() ?? comparison.shift() ?? world.shift();
        const second = (sets.length < 5 ? odd.shift() : undefined)
          ?? world.shift() ?? general.shift() ?? comparison.shift() ?? odd.shift();
        const third = general.shift() ?? comparison.shift() ?? world.shift();
        const fourth = world.shift() ?? general.shift() ?? comparison.shift();
        if (![first, second, third, fourth].every(Boolean)) break;
        sets.push([first, name, third, second, fourth]);
      }
      scheduleFactPack(sets, mode);
      return sets;
    });
    const priority = new Set([...bank.featured, ...window.nearMissFactPack]);
    const plans = legacy.map((sets, mode) => variedSchedule(sets, split(bank.additional, mode), priority));
    const schedules = plans.map(plan => plan.sets);
    const hints = new Map([...legacy.flat(2), ...schedules.flat(2)].map(question => [identity(question), question.hint]));
    const hintFor = question => hints.get(identity(question)) ?? question.hint ?? (question.answers
      ? namedHint(question.answers, question.target, question.unit)
      : featuredHints[question.category] ?? `Think of a familiar amount in ${question.unit}, then scale it up or down.`);
    return { schedules, legacy, reserves: plans.map(plan => plan.reserve), answersFor: id => bank.named.get(id), hintFor, topicOf, identity, isWorldFact };
  };
})();
