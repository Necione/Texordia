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
    name: "Forest Imp",
    naturalEncounter: true,
    encounterRange: [1, 3],
    expRange: [2, 4],
    hpRange: [5, 8],
    damage: [1, 3],
    drops: [
      {
        item: "Imp Horn",
        dropChance: 60,
        quantityRange: [1, 2],
      },
      {
        item: "Mystic Leaf",
        dropChance: 25,
        quantityRange: [1, 1],
      },
    ],
  },
  {
    name: "Mud Crab",
    naturalEncounter: true,
    encounterRange: [1, 2],
    expRange: [3, 5],
    hpRange: [4, 6],
    damage: [2, 4],
    drops: [
      {
        item: "Crab Shell",
        dropChance: 80,
        quantityRange: [1, 3],
      },
      {
        item: "Crab Claw",
        dropChance: 40,
        quantityRange: [1, 2],
      },
    ],
  },
  {
    name: "Cave Bat",
    naturalEncounter: true,
    encounterRange: [2, 4],
    expRange: [3, 6],
    hpRange: [6, 9],
    damage: [1, 2],
    drops: [
      {
        item: "Bat Wing",
        dropChance: 70,
        quantityRange: [1, 2],
      },
      {
        item: "Echo Stone",
        dropChance: 30,
        quantityRange: [1, 1],
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
    naturalEncounter: false,
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
    hpRange: [2, 6],
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
  {
    name: "Goblin",
    naturalEncounter: true,
    encounterRange: [3, 5],
    expRange: [6, 10],
    hpRange: [15, 20],
    damage: [3, 6],
    drops: [
      {
        item: "Goblin Ear",
        dropChance: 75,
        quantityRange: [1, 3],
      },
      {
        item: "Mystic Stone",
        dropChance: 30,
        quantityRange: [1, 1],
      },
    ],
  },
  {
    name: "Troll",
    naturalEncounter: true,
    encounterRange: [4, 6],
    expRange: [10, 15],
    hpRange: [25, 35],
    damage: [4, 7],
    drops: [
      {
        item: "Troll Hide",
        dropChance: 70,
        quantityRange: [1, 2],
      },
      {
        item: "Troll Tooth",
        dropChance: 40,
        quantityRange: [1, 2],
      },
    ],
  },
  {
    name: "Shadow Spirit",
    naturalEncounter: true,
    encounterRange: [5, 7],
    expRange: [15, 20],
    hpRange: [10, 15],
    damage: [5, 10],
    drops: [
      {
        item: "Spirit Essence",
        dropChance: 85,
        quantityRange: [1, 3],
      },
      {
        item: "Shadow Cloth",
        dropChance: 50,
        quantityRange: [1, 2],
      },
    ],
  },
  {
    name: "Ice Elemental",
    naturalEncounter: true,
    encounterRange: [6, 8],
    expRange: [20, 25],
    hpRange: [30, 40],
    damage: [6, 12],
    drops: [
      {
        item: "Ice Shard",
        dropChance: 80,
        quantityRange: [1, 3],
      },
      {
        item: "Frozen Core",
        dropChance: 35,
        quantityRange: [1, 1],
      },
    ],
  }  
];
