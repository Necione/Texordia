export const monsters = [
  {
    name: "Slime",
    naturalEncounter: true,
    encounterRange: [1, 1],
    expRange: [2, 5],
    hpRange: [3, 5],
    damage: [2, 4],
    drops: [
      {
        item: "Slimeball",
        dropChance: 90,
        quantityRange: [1, 2],
      },
      {
        item: "Condensate",
        dropChance: 10,
        quantityRange: [1, 2],
      },
    ],
  },
  {
    name: "Zombie",
    naturalEncounter: true,
    encounterRange: [1, 2],
    expRange: [4, 7],
    hpRange: [5, 7],
    damage: [1, 3],
    drops: [
      {
        item: "Flesh",
        dropChance: 90,
        quantityRange: [1, 2],
      },
      {
        item: "Zombie Hide",
        dropChance: 50,
        quantityRange: [1, 2],
      },
    ],
  },
  {
    name: "Spider",
    naturalEncounter: true,
    encounterRange: [1, 3],
    expRange: [2, 6],
    hpRange: [8, 10],
    damage: [1, 2],
    drops: [
      {
        item: "Spiderweb",
        dropChance: 100,
        quantityRange: [2, 3],
      },
      {
        item: "Spider Eye",
        dropChance: 20,
        quantityRange: [1, 2],
      },
    ],
  },
  {
    name: "Jellyfish",
    naturalEncounter: true,
    encounterRange: [2, 3],
    expRange: [2, 3],
    hpRange: [7, 15],
    damage: [4, 7],
    drops: [
      {
        item: "Jelly",
        dropChance: 80,
        quantityRange: [1, 2],
      }
    ],
  },
  {
    name: "Lesser Jellyfish",
    naturalEncounter: false,
    encounterRange: [2, 3],
    expRange: [1, 3],
    hpRange: [4, 6],
    damage: [2, 4],
    drops: [
      {
        item: "Jelly",
        dropChance: 80,
        quantityRange: [1, 2],
      }
    ],
  },
  {
    name: "Crab",
    naturalEncounter: true,
    encounterRange: [2, 3],
    expRange: [5, 8],
    hpRange: [2, 5],
    damage: [7, 14],
    drops: [
      {
        item: "Shell",
        dropChance: 80,
        quantityRange: [1, 2],
      }
    ],
  },
  {
    name: "Rattlesnake",
    naturalEncounter: true,
    encounterRange: [2, 4],
    expRange: [2, 6],
    hpRange: [12, 19],
    damage: [2, 5],
    drops: [
      {
        item: "Hardened Skin",
        dropChance: 50,
        quantityRange: [1, 2],
      },
    ],
  },
  {
    name: "Mummy",
    naturalEncounter: true,
    encounterRange: [3, 4],
    expRange: [4, 6],
    hpRange: [20, 30],
    damage: [2, 4],
    drops: [
      {
        item: "Old Tape",
        dropChance: 70,
        quantityRange: [1, 2],
      },
    ],
  },
];
