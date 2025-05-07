import { Attribute } from "./attribute";
import { Perk } from "./perk";

export interface Power extends Perk {
  description: string;
  attributes?: Attribute[];
}
