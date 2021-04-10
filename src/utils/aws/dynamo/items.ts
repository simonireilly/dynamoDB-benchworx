import { KeySchemaElement } from "@aws-sdk/client-dynamodb";

export const getKeySchema = (
  keySchema: KeySchemaElement[]
): { sortKey: undefined | string; hashKey: undefined | string } => {
  return {
    hashKey: keySchema.find((el) => el.KeyType === "HASH")?.AttributeName,
    sortKey: keySchema.find((el) => el.KeyType === "RANGE")?.AttributeName,
  };
};
