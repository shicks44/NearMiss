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
    ['thanksgiving', 'FOOD', 'About how many calories are in a traditional American Thanksgiving dinner, before drinks and appetizers, in a widely cited estimate?', 'calories', 3000],
    ['fiona', 'ANIMALS', 'How much did Fiona the hippo weigh at birth when she arrived six weeks early at the Cincinnati Zoo?', 'pounds', 29],
    ['liberty', 'LANDMARKS', 'How long is the Statue of Liberty’s nose, in centimetres?', 'cm', 137],
    ['pizza', 'ODD RECORDS', 'How long was the enormous pizza that 250 chefs made along the Naples waterfront in 2016?', 'metres', 1853.88],
    ['eiffel', 'LANDMARKS', 'How many rivets were used to put together the Eiffel Tower?', 'rivets', 2500000],
    ['panda', 'ANIMALS', 'At the Smithsonian’s National Zoo, what is the upper end of the typical birth weight range for a giant panda cub?', 'ounces', 5],
    ['oldFaithful', 'NATURE', 'Roughly how high does Old Faithful’s average eruption rise above the ground?', 'feet', 130],
    ['wimbledon', 'SPORTS', 'In 2010, Isner and Mahut played Wimbledon’s longest match. How many games did they play across all five sets?', 'games', 183],
    ['pumpkin', 'ODD RECORDS', 'How heavy was the giant pumpkin named Michael Jordan at the 2023 Half Moon Bay weigh-off?', 'pounds', 2749],
    ['zeus', 'ANIMALS', 'How tall was Zeus the Great Dane at the shoulder, measured in centimetres?', 'cm', 111.8],
    ['diamond', 'MUSEUM PIECES', 'How much did the Hope Diamond weigh when the Smithsonian took it out of its setting to weigh it?', 'carats', 45.52],
    ['wright', 'HISTORY', 'How far did Orville Wright travel on the first powered flight at Kitty Hawk in 1903?', 'feet', 120],
    ['nails', 'ODD RECORDS', 'What was the combined length of Diana Armstrong’s record-breaking fingernails in 2022?', 'cm', 1306.58],
    ['libertySteps', 'LANDMARKS', 'How many steps does the National Park Service count from ground level to the Statue of Liberty’s crown?', 'steps', 377],
    ['giraffe', 'ANIMALS', 'At the upper end of San Diego Zoo’s stated birth-weight range, how much can a newborn giraffe weigh?', 'pounds', 220],
    ['oldFaithful', 'NATURE', 'At the high end of its normal range, how many U.S. gallons can Old Faithful throw into the air in one eruption?', 'gallons', 8400],
    ['titanic', 'HISTORY', 'Roughly how deep in the ocean was the Titanic wreck found, according to NOAA’s 2006 account?', 'metres', 3800],
    ['puzzle', 'ODD RECORDS', 'How many pieces were in the enormous outdoor jigsaw recorded by Guinness at 6,122 square metres?', 'pieces', 12320],
    ['eiffelSteps', 'LANDMARKS', 'How many stairs get you from the ground to the second floor of the Eiffel Tower?', 'steps', 674],
    ['octopus', 'ANIMALS', 'How many hearts supply blood to a giant Pacific octopus?', 'hearts', 3],
    ['liberty', 'LANDMARKS', 'How many windows are in the Statue of Liberty’s crown?', 'windows', 25],
    ['pygmy', 'ANIMALS', 'What is the upper end of the usual birth-weight range for a pygmy hippo, according to the San Diego Zoo?', 'pounds', 14],
    ['wimbledon', 'SPORTS', 'How many minutes did the 2010 Isner–Mahut match at Wimbledon take, counting actual match time?', 'minutes', 665],
    ['mint', 'POCKET CHANGE', 'How much does the modern twelve-sided British one-pound coin weigh?', 'g', 8.75],
    ['eiffel', 'LANDMARKS', 'About how much does the Eiffel Tower’s iron frame weigh, without the rest of the structure?', 'tonnes', 7300],
    ['nails', 'ODD RECORDS', 'How many casino chips did Travis Stich stack in his 2021 Guinness record?', 'chips', 340],
    ['wright', 'HISTORY', 'How long did Orville Wright stay in the air on the first powered flight at Kitty Hawk?', 'seconds', 12],
    ['liberty', 'LANDMARKS', 'How long is the Statue of Liberty’s right arm, from shoulder to torch hand, in the park’s official statistics?', 'feet', 42],
    ['zeus', 'ANIMALS', 'How tall could Zeus the Great Dane reach when standing on his hind legs?', 'cm', 223],
    ['fiona', 'ANIMALS', 'What is the upper end of the normal newborn weight range Cincinnati Zoo reported for a common hippo?', 'pounds', 120],
    ['eiffelSteps', 'LANDMARKS', 'Counting stairways that visitors cannot use, how many steps run from the ground to the top of the Eiffel Tower?', 'steps', 1665],
    ['oldFaithful', 'NATURE', 'How many gallons can a short Old Faithful eruption release, at the low end of the park’s estimate?', 'gallons', 3700],
    ['liberty', 'LANDMARKS', 'In strong winds, how far can the Statue of Liberty’s torch sway?', 'inches', 6],
    ['giraffe', 'ANIMALS', 'How fast is the reported record running speed of a giraffe, in miles per hour?', 'mph', 34.7],
    ['mint', 'POCKET CHANGE', 'How many millimetres across is a modern British one-pound coin at its widest point?', 'mm', 23.43],
    ['nails', 'ODD RECORDS', 'How many consecutive donuts did Bari Musawwir perform in a monster truck for his Guinness record?', 'spins', 58]
  ].map(([ref, category, prompt, unit, target]) => ({
    category, prompt, unit, target, numeric: true, difficulty: 'ESTIMATE',
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

  function buildBank(random, decks, estimates) {
    const featured = [...oddFacts, ...estimates.filter(q =>
      q.difficulty === 'CHALLENGE' && ['POCKET CHANGE', 'ODD RECORDS', 'DEEP WATER', 'MOON LANDING', 'SPACE SOUVENIRS', 'ODD LAKES'].includes(q.category)
    )];
    const familiar = decks.filter(deck => ['ANIMALS', 'MOVIES', 'MOUNTAINS', 'POCKET CHANGE', 'COIN DIAMETERS'].includes(deck.category));
    const named = new Map();
    const namedOptions = (id, details, answers) => {
      named.set(id, answers);
      return exactValues(answers).map(target => ({ ...details, target, bank: id }));
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
      const details = {
        category: 'AROUND THE WORLD', difficulty: 'ESTIMATE', unit: metric.unit,
        source: `World Bank Open Data, ${metric.year}`, url: `https://data.worldbank.org/indicator/${metric.code}`
      };
      countryCards.push(namedOptions(metric.id, { ...details, difficulty: 'NAME ONE', prompt: metric.named }, answers));
      return answers.filter(answer => answer.value > 0).map(({ name, value }) => ({
        ...details, numeric: true, prompt: metric.direct(name), target: value
      }));
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
      foodDirect.push(foods.filter(food => food.values[index] > 0).map(food => ({
        ...details, prompt: `What is the ${metric.label} for ${food.name.toLowerCase()} (${food.serving}) on the FDA chart?`,
        target: food.values[index]
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
            target
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
      return {
        category, unit, source, url, target, numeric: true, difficulty: 'ESTIMATE',
        prompt: `What is the ${subject} of ${name}?`
      };
    }));
    return {
      named,
      namePool: [...mix(familiarCards, random), ...mix(countryCards, random)],
      featured,
      world: mix(worldFacts, random),
      general: mix([...foodDirect, ...familiarFacts], random),
      comparison: mix(foodCompared, random)
    };
  }

  const split = (list, mode) => list.filter((_, index) => index % 2 === mode);

  window.buildNearMissRotation = (random, decks, estimates) => {
    const bank = buildBank(random, decks, estimates);
    const schedules = [0, 1].map(mode => {
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
      return sets;
    });
    return { schedules, answersFor: id => bank.named.get(id) };
  };
})();
