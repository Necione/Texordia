export const blades = [
  {
    name: "Iron Blade",
    cost: 30,
    bonuses: { attackIncrease: 1.5 },
    purchasable: true,
  },
  {
    name: "Dulled Blade",
    cost: 0,
    bonuses: { attackIncrease: 0.75 },
    purchasable: false,
  },
];

export const hilts = [
  {
    name: "Iron Hilt",
    cost: 25,
    bonuses: { defenseIncrease: 1 },
    purchasable: true,
  },
  {
    name: "Golden Hilt",
    cost: 0,
    bonuses: {
      critValue: 20,
      critChance: 5,
    },
    purchasable: false,
  },
];

export const handles = [
  {
    name: "Old Shaft",
    cost: 20,
    bonuses: { attackIncrease: 0.5 },
    purchasable: true,
  },
];
