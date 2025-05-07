import { attributeTypes } from "../db/db";

const getAttributeName = (attributeType: keyof typeof attributeTypes) => {
  return attributeTypes[attributeType]?.name || attributeType;
};

export default getAttributeName;
