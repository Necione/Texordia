export const armors = [
  {
    name: "Hearty Ring",
    bonuses: [
      { type: 'defense', value: 1 },
      { type: 'maxHp', value: 5 }
    ],
    buyPrice: 25,
    sellPrice: 20,
    purchasable: true,
  },
  {
    name: "Travelling Ring",
    bonuses: [
      { type: 'defense', value: 3 }
    ],
    buyPrice: 15,
    sellPrice: 10,
    purchasable: true,
  },
  {
    name: "Blood Ring",
    bonuses: [
      { type: 'attack', value: 2 }
    ],
    buyPrice: 20,
    sellPrice: 10,
    purchasable: true,
  },
  {
    name: "Ring of Focus",
    bonuses: [
      { type: 'critChance', value: 0.1 },
      { type: 'critValue', value: 0.1 }
    ],
    buyPrice: 30,
    sellPrice: 15,
    purchasable: true,
  },
];