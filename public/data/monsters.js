export const monsters = [
  {
    "name": "Zombie",
    "expRange": [4, 7],
    "hpRange": [5, 7],
    "damage": [1, 3],
    "drops": [
      {
        "item": "Flesh",
        "dropChance": 90,
        "quantityRange": [1, 2]
      },
      {
        "item": "Zombie Hide",
        "dropChance": 50,
        "quantityRange": [1, 2]
      }
    ]
  },
  {
    "name": "Slime",
    "expRange": [2, 5],
    "hpRange": [3, 5],
    "damage": [2, 4],
    "drops": [
      {
        "item": "Slimeball",
        "dropChance": 90,
        "quantityRange": [1, 2]
      },
      {
        "item": "Condensate",
        "dropChance": 10,
        "quantityRange": [1, 2]
      }
    ]
  },
  {
    "name": "Spider",
    "expRange": [2, 6],
    "hpRange": [8, 10],
    "damage": [1, 2],
    "drops": [
      {
        "item": "Spiderweb",
        "dropChance": 100,
        "quantityRange": [2, 3]
      },
      {
        "item": "Spider Eye",
        "dropChance": 20,
        "quantityRange": [1, 2]
      }
    ]
  }
];
