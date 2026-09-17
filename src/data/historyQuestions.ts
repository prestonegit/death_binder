import type { HistoryCategory } from '../types';

export interface HistoryQuestionDefinition {
  id: string;
  category: HistoryCategory;
  chapterTitle: string;
  question: string;
  subtitle?: string;
  hints: string[];
  placeholder: string;
}

export interface HistoryChapter {
  category: HistoryCategory;
  title: string;
  subtitle: string;
  iconName: string;
}

export const HISTORY_CHAPTERS: HistoryChapter[] = [
  {
    category: 'homes',
    title: 'Places Lived & Homes Built',
    subtitle: 'Childhood roots, neighborhoods, first apartments, and homes owned.',
    iconName: 'Home'
  },
  {
    category: 'travel',
    title: 'Travels & Great Adventures',
    subtitle: 'Bucket-list journeys, road trips, foreign cities, and funny mishaps.',
    iconName: 'Compass'
  },
  {
    category: 'food',
    title: 'Feasts, Meals & Recipes',
    subtitle: 'Legendary restaurants, Sunday dinners, and heirloom family recipes.',
    iconName: 'Utensils'
  },
  {
    category: 'events',
    title: 'Concerts, Events & History',
    subtitle: 'Electrifying concerts, stadium moments, and history witnessed in person.',
    iconName: 'Ticket'
  },
  {
    category: 'traditions',
    title: 'Family Traditions & Rituals',
    subtitle: 'Holiday customs, inside jokes, family sayings, and annual reunions.',
    iconName: 'Sparkles'
  },
  {
    category: 'roots',
    title: 'Early Life & Youth',
    subtitle: 'First memories, childhood mischief, school days, and the soundtrack of your youth.',
    iconName: 'BookOpen'
  },
  {
    category: 'love',
    title: 'Love, Courtship & Milestones',
    subtitle: 'How you met, partnerships, courage through storms, and turning points.',
    iconName: 'Heart'
  },
  {
    category: 'wisdom',
    title: 'Guiding Wisdom & Future Blessings',
    subtitle: 'Hard-won lessons, enduring values, and blessings for future generations.',
    iconName: 'Scroll'
  },
  {
    category: 'custom',
    title: 'Personal Memories & Stories',
    subtitle: 'Custom questions and unique family lore added by you.',
    iconName: 'PenTool'
  }
];

export const CURATED_HISTORY_QUESTIONS: HistoryQuestionDefinition[] = [
  // 1. HOMES & PLACES
  {
    id: 'q_places_lived',
    category: 'homes',
    chapterTitle: 'Places Lived & Homes Built',
    question: 'Where have you lived throughout your life, and what do you remember most about each place?',
    subtitle: 'Childhood towns, college apartments, new cities, and familiar streets.',
    hints: [
      'The sights, smells, and street sounds of your favorite neighborhoods',
      'The view out of your bedroom or kitchen window',
      'Quirky neighbors, corner bodegas, or local parks you walked through',
      'What it felt like arriving in a brand new city for the first time'
    ],
    placeholder: 'e.g. Grew up in a brick bungalow on Elm Street in Dayton, Ohio. We had an enormous weeping willow in the yard. Later moved to a 3rd-floor walkup on 9th Ave in New York City with radiator pipes that clanked in the winter...'
  },
  {
    id: 'q_homes_owned',
    category: 'homes',
    chapterTitle: 'Places Lived & Homes Built',
    question: 'Which homes did you own or rent that meant the most to you? What projects, renovations, or personal touches did you put into them?',
    subtitle: 'The feeling of holding the keys, DIY repairs, gardens planted, and rooms filled with memories.',
    hints: [
      'The day you bought your first house and moved the first box inside',
      'DIY triumphs (and comical disaster projects) you tackled with your own hands',
      'The front porch, kitchen counter, or garden where everyone congregated',
      'What made leaving that home so bittersweet when it was time to move'
    ],
    placeholder: 'e.g. Bought our first house in 1994 on Maple Ave. We spent two months scraping wallpaper and sanding the oak floors until 1 AM. That screened-in back porch is where we drank morning coffee for 15 years...'
  },
  {
    id: 'q_childhood_roots',
    category: 'homes',
    chapterTitle: 'Places Lived & Homes Built',
    question: 'What was your childhood house or neighborhood like? Where did you play, and who were the kids on the block?',
    subtitle: 'The backyard trees, street games, screen doors slamming, and neighborhood lore.',
    hints: [
      'Street games (kick the can, bicycle parades, tag until the streetlights came on)',
      'Secret hiding spots, neighborhood treehouses, creeks, or alleyways',
      'The sound of mom calling down the street that dinner was ready',
      'The quirks of the house (creaky floorboards, secret crawlspaces, drafty windows)'
    ],
    placeholder: 'e.g. On summer evenings every kid on the cul-de-sac came out on their bikes. We played kickball until dark, and you could hear moms shouting names from porches down the block...'
  },

  // 2. TRAVELS & ADVENTURES
  {
    id: 'q_travels_adventures',
    category: 'travel',
    chapterTitle: 'Travels & Great Adventures',
    question: 'What are the most memorable trips or journeys you have ever taken? What places took your breath away?',
    subtitle: 'Bucket-list vacations, overseas journeys, awe-inspiring nature, and foreign cultures.',
    hints: [
      'The first time you saw the vast ocean, snow-capped mountains, or foreign skyline',
      'A town, museum, or landscape that permanently shifted your perspective',
      'Who you shared the journey with and the feelings of freedom and wonder',
      'The tastes, scents, and songs of the local streets'
    ],
    placeholder: 'e.g. In 2005 we spent three weeks driving across the South Island of New Zealand in an old campervan. Waking up to the mist lifting over Lake Wakatipu with a hot cup of black tea was pure magic...'
  },
  {
    id: 'q_travel_mishaps',
    category: 'travel',
    chapterTitle: 'Travels & Great Adventures',
    question: 'What road trips, detours, or chaotic travel mishaps turned into your family’s best stories?',
    subtitle: 'Flat tires, missed trains, strange roadside motels, and getting completely lost.',
    hints: [
      'The car breakdown in the middle of nowhere that led to an unexpected adventure',
      'Getting hopelessly lost in a foreign country without speaking the language',
      'Terrible weather, washed-out campsites, or hilarious hotel mixups',
      'How laughter got you through the stress and turned disaster into a cherished tale'
    ],
    placeholder: 'e.g. The 1987 station wagon road trip when the alternator gave out outside Cheyenne, Wyoming. We spent 36 hours stranded playing cards at a neon-lit 24-hour diner while waiting for parts from Denver...'
  },
  {
    id: 'q_places_dream',
    category: 'travel',
    chapterTitle: 'Travels & Great Adventures',
    question: 'Is there a specific corner of the world you find your mind constantly wandering back to?',
    subtitle: 'A quiet coastal bench, a secluded mountain cabin, or a bustling café you will never forget.',
    hints: [
      'The place where you felt the deepest stillness or contentment',
      'The weather, the light, the smell of salt air, pine needles, or roasting espresso',
      'Why that exact spot holds a piece of your soul'
    ],
    placeholder: 'e.g. A small wooden bench on the rocky overlook in Camden, Maine, on a crisp Tuesday morning in October, watching the wooden lobster boats bob in the harbor...'
  },

  // 3. FEASTS, MEALS & RECIPES
  {
    id: 'q_favorite_meals',
    category: 'food',
    chapterTitle: 'Feasts, Meals & Recipes',
    question: 'What are the most unforgettable meals, restaurants, or culinary experiences of your life?',
    subtitle: 'Roadside diner gems, candlelight anniversary feasts, and dishes you still crave.',
    hints: [
      'A restaurant you loved visiting for anniversaries, birthdays, or promotions',
      'A hole-in-the-wall spot with an incredible dish you could never replicate',
      'The atmosphere, background music, wine, and table conversation',
      'Who was sitting across from you and what made the occasion special'
    ],
    placeholder: 'e.g. Captain Joe\'s Seafood Shack in Bar Harbor—steamed lobster and buttery corn eaten with our fingers at a sun-bleached picnic table. Also our 10th anniversary at Le Bouchon...'
  },
  {
    id: 'q_family_recipes',
    category: 'food',
    chapterTitle: 'Feasts, Meals & Recipes',
    question: 'What family comfort foods, signature dishes, or secret recipes taste like "home" to you?',
    subtitle: 'The food that smelled like love, holiday ovens, and handwritten grease-stained recipe cards.',
    hints: [
      'The dish everyone begged for at birthdays and Sunday dinners',
      'Secret family recipes passed down with handwritten notes in the margins',
      'Special ingredients, quirky techniques, or rituals in the preparation',
      'Who originally created the dish and what stories accompanied it'
    ],
    placeholder: 'e.g. Grandma Rose’s slow-simmered Sunday meat sauce with pork ribs and whole garlic cloves. She insisted the pot had to simmer untouched on low flame for five hours while the radio played Italian opera...'
  },
  {
    id: 'q_dinner_gatherings',
    category: 'food',
    chapterTitle: 'Feasts, Meals & Recipes',
    question: 'What was dinnertime like in your home, and what gatherings brought the loudest laughter?',
    subtitle: 'Passing the platters, spilled drinks, hilarious toasts, and lingering at the table.',
    hints: [
      'Nightly dinner table rules, conversations, and storytelling rituals',
      'Holidays with folding chairs squeezed in to make room for cousins and grandparents',
      'The spills, botched dishes, or jokes that entered family folklore'
    ],
    placeholder: 'e.g. Sunday evening dinners where all six of us talked over each other. Dad loved making terrible puns while carving the roast, and dessert always ended with coffee and loud laughter that lasted hours...'
  },

  // 4. CONCERTS, EVENTS & HISTORY
  {
    id: 'q_favorite_concerts',
    category: 'events',
    chapterTitle: 'Concerts, Events & History',
    question: 'What are the best concerts, live music performances, or shows you have ever attended?',
    subtitle: 'Stadium anthems, smoky jazz clubs, festival grounds, and unforgettable encores.',
    hints: [
      'Your very first concert as a teenager and who bought the ticket',
      'The show where the crowd’s energy gave you goosebumps',
      'Small, intimate venues where you stood just feet from legendary musicians',
      'Ticket stubs, backstage stories, and singing every lyric at the top of your lungs'
    ],
    placeholder: 'e.g. Saw Bruce Springsteen at Giants Stadium on the Born in the USA tour in 1985. Four hours in the pouring rain, nobody left their seats, and 70,000 people were screaming every word to Thunder Road...'
  },
  {
    id: 'q_sporting_events',
    category: 'events',
    chapterTitle: 'Concerts, Events & History',
    question: 'What sporting events, stadium games, or championship moments did you experience in person?',
    subtitle: 'Tailgates, deafening roars, walk-off hits, buzzer-beaters, and tears in the stands.',
    hints: [
      'Going to games with your parent, child, spouse, or best friends',
      'The smell of roasted peanuts, stadium hot dogs, and crisp autumn turf',
      'A legendary comeback or final-second play you watched with your own eyes'
    ],
    placeholder: 'e.g. Game 4 of the 2004 ALCS at Fenway Park with my brother. We were down to our last outs in the 9th inning. When Dave Roberts stole second, the ground beneath our feet literally shook...'
  },
  {
    id: 'q_cultural_moments',
    category: 'events',
    chapterTitle: 'Concerts, Events & History',
    question: 'What major historical moments, world events, or celebrations did you witness in person or live through?',
    subtitle: 'Eclipses, space launches, bicentennials, historic rallies, or town celebrations.',
    hints: [
      'Where you were standing when a major world chapter unfolded',
      'The collective silence, relief, or celebration shared with strangers',
      'Town parades, fireworks, or community gatherings you will never forget'
    ],
    placeholder: 'e.g. Standing on the hill behind the high school with our solar glasses during the 2017 total solar eclipse. The sudden chill in the air, the cicadas starting up in mid-day, and the corona in the black sky...'
  },

  // 5. FAMILY TRADITIONS & RITUALS
  {
    id: 'q_holiday_traditions',
    category: 'traditions',
    chapterTitle: 'Family Traditions & Rituals',
    question: 'How did your family celebrate holidays? What rituals were sacred and non-negotiable year after year?',
    subtitle: 'Christmas morning, Thanksgiving parades, Hanukkah candles, New Year’s toasts, and birthday rituals.',
    hints: [
      'Special decorations unpacked every year with their own backstory',
      'Morning routines (opening pajamas on Christmas Eve, pumpkin pie breakfast, reading aloud)',
      'Funny annual debates or games played after holiday dinners',
      'Traditions you created together that became family signatures'
    ],
    placeholder: 'e.g. Every Christmas Eve we opened exactly one present, which was always flannel pajamas, and then drank spiced cider while Dad read \'The Polar Express\' in his best conductor voice...'
  },
  {
    id: 'q_family_sayings',
    category: 'traditions',
    chapterTitle: 'Family Traditions & Rituals',
    question: 'What quirky sayings, inside jokes, nicknames, or phrases are unique to your clan?',
    subtitle: 'Words only your household understands, toddler mispronunciations, and grandparent catchphrases.',
    hints: [
      'A phrase your parents always repeated when you were leaving the house',
      'A toddler mispronunciation that became permanent family vocabulary for decades',
      'An inside joke born out of a hilarious holiday misunderstanding'
    ],
    placeholder: 'e.g. Whenever someone lost their car keys, Dad would instantly shout \'Check the butter dish!\' because of a legendary morning in 1982 when Mom actually found her sunglasses in the refrigerator...'
  },
  {
    id: 'q_annual_gatherings',
    category: 'traditions',
    chapterTitle: 'Family Traditions & Rituals',
    question: 'Did your family have an annual summer trip, lake weekend, opening-day tradition, or reunion?',
    subtitle: 'The recurring ritual you counted down the calendar months to attend.',
    hints: [
      'Renting the same lake cabin or beach cottage year after year',
      'Opening day at the ballpark, county fair weekend, or camping under the stars',
      'Cousins growing up together on summer docks and porch swings'
    ],
    placeholder: 'e.g. The first week of August was always our week at Bear Lake. Four families squeezed into two rustic cabins, catching sunfish from the dock and telling ghost stories around the bonfire...'
  },

  // 6. EARLY LIFE & YOUTH
  {
    id: 'q_early_childhood',
    category: 'roots',
    chapterTitle: 'Early Life & Youth',
    question: 'What are your very earliest childhood memories, favorite childhood toys, or innocent mischief you got into?',
    subtitle: 'First vivid recollections, beloved bicycles, tree forts, and Saturday mornings.',
    hints: [
      'Your very first memory of sight, smell, or comfort as a toddler',
      'Favorite toy, bicycle, baseball mitt, or book you took everywhere',
      'Mischief with siblings or neighbors that got you into affectionate trouble',
      'What life felt like back in that era'
    ],
    placeholder: 'e.g. My banana-seat red Schwinn bicycle. In the summer we’d clothespin playing cards to the wheel spokes so it sounded like a motorcycle, roaring up and down the sidewalks until twilight...'
  },
  {
    id: 'q_school_friends',
    category: 'roots',
    chapterTitle: 'Early Life & Youth',
    question: 'What were your school years like, and who were the teachers or friends who shaped who you became?',
    subtitle: 'Beloved mentors, lifelong best friends, lockers, high school dances, and team triumphs.',
    hints: [
      'A teacher who believed in your talent before you believed in it yourself',
      'Your closest childhood partner-in-crime and what you bonded over',
      'High school sports, theater productions, band trips, or garage band sessions'
    ],
    placeholder: 'e.g. Mrs. Gallagher in 10th-grade English. She handed me a copy of Hemingway and wrote on my essay, \'You have a natural voice; never let anyone quiet it.\' It gave me confidence for life...'
  },
  {
    id: 'q_soundtrack_youth',
    category: 'roots',
    chapterTitle: 'Early Life & Youth',
    question: 'What was the soundtrack, the fashion, the cars, and the pop culture of your youth?',
    subtitle: 'The first vinyl record or tape you bought, the first car you drove, and the styles of the day.',
    hints: [
      'The first album or cassette you bought with your own earned money',
      'Your first car (and its endearing rattles, quirks, and road trips)',
      'Fashion trends, haircuts, drive-in movies, and weekend rituals'
    ],
    placeholder: 'e.g. A faded blue 1978 Chevy Nova with a cracked vinyl dashboard and an AM radio. We cruised Main Street on Friday nights blasting Tom Petty and Led Zeppelin with the windows down...'
  },

  // 7. LOVE, COURTSHIP & MILESTONES
  {
    id: 'q_how_we_met',
    category: 'love',
    chapterTitle: 'Love, Courtship & Milestones',
    question: 'How did you meet your spouse or life partner? What were the first impressions and early days like?',
    subtitle: 'The first glance, the awkward first date, the spark, and the moment you knew.',
    hints: [
      'Where your paths crossed and what each of you was doing that day',
      'What you first noticed about their smile, laugh, voice, or kindness',
      'The first date (the conversation, nerves, or funny mistakes)',
      'When you realized this was the person you wanted to build a life with'
    ],
    placeholder: 'e.g. We met at a mutual friend’s barbecue in July 1989. She was wearing yellow sneakers and debating someone about baseball trivia. Our first date was coffee that turned into a four-hour walk...'
  },
  {
    id: 'q_partnership_moments',
    category: 'love',
    chapterTitle: 'Love, Courtship & Milestones',
    question: 'What were the moments in your partnership that forged your bond through life’s storms and joys?',
    subtitle: 'Scraping by in early apartments, holding hands in hospital rooms, and celebrating triumphs.',
    hints: [
      'How you supported each other during lean early career years',
      'Welcoming children, pets, or building a home together',
      'A quiet moment in the middle of a hardship where you knew you were an unbreakable team'
    ],
    placeholder: 'e.g. In our first apartment we had no furniture, so we ate pizza sitting cross-legged on the floor off a cardboard moving box. We looked at each other and said, \'If we have each other, we’re rich\'...'
  },
  {
    id: 'q_proudest_turning_points',
    category: 'love',
    chapterTitle: 'Love, Courtship & Milestones',
    question: 'What turning points or decisions in your life took the most courage? What are you proudest of having built?',
    subtitle: 'Career leaps, moves across the country, creative passions, and overcoming steep hurdles.',
    hints: [
      'A moment you took a huge leap of faith instead of playing it safe',
      'The career accomplishment or craft you poured your sweat into',
      'Overcoming a difficult setback and emerging stronger on the other side'
    ],
    placeholder: 'e.g. Leaving a secure corporate job at 34 to open my own woodworking shop. Everyone said I was crazy, but creating custom furniture with my own hands gave me pride every single day...'
  },

  // 8. GUIDING WISDOM & BLESSINGS
  {
    id: 'q_life_lessons',
    category: 'wisdom',
    chapterTitle: 'Guiding Wisdom & Future Blessings',
    question: 'What are the most hard-earned life lessons, core values, and truths that guided you through life?',
    subtitle: 'What you wish you knew when you were younger, and what truly matters in the end.',
    hints: [
      'What matters most when prestige and money are stripped away',
      'How to handle heartbreak, grief, or unfair circumstances with grace',
      'The value of generosity, honesty, hard work, and quiet kindness',
      'A piece of advice you followed that never steered you wrong'
    ],
    placeholder: 'e.g. Never let pride prevent you from apologizing first. Time with the people you love is the only currency that never devalues. Be quick to listen and slow to judge...'
  },
  {
    id: 'q_future_blessings',
    category: 'wisdom',
    chapterTitle: 'Guiding Wisdom & Future Blessings',
    question: 'If you could whisper three pieces of wisdom to your great-grandchildren, what would you say to them?',
    subtitle: 'A blessing, prayer, or love letter for the future generations of your family.',
    hints: [
      'Hopes for how they treat one another and protect family unity',
      'A family motto or guiding compass for navigating tough times',
      'A reminder that they come from strong, loving, hardworking roots'
    ],
    placeholder: 'e.g. Remember who you come from. We were ordinary people who worked hard, loved deeply, and laughed often. Stand up for those who cannot stand up for themselves. You are loved beyond measure...'
  }
];

export function getChapterMeta(category: HistoryCategory | string): HistoryChapter {
  const found = HISTORY_CHAPTERS.find(c => c.category === category);
  if (found) return found;
  return {
    category: 'custom',
    title: 'Personal Memories & Stories',
    subtitle: 'Custom questions and family lore.',
    iconName: 'PenTool'
  };
}
