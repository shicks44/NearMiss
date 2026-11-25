(() => {
  const mint = {
    source: 'U.S. Mint coin specifications',
    url: 'https://www.usmint.gov/learn/coins-and-medals/circulating-coins/coin-specifications'
  };
  const planets = {
    source: 'NASA planetary fact sheet',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/'
  };
  const apollo = {
    source: 'NASA, Apollo by the Numbers',
    url: 'https://www.nasa.gov/wp-content/uploads/static/history/SP-4029/Apollo_11a_Summary.htm'
  };
  const voyager = {
    source: 'NASA Voyager Golden Record',
    url: 'https://science.nasa.gov/mission/voyager/voyager-1/'
  };
  const canyon = {
    source: 'National Park Service, Grand Canyon FAQ',
    url: 'https://www.nps.gov/grca/faqs.htm'
  };
  const lake = {
    source: 'National Park Service, Crater Lake',
    url: 'https://www.nps.gov/places/crater-lake.htm'
  };
  const kitchen = {
    source: 'NIST Metric Kitchen',
    url: 'https://www.nist.gov/pml/owm/metric-si/metric-kitchen/metric-kitchen-cooking-measurement-equivalencies'
  };

  const ocean = { source: 'NOAA National Ocean Service', url: 'https://oceanservice.noaa.gov/facts/oceandepth.html' };
  const pancakes = { source: 'Guinness World Records, Sydney pancake stack', url: 'https://www.guinnessworldrecords.com/world-records/tallest-stack-of-pancakes' };
  const giantPancake = { source: 'Guinness World Records, Rochdale pancake', url: 'https://www.guinnessworldrecords.com/world-records/68403-largest-pancake' };
  const duck = { source: 'Guinness World Records, largest bath toy', url: 'https://www.guinnessworldrecords.com/world-records/776594-largest-bath-toy' };
  const liberty = { source: 'National Park Service, Statue of Liberty', url: 'https://www.nps.gov/places/000/statue-front.htm' };

  const lengths = {
    source: 'NIST customary and metric measurement tables',
    url: 'https://www.nist.gov/system/files/documents/2024/01/14/NIST%20HB%2044%202024%20Appendix%20C%20General%20Tables%20of%20Units%20of%20Measurement.pdf'
  };
  const tennis = {
    source: 'U.S. Tennis Association court measurements',
    url: 'https://www.usta.com/en/home/improve/gear-up/national/find-the-right-tennis-level-for-you.html'
  };
  const soccer = {
    source: 'IFAB Laws of the Game, Field of Play',
    url: 'https://www.theifab.com/laws/latest/the-field-of-play/'
  };
  const fruit = {
    source: 'FDA nutrition chart for raw fruit',
    url: 'https://www.fda.gov/files/food/published/Nutrition-Information-for-Raw-Fruits---Medium-PDF-Poster.pdf'
  };

  const everyday = [
    [kitchen, 'IN THE KITCHEN', 'About how many millilitres are in a quarter of a U.S. measuring cup?', 'mL', 60],
    [kitchen, 'IN THE KITCHEN', 'About how many millilitres does a standard measuring tablespoon hold?', 'mL', 15],
    [kitchen, 'IN THE KITCHEN', 'About how many millilitres are in a U.S. liquid pint?', 'mL', 480],
    [kitchen, 'IN THE KITCHEN', 'About how many millilitres are in a third of a U.S. measuring cup?', 'mL', 80],
    [kitchen, 'IN THE KITCHEN', 'About how many millilitres are in three quarters of a U.S. measuring cup?', 'mL', 180],
    [kitchen, 'IN THE KITCHEN', 'About how many millilitres does one fluid ounce fill in a U.S. measuring cup?', 'mL', 30],
    [kitchen, 'IN THE KITCHEN', 'About how many grams are in a quarter pound of butter?', 'g', 114],
    [kitchen, 'IN THE KITCHEN', 'About how many grams would you weigh out for an ounce of chocolate?', 'g', 28],
    [lengths, 'EVERYDAY MEASURES', 'How many centimetres long is a yardstick?', 'cm', 91.44],
    [lengths, 'EVERYDAY MEASURES', 'How many centimetres long is a one-foot ruler?', 'cm', 30.48],
    [lengths, 'EVERYDAY MEASURES', 'How many metres are in one mile?', 'metres', 1609.344],
    [lengths, 'EVERYDAY MEASURES', 'How many inches would a tape measure show for exactly one metre, rounded to one decimal place?', 'inches', 39.4],
    [lengths, 'EVERYDAY MEASURES', 'How many feet are in half a mile?', 'feet', 2640],
    [lengths, 'EVERYDAY MEASURES', 'How many millimetres is one inch?', 'mm', 25.4],
    [tennis, 'ON THE COURT', 'How many feet long is a standard tennis court from baseline to baseline?', 'feet', 78],
    [tennis, 'ON THE COURT', 'How many feet wide is the playable area of a singles tennis court?', 'feet', 27],
    [tennis, 'ON THE COURT', 'How many feet wide is the playable area of a doubles tennis court?', 'feet', 36],
    [tennis, 'ON THE COURT', 'How tall is the middle of a standard tennis net?', 'inches', 36],
    [soccer, 'ON THE PITCH', 'How wide is a full-size soccer goal between the posts?', 'metres', 7.32],
    [soccer, 'ON THE PITCH', 'How far above the ground is the underside of a full-size soccer goal’s crossbar?', 'metres', 2.44],
    [soccer, 'ON THE PITCH', 'How far is the penalty spot from the goal line, measured in yards?', 'yards', 12],
    [fruit, 'IN THE FRUIT BOWL', 'How much does the edible part of a medium banana weigh on the FDA chart?', 'g', 126],
    [fruit, 'IN THE FRUIT BOWL', 'How much does the edible part of a medium orange weigh on the FDA chart?', 'g', 154],
    [fruit, 'IN THE FRUIT BOWL', 'How much does the edible part of a large apple weigh on the FDA chart?', 'g', 242],
    [fruit, 'IN THE FRUIT BOWL', 'How much do two peeled medium kiwis weigh on the FDA chart?', 'g', 148],
    [mint, 'POCKET CHANGE', 'How many millimetres across is a modern U.S. quarter?', 'mm', 24.26],
    [mint, 'POCKET CHANGE', 'How heavy is a modern U.S. dime?', 'g', 2.268],
    [mint, 'POCKET CHANGE', 'How many millimetres across is a modern U.S. penny?', 'mm', 19.05]
  ];

  const bodies = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  const coins = ['Penny', 'Nickel', 'Dime', 'Quarter', 'Half dollar', 'Dollar coin'];
  const coinAliases = [['1 cent'], ['5 cents'], ['10 cents'], ['25 cents'], ['50 cents'], ['dollar', '1 dollar']];
  const items = (names, values, aliases = []) => names.map((name, index) => [
    name, values[index], ...(aliases[index] ?? [])
  ]);

  const toEstimate = difficulty => ([reference, category, prompt, unit, target]) => ({
    ...reference, category, prompt, unit, target, difficulty, numeric: true
  });

  window.nearMissQuestions = {
    decks: [
      {
        ...planets, category: 'A PLANETARY DAY', difficulty: 'HARD',
        prompt: 'Name a planet whose sunrise-to-sunrise day is closest to the target without going over.',
        unit: 'hours',
        items: items(bodies, [4222.6, 2802, 24, 24.7, 9.9, 10.7, 17.2, 16.1])
      },
      {
        ...planets, category: 'ESCAPE SPEED', difficulty: 'HARD',
        prompt: 'Name a planet whose escape speed is closest to the target without going over.',
        unit: 'km/s',
        items: items(bodies, [4.3, 10.4, 11.2, 5, 59.5, 35.5, 21.3, 23.5])
      },
      {
        ...planets, category: 'PLANETARY TILT', difficulty: 'HARD',
        prompt: 'Name a planet whose axial tilt is closest to the target without going over.',
        unit: 'degrees',
        items: items(bodies, [0.034, 177.4, 23.4, 25.2, 3.1, 26.7, 97.8, 28.3])
      },
      {
        ...mint, category: 'POCKET CHANGE', difficulty: 'HARD',
        prompt: 'Name a modern U.S. coin whose weight is closest to the target without going over.',
        unit: 'g',
        items: items(coins, [2.5, 5, 2.268, 5.67, 11.34, 8.1], coinAliases)
      },
      {
        ...mint, category: 'COIN DIAMETERS', difficulty: 'HARD',
        prompt: 'Name a modern U.S. coin whose diameter is closest to the target without going over.',
        unit: 'mm',
        items: items(coins, [19.05, 21.21, 17.91, 24.26, 30.61, 26.49], coinAliases)
      }
    ],
    estimates: [
      [mint, 'POCKET CHANGE', 'How many grooves ring the edge of a modern U.S. quarter?', 'grooves', 119],
      [mint, 'POCKET CHANGE', 'How many grooves ring the edge of a modern U.S. half dollar?', 'grooves', 150],
      [mint, 'POCKET CHANGE', 'How thick is a modern U.S. nickel?', 'mm', 1.95],
      [mint, 'POCKET CHANGE', 'What percentage of a modern U.S. penny is zinc by composition?', '%', 97.5],
      [mint, 'POCKET CHANGE', 'How much does a modern U.S. half dollar weigh?', 'g', 11.34],
      [planets, 'OUTER SPACE', 'How many Earth days make up one year on Mercury?', 'days', 88],
      [planets, 'OUTER SPACE', 'How many Earth hours pass between sunrises on Venus?', 'hours', 2802],
      [planets, 'OUTER SPACE', 'What is the length of a Jupiter day in NASA’s planetary fact sheet?', 'hours', 9.9],
      [planets, 'OUTER SPACE', 'How far is Uranus tilted on its axis relative to its orbit?', 'degrees', 97.8],
      [planets, 'OUTER SPACE', 'What is the escape speed from Saturn?', 'km/s', 35.5],
      [planets, 'OUTER SPACE', 'What is the escape speed from the Moon?', 'km/s', 2.4],
      [apollo, 'MOON LANDING', 'How many kilograms of lunar samples did Apollo 11 bring back?', 'kg', 21.55],
      [apollo, 'MOON LANDING', 'How many whole hours elapsed from Apollo 11 launch to splashdown?', 'hours', 195],
      [apollo, 'MOON LANDING', 'How many whole minutes did the Apollo 11 crew spend outside the lunar module?', 'minutes', 151],
      [apollo, 'MOON LANDING', 'Roughly how far did Armstrong walk from the lunar module at his farthest point?', 'metres', 60],
      [apollo, 'MOON LANDING', 'How old was Neil Armstrong on the Apollo 11 mission?', 'years', 38],
      [voyager, 'SPACE SOUVENIRS', 'How many languages are represented in the greetings on Voyager’s Golden Record?', 'languages', 55],
      [voyager, 'SPACE SOUVENIRS', 'How many minutes of music are on Voyager’s Golden Record?', 'minutes', 90],
      [voyager, 'SPACE SOUVENIRS', 'How many pictures of Earth life were included on Voyager’s Golden Record?', 'pictures', 115],
      [voyager, 'SPACE SOUVENIRS', 'What is the diameter of Voyager’s Golden Record?', 'cm', 30],
      [voyager, 'SPACE SOUVENIRS', 'How many sounds from Earth were selected for Voyager’s Golden Record?', 'sounds', 35],
      [canyon, 'BIG LANDMARKS', 'How long is the Grand Canyon when measured along the Colorado River?', 'miles', 277],
      [canyon, 'BIG LANDMARKS', 'How many miles across is the Grand Canyon near Grand Canyon Village?', 'miles', 10],
      [canyon, 'BIG LANDMARKS', 'What is the approximate vertical drop from Grand Canyon Village to the river?', 'feet', 5000],
      [lake, 'ODD LAKES', 'About how many years ago did Mount Mazama collapse and form the basin of Crater Lake?', 'years', 7700],
      [lake, 'ODD LAKES', 'How deep is Crater Lake in the National Park Service visitor overview?', 'feet', 1943],
      [kitchen, 'IN THE KITCHEN', 'About how many millilitres are in half a U.S. measuring cup?', 'mL', 120],
      [pancakes, 'ODD RECORDS', 'How many pancakes were stacked for the 2025 Sydney attempt recorded by Guinness?', 'pancakes', 230],
      [pancakes, 'ODD RECORDS', 'How tall was the pancake tower built in Sydney in August 2025?', 'cm', 108.3],
      [giantPancake, 'ODD RECORDS', 'How wide was the giant pancake cooked in Rochdale in 1994?', 'metres', 15.01],
      [giantPancake, 'ODD RECORDS', 'How much did the giant 1994 Rochdale pancake weigh?', 'tonnes', 3],
      [duck, 'ODD RECORDS', 'How long was the inflatable duck floated in Saint-Nazaire in 2007?', 'metres', 32],
      [duck, 'ODD RECORDS', 'How tall was the inflatable duck floated in Saint-Nazaire in 2007?', 'metres', 26],
      [ocean, 'DEEP WATER', 'What depth does NOAA give for the deepest point of the Mariana Trench?', 'metres', 10935],
      [ocean, 'DEEP WATER', 'What is the approximate average depth of Earth’s ocean according to NOAA?', 'metres', 3682],
      [ocean, 'DEEP WATER', 'In what year did HMS Challenger first sound the depths of the Mariana Trench?', 'year', 1875],
      [liberty, 'BIG LANDMARKS', 'How many whole feet tall is the Statue of Liberty including its pedestal?', 'feet', 305]
    ].map(toEstimate('CHALLENGE')).concat(everyday.map(toEstimate('MEDIUM')))
  };
})();

