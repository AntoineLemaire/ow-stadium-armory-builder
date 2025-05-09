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

const getLocalizedHeroes = (): Hero[] => {
  const t = i18n.getFixedT(null, "heroes");
  const order = t("order", { returnObjects: true }) as number[];

  return order
    .map<Hero | undefined>((id) => {
      const heroData = heroes.find((h) => h.id === id);
      if (heroData) {
        return {
          ...heroData,
          id: id,
          name: t(String(id)),
        } as Hero;
      }
    })
    .filter((h) => !!h);
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
