import basicItems from './basicItems.json';
import heroes from './heroes.json';
import attributeTypes from './attributeTypes.json';

const heroesOrder = [
  // Tank
  19, // D.Va
  34, // Junker Queen
  24, // Orisa
  5, // Reinhardt
  13, // Zarya

  // DPS
  29, // Ashe
  14, // Cassidy
  21, // Genji
  20, // Mei
  2, // Reaper
  15, // Soldier 76

  // Support
  22, // Ana
  41, // Juno
  35, // Kiriko
  16, // Lucio
  6, // Mercy
  26, // Moira
];

// Sort basic items
Object.values(basicItems).forEach((items) =>
  items.sort((a, b) => (a.position ?? Infinity) - (b.position ?? Infinity))
);

// Sort heroes capacities
heroes.forEach((hero) => {
  // Sort powers
  hero.powers.sort(
    (a, b) => (a.position ?? Infinity) - (b.position ?? Infinity)
  );

  // Sort items (comon, rare, epic)
  Object.values(hero.items).forEach((arr) =>
    arr.sort((a, b) => (a.position ?? Infinity) - (b.position ?? Infinity))
  );
});

// Sort heroes by the defined order
heroes.sort((a, b) => heroesOrder.indexOf(a.id) - heroesOrder.indexOf(b.id));

export { basicItems, heroes, heroesOrder, attributeTypes };
