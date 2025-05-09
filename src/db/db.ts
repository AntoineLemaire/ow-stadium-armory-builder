import basicItems from "./basicItems.json";
import heroes from "./heroes.json";
import attributeTypes from "./attributeTypes.json";
import i18n from "../i18n";
import { Hero } from "../models/hero";

const getLocalizedAttributeTypes = () => {
  const t = i18n.getFixedT(null, "attributes"); // accès direct sans hook

  return Object.fromEntries(
    Object.entries(attributeTypes).map(([key, data]) => [
      key,
      {
        ...data,
        name: t(key),
      },
    ])
  );
};

/**
 * Build the localized heroes.
 * @returns An array of Hero.
 */
const getLocalizedHeroes = (): Hero[] => {
  const h = i18n.getFixedT(null, "heroes");
  const p = i18n.getFixedT(null, "powers");

  const order = h("order", { returnObjects: true }) as number[];

  // Based on "order" => get the list of hero.
  return (
    order
      .map<Hero | undefined>((id) => {
        // Get hero data from JSON
        const heroData = heroes.find((h) => h.id === id);

        // Should always be true
        if (heroData) {
          // Get powers from translation file
          const powers = heroData.powers.map((powerId) =>
            p(powerId, { returnObjects: true })
          );

          // Return Hero object.
          return {
            ...heroData,
            powers: powers,
            id: id,
            name: h(String(id)),
          } as Hero;
        } else {
          // Add warning if mismatch between order & heroes.
          console.warn("Undefined hero detected for id: ", id);
        }
      })
      // Filter out potentially "undefined" results (shouldn't happen)
      .filter((h) => {
        return !!h;
      })
  );
};

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

export { basicItems, getLocalizedHeroes, getLocalizedAttributeTypes };
