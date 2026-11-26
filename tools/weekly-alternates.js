(() => {
  const guinness = (title, page) => ['Guinness World Records, ' + title, 'https://www.guinnessworldrecords.com/' + page];
  const liberty = ['National Park Service, Statue of Liberty statistics', 'https://www.nps.gov/stli/learn/historyculture/statue-statistics.htm'];
  const bell = ['National Park Service, bells of Independence Hall', 'https://home.nps.gov/articles/000/bell-and-clock-facts.htm'];
  const moon = ['NASA, Apollo 14 at Fra Mauro', 'https://www.nasa.gov/history/50-years-ago-apollo-14-lands-at-fra-mauro/'];
  const monopoly = ['Hasbro, Monopoly rulebook', 'https://www.hasbro.com/common/instruct/0009.pdf'];

  const numbers = [
    ['LANDMARKS', 'How wide is one of the Statue of Liberty’s eyes?', 'inches', 30,
      'Picture the width of a narrow doorway.', liberty],
    ['ODD RECORDS', 'How wide was the giant whoopee cushion made in Georgia in 2017?', 'feet', 25,
      'It took a crowd of students to squash the air out of this one. Think wider than a car is long.',
      guinness('giant whoopee cushion', 'world-records/largest-whoopee-cushion')],
    ['TOYS & GAMES', 'How heavy was the giant working yo-yo demonstrated in Ohio in 2012?', 'pounds', 4620,
      'It was roughly the weight of a car and had to be dropped from a crane.',
      guinness('giant yo-yo', 'world-records/largest-yo-yo')],
    ['SPACEFLIGHT', 'How far did Alan Shepard’s second golf ball go on the Moon, according to NASA’s later estimate?', 'yards', 40,
      'He swung one-handed in a stiff spacesuit. Think shorter than a typical golf drive.', moon],
    ['ANIMALS', 'About how long is a giraffe’s tongue?', 'inches', 18,
      'It can curl around twigs to grab leaves. Think longer than a school ruler.',
      ['San Diego Zoo, giraffes', 'https://animals.sandiegozoo.org/animals/giraffe']],
    ['FOOD RECORDS', 'How heavy was the giant scoop of strawberry ice cream made in Wisconsin in 2014?', 'pounds', 3010,
      'The scoop was taller than many adults and weighed about as much as a small car.',
      guinness('giant ice-cream scoop', 'world-records/largest-scoop-of-ice-cream')],
    ['HISTORY', 'How heavy is the original Liberty Bell?', 'pounds', 2080,
      'It’s about as wide as a small dining table and made mostly of copper and tin.', bell],
    ['ODD RECORDS', 'How tall was the giant sandcastle built at Blokhus in 2021?', 'feet', 69,
      'It stood about as tall as a low-rise apartment building. Use the height in whole feet.',
      guinness('2021 sandcastle', 'world-records/tallest-sandcastle')],
    ['LANDMARKS', 'How wide is the Statue of Liberty at the waist?', 'feet', 35,
      'The statue’s head is 10 feet wide. Picture how much wider the body looks.', liberty],
    ['HISTORY', 'How wide is the Liberty Bell across its opening?', 'inches', 46.5,
      'Its opening is wider than a typical interior doorway.', bell],
    ['FOOD RECORDS', 'How many scoops went into the giant ice cream pyramid built in Hawaii in 2000?', 'scoops', 3100,
      'It had 21 layers and weighed about 800 pounds.',
      guinness('ice cream pyramid', 'news/2015/7/national-ice-cream-day-ten-super-cool-records-that-have-yet-to-be-licked')],
    ['SPACEFLIGHT', 'How many golf balls did Alan Shepard hit on the Moon?', 'balls', 2,
      'He had to smuggle his equipment aboard. The entire golf outing happened near the end of one moonwalk.', moon],
    ['OCEAN LIFE', 'About how many tentacles does a chambered nautilus have?', 'tentacles', 90,
      'It looks like an octopus peeking out of a shell, but it has dozens more appendages.',
      ['Association of Zoos and Aquariums, chambered nautilus care manual', 'https://assets.speakcdn.com/assets/2332/aza_chambered_nautilus_care_manual.pdf']],
    ['TOYS & GAMES', 'How many little green houses are in the standard Monopoly box described in Hasbro’s rules?', 'houses', 32,
      'Players need four houses on a property before they can upgrade it to a hotel.', monopoly]
  ].map(([category, prompt, unit, target, hint, [source, url]]) => ({
    category, prompt, unit, target, hint, source, url, numeric: true
  }));

  window.nearMissEditorialAlternates = [...numbers, {
    category: 'TOYS & GAMES',
    prompt: 'Name a Monopoly box component with a count closest to the target without going over.',
    unit: 'pieces',
    target: 28,
    hint: 'Red hotels are a safe pick at 12. Think of another component in the box that comes closer.',
    source: monopoly[0],
    url: monopoly[1],
    numeric: false,
    answers: [
      { name: 'Green houses', value: 32, aliases: ['houses'] },
      { name: 'Red hotels', value: 12, aliases: ['hotels'] },
      { name: 'Title Deed cards', value: 28, aliases: ['title deeds', 'property cards', 'deeds'] },
      { name: 'Chance cards', value: 16, aliases: ['chance'] },
      { name: 'Community Chest cards', value: 16, aliases: ['community chest'] },
      { name: 'Player tokens', value: 8, aliases: ['tokens', 'playing pieces'] }
    ]
  }];
})();
