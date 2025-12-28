const DATA = [
  {
    level: 1,
    prompt: "Ich bin müde.",
    accepted: ["je suis fatigué", "je suis fatiguée"],
    expected: "Je suis fatigué(e).",
    genderFlexible: true,
    strictGenus: false,
    isWeather: false
  },
  {
    level: 1,
    prompt: "die Schwester",
    accepted: ["la sœur", "la soeur"],
    expected: "la sœur",
    genderFlexible: false,
    strictGenus: true,
    isWeather: false
  },
  {
    level: 1,
    prompt: "ein bisschen",
    accepted: ["un peu", "un peu de"],
    expected: "un peu",
    genderFlexible: false,
    strictGenus: false,
    isWeather: false
  },
  {
    level: 1,
    prompt: "Wie geht's?",
    accepted: ["ça va", "comment ça va"],
    expected: "Ça va ?",
    genderFlexible: false,
    strictGenus: false,
    isWeather: false
  },
  {
    level: 1,
    prompt: "Ich gehe einkaufen.",
    accepted: ["je fais les courses", "je vais acheter"],
    expected: "Je fais les courses.",
    genderFlexible: false,
    strictGenus: false,
    isWeather: false
  },
  {
    level: 1,
    prompt: "stilles Wasser",
    accepted: ["l'eau plate", "eau plate", "eau non gazeuse"],
    expected: "l’eau plate",
    genderFlexible: false,
    strictGenus: false,
    isWeather: false
  },
  {
    level: 1,
    prompt: "ein Gericht auswählen",
    accepted: ["choisir un plat"],
    expected: "choisir un plat",
    genderFlexible: false,
    strictGenus: false,
    isWeather: false
  },
  {
    level: 1,
    prompt: "die Fahrkarte",
    accepted: ["le billet", "le ticket"],
    expected: "le billet / le ticket",
    genderFlexible: false,
    strictGenus: true,
    isWeather: false
  },
  {
    level: 1,
    prompt: "es ist schön",
    accepted: ["il fait beau"],
    expected: "il fait beau",
    genderFlexible: false,
    strictGenus: false,
    isWeather: true
  },
  {
    level: 1,
    prompt: "déjeuner – das Frühstück",
    accepted: ["le petit-déjeuner", "petit-déjeuner"],
    expected: "le petit-déjeuner",
    genderFlexible: false,
    strictGenus: true,
    isWeather: false
  },
  {
    level: 1,
    prompt: "das Wochenende",
    accepted: ["le week-end", "le weekend"],
    expected: "le week-end",
    genderFlexible: false,
    strictGenus: true,
    isWeather: false
  },
  {
    level: 1,
    prompt: "frei",
    accepted: ["libre"],
    expected: "libre",
    genderFlexible: false,
    strictGenus: false,
    isWeather: false
  }
];
