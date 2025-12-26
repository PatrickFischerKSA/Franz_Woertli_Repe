const VOCAB = [
  {
    "fr": "se lever",
    "de": "aufstehen"
  },
  {
    "fr": "se réveiller",
    "de": "aufwachen"
  },
  {
    "fr": "se laver",
    "de": "sich waschen"
  },
  {
    "fr": "s’habiller",
    "de": "sich anziehen"
  },
  {
    "fr": "prendre le petit-déjeuner",
    "de": "frühstücken"
  },
  {
    "fr": "partir de la maison",
    "de": "das Haus verlassen"
  },
  {
    "fr": "rentrer à la maison",
    "de": "nach Hause kommen"
  },
  {
    "fr": "se coucher",
    "de": "schlafen gehen"
  },
  {
    "fr": "le petit-déjeuner",
    "de": "das Frühstück"
  },
  {
    "fr": "le déjeuner",
    "de": "das Mittagessen"
  },
  {
    "fr": "le dîner",
    "de": "das Abendessen"
  },
  {
    "fr": "manger",
    "de": "essen"
  },
  {
    "fr": "boire",
    "de": "trinken"
  },
  {
    "fr": "le repas",
    "de": "die Mahlzeit"
  },
  {
    "fr": "l’eau",
    "de": "das Wasser"
  },
  {
    "fr": "le jus",
    "de": "der Saft"
  },
  {
    "fr": "aller à pied",
    "de": "zu Fuß gehen"
  },
  {
    "fr": "prendre le bus",
    "de": "den Bus nehmen"
  },
  {
    "fr": "prendre le train",
    "de": "den Zug nehmen"
  },
  {
    "fr": "aller en voiture",
    "de": "mit dem Auto fahren"
  },
  {
    "fr": "arriver à l’heure",
    "de": "pünktlich ankommen"
  },
  {
    "fr": "partir en retard",
    "de": "verspätet losfahren"
  },
  {
    "fr": "faire du sport",
    "de": "Sport treiben"
  },
  {
    "fr": "jouer au foot",
    "de": "Fußball spielen"
  },
  {
    "fr": "jouer au basket",
    "de": "Basketball spielen"
  },
  {
    "fr": "faire de la musique",
    "de": "Musik machen"
  },
  {
    "fr": "sortir avec des amis",
    "de": "mit Freunden ausgehen"
  },
  {
    "fr": "rester tranquille",
    "de": "ruhig bleiben"
  },
  {
    "fr": "occupé / occupée",
    "de": "beschäftigt"
  },
  {
    "fr": "libre",
    "de": "frei"
  },
  {
    "fr": "fatigué / fatiguée",
    "de": "müde"
  },
  {
    "fr": "content / contente",
    "de": "zufrieden"
  },
  {
    "fr": "stressé / stressée",
    "de": "gestresst"
  },
  {
    "fr": "Ça va ?",
    "de": "Wie geht’s?"
  },
  {
    "fr": "Ça va.",
    "de": "Es geht."
  },
  {
    "fr": "Pas mal.",
    "de": "Nicht schlecht."
  },
  {
    "fr": "Comme ci, comme ça.",
    "de": "So lala."
  },
  {
    "fr": "D’accord.",
    "de": "Einverstanden."
  },
  {
    "fr": "Je me lève à sept heures.",
    "de": "Ich stehe um sieben Uhr auf."
  },
  {
    "fr": "Je prends le petit-déjeuner.",
    "de": "Ich frühstücke."
  },
  {
    "fr": "Je pars de la maison.",
    "de": "Ich verlasse das Haus."
  },
  {
    "fr": "Je prends le bus.",
    "de": "Ich nehme den Bus."
  },
  {
    "fr": "Je rentre à la maison le soir.",
    "de": "Ich komme abends nach Hause."
  },
  {
    "fr": "Je me couche tard.",
    "de": "Ich gehe spät schlafen."
  },
  {
    "fr": "Je fais du sport le week-end.",
    "de": "Ich mache am Wochenende Sport."
  },
  {
    "fr": "Je suis fatigué(e).",
    "de": "Ich bin müde."
  },
  {
    "fr": "le voyage",
    "de": "die Reise"
  },
  {
    "fr": "partir",
    "de": "abreisen"
  },
  {
    "fr": "arriver",
    "de": "ankommen"
  },
  {
    "fr": "le départ",
    "de": "die Abfahrt"
  },
  {
    "fr": "l’arrivée",
    "de": "die Ankunft"
  },
  {
    "fr": "la gare",
    "de": "der Bahnhof"
  },
  {
    "fr": "le train",
    "de": "der Zug"
  },
  {
    "fr": "le bus",
    "de": "der Bus"
  },
  {
    "fr": "le billet / le ticket",
    "de": "die Fahrkarte"
  },
  {
    "fr": "le quai",
    "de": "der Bahnsteig"
  },
  {
    "fr": "le plan",
    "de": "der Stadtplan"
  },
  {
    "fr": "le trajet",
    "de": "die Strecke"
  },
  {
    "fr": "le voyageur / la voyageuse",
    "de": "der/die Reisende"
  },
  {
    "fr": "le retard",
    "de": "die Verspätung"
  },
  {
    "fr": "être en retard",
    "de": "verspätet sein"
  },
  {
    "fr": "les vacances",
    "de": "die Ferien"
  },
  {
    "fr": "l’hôtel",
    "de": "das Hotel"
  },
  {
    "fr": "l’auberge",
    "de": "die Jugendherberge"
  },
  {
    "fr": "la chambre",
    "de": "das Zimmer"
  },
  {
    "fr": "réserver",
    "de": "reservieren"
  },
  {
    "fr": "rester",
    "de": "bleiben"
  },
  {
    "fr": "dormir",
    "de": "schlafen"
  },
  {
    "fr": "se reposer",
    "de": "sich ausruhen"
  },
  {
    "fr": "la réception",
    "de": "die Rezeption"
  },
  {
    "fr": "la clé",
    "de": "der Schlüssel"
  },
  {
    "fr": "le séjour",
    "de": "der Aufenthalt"
  },
  {
    "fr": "une nuit",
    "de": "eine Nacht"
  },
  {
    "fr": "le lit",
    "de": "das Bett"
  },
  {
    "fr": "la salle de bain",
    "de": "das Badezimmer"
  },
  {
    "fr": "la rue",
    "de": "die Straße"
  },
  {
    "fr": "la place",
    "de": "der Platz"
  },
  {
    "fr": "le centre-ville",
    "de": "das Stadtzentrum"
  },
  {
    "fr": "à gauche",
    "de": "links"
  },
  {
    "fr": "à droite",
    "de": "rechts"
  },
  {
    "fr": "tout droit",
    "de": "geradeaus"
  },
  {
    "fr": "près de",
    "de": "nahe bei"
  },
  {
    "fr": "loin de",
    "de": "weit weg von"
  },
  {
    "fr": "au coin de",
    "de": "an der Ecke von"
  },
  {
    "fr": "en face de",
    "de": "gegenüber von"
  },
  {
    "fr": "à côté de",
    "de": "neben"
  },
  {
    "fr": "au bout de",
    "de": "am Ende von"
  },
  {
    "fr": "au milieu de",
    "de": "in der Mitte von"
  },
  {
    "fr": "tourner",
    "de": "abbiegen"
  },
  {
    "fr": "traverser",
    "de": "überqueren"
  },
  {
    "fr": "continuer tout droit",
    "de": "geradeaus weitergehen"
  },
  {
    "fr": "suivre",
    "de": "folgen"
  },
  {
    "fr": "revenir",
    "de": "zurückkommen"
  },
  {
    "fr": "le restaurant",
    "de": "das Restaurant"
  },
  {
    "fr": "le menu",
    "de": "die Speisekarte"
  },
  {
    "fr": "le plat",
    "de": "das Gericht"
  },
  {
    "fr": "le plat principal",
    "de": "das Hauptgericht"
  },
  {
    "fr": "l’entrée",
    "de": "die Vorspeise"
  },
  {
    "fr": "le dessert",
    "de": "das Dessert"
  },
  {
    "fr": "la boisson",
    "de": "das Getränk"
  },
  {
    "fr": "commander",
    "de": "bestellen"
  },
  {
    "fr": "choisir un plat",
    "de": "ein Gericht auswählen"
  },
  {
    "fr": "goûter",
    "de": "probieren"
  },
  {
    "fr": "recommander",
    "de": "empfehlen"
  },
  {
    "fr": "payer",
    "de": "bezahlen"
  },
  {
    "fr": "l’addition",
    "de": "die Rechnung"
  },
  {
    "fr": "délicieux / délicieuse",
    "de": "lecker"
  },
  {
    "fr": "l’eau plate",
    "de": "stilles Wasser"
  },
  {
    "fr": "l’eau gazeuse",
    "de": "Mineralwasser"
  },
  {
    "fr": "laisser un pourboire",
    "de": "Trinkgeld geben"
  },
  {
    "fr": "servir",
    "de": "servieren"
  },
  {
    "fr": "le corps",
    "de": "der Körper"
  },
  {
    "fr": "la tête",
    "de": "der Kopf"
  },
  {
    "fr": "le bras",
    "de": "der Arm"
  },
  {
    "fr": "la jambe",
    "de": "das Bein"
  },
  {
    "fr": "le pied",
    "de": "der Fuß"
  },
  {
    "fr": "le médecin",
    "de": "der Arzt"
  },
  {
    "fr": "malade",
    "de": "krank"
  },
  {
    "fr": "avoir mal à",
    "de": "Schmerzen haben an"
  },
  {
    "fr": "avoir mal",
    "de": "Schmerzen haben"
  },
  {
    "fr": "la fièvre",
    "de": "das Fieber"
  },
  {
    "fr": "la toux",
    "de": "der Husten"
  },
  {
    "fr": "le rhume",
    "de": "der Schnupfen"
  },
  {
    "fr": "le médicament",
    "de": "das Medikament"
  },
  {
    "fr": "prendre un médicament",
    "de": "ein Medikament einnehmen"
  },
  {
    "fr": "se sentir bien / mal",
    "de": "sich gut / schlecht fühlen"
  },
  {
    "fr": "aller mieux",
    "de": "besser gehen"
  },
  {
    "fr": "aller mal",
    "de": "schlecht gehen"
  },
  {
    "fr": "consulter un médecin",
    "de": "einen Arzt aufsuchen"
  },
  {
    "fr": "alors",
    "de": "also"
  },
  {
    "fr": "puis",
    "de": "dann"
  },
  {
    "fr": "ensuite",
    "de": "danach"
  },
  {
    "fr": "enfin",
    "de": "schließlich"
  },
  {
    "fr": "donc",
    "de": "also"
  },
  {
    "fr": "pourtant",
    "de": "trotzdem"
  },
  {
    "fr": "parce que",
    "de": "weil"
  },
  {
    "fr": "quand",
    "de": "wenn / wann"
  },
  {
    "fr": "pendant",
    "de": "während"
  },
  {
    "fr": "avant",
    "de": "vor"
  },
  {
    "fr": "après",
    "de": "nach"
  },
  {
    "fr": "déjà",
    "de": "schon"
  },
  {
    "fr": "encore",
    "de": "noch"
  },
  {
    "fr": "seulement",
    "de": "nur"
  },
  {
    "fr": "environ",
    "de": "ungefähr"
  },
  {
    "fr": "surtout",
    "de": "vor allem"
  },
  {
    "fr": "sinon",
    "de": "sonst"
  },
  {
    "fr": "beaucoup de",
    "de": "viel(e)"
  },
  {
    "fr": "peu de",
    "de": "wenig"
  },
  {
    "fr": "assez de",
    "de": "genug"
  },
  {
    "fr": "trop de",
    "de": "zu viel"
  },
  {
    "fr": "un peu de",
    "de": "ein bisschen"
  },
  {
    "fr": "la plupart de",
    "de": "die meisten"
  },
  {
    "fr": "tout de suite",
    "de": "sofort"
  },
  {
    "fr": "plus tard",
    "de": "später"
  },
  {
    "fr": "en avance",
    "de": "zu früh"
  },
  {
    "fr": "à l’heure",
    "de": "pünktlich"
  },
  {
    "fr": "à temps",
    "de": "rechtzeitig"
  },
  {
    "fr": "avoir besoin de",
    "de": "brauchen"
  },
  {
    "fr": "avoir envie de",
    "de": "Lust haben"
  },
  {
    "fr": "avoir le temps",
    "de": "Zeit haben"
  },
  {
    "fr": "ne pas avoir le temps",
    "de": "keine Zeit haben"
  },
  {
    "fr": "faire attention",
    "de": "aufpassen"
  },
  {
    "fr": "se dépêcher",
    "de": "sich beeilen"
  },
  {
    "fr": "attendre quelqu’un",
    "de": "auf jemanden warten"
  },
  {
    "fr": "être d’accord",
    "de": "einverstanden sein"
  },
  {
    "fr": "ne pas être d’accord",
    "de": "nicht einverstanden sein"
  },
  {
    "fr": "s’excuser",
    "de": "sich entschuldigen"
  },
  {
    "fr": "remercier",
    "de": "danken"
  },
  {
    "fr": "refuser",
    "de": "ablehnen"
  },
  {
    "fr": "accepter",
    "de": "akzeptieren"
  },
  {
    "fr": "proposer",
    "de": "vorschlagen"
  },
  {
    "fr": "c’est possible",
    "de": "das ist möglich"
  },
  {
    "fr": "c’est impossible",
    "de": "das ist unmöglich"
  },
  {
    "fr": "ça ne marche pas",
    "de": "das funktioniert nicht"
  },
  {
    "fr": "pas de souci",
    "de": "kein Problem"
  },
  {
    "fr": "bon voyage",
    "de": "gute Reise"
  }
];