import { Attribute } from "./attribute";
import { Perk } from "./perk";
import { ItemCategory } from "./types/item-category";

export interface Item extends Perk {
  price: number;
  category: ItemCategory;
  attributes: Attribute[];
}
