import { AttributeType } from "./types/attribute-type";

interface StatAttribute extends Attribute {
  value: number;
  unit?: string;
}

interface DescriptionAttribute extends Attribute {
  value: string;
}

interface Attribute {
  type: AttributeType;
}

const assertIsStatAttribute = (
  attribute: Attribute
): attribute is StatAttribute => {
  if ("value" in attribute) {
    return true;
  }
  return false;
};

const assertIsDescriptionAttribute = (
  attribute: Attribute
): attribute is DescriptionAttribute => {
  if ("description" in attribute) {
    return true;
  }
  return false;
};

export { assertIsStatAttribute, assertIsDescriptionAttribute };
export type { Attribute, StatAttribute, DescriptionAttribute };
