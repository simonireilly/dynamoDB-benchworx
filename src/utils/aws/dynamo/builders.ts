import { QueryCommandInput } from "@aws-sdk/lib-dynamodb";

export const sortKeyConditions = {
  "=": (sortKeyName: string): string => `#${sortKeyName} = :${sortKeyName}`,
  "<": (sortKeyName: string): string => `#${sortKeyName} < :${sortKeyName}`,
  "<=": (sortKeyName: string): string => `#${sortKeyName} <= :${sortKeyName}`,
  ">": (sortKeyName: string): string => `#${sortKeyName} > :${sortKeyName}`,
  ">=": (sortKeyName: string): string => `#${sortKeyName} >= :${sortKeyName}`,
  between: (sortKeyName: string): string =>
    `#${sortKeyName} BETWEEN :${sortKeyName}_lower AND :${sortKeyName}_upper`,
  beginsWith: (sortKeyName: string): string =>
    `begins_with(#${sortKeyName}, :${sortKeyName})`,
};

export const sortKeyAttributeValues = (
  sortKeyName: string,
  sortKeyValue: string | { upper: string; lower: string }
): QueryCommandInput["ExpressionAttributeValues"] => {
  if (typeof sortKeyValue === "string")
    return {
      [`:${sortKeyName}`]: sortKeyValue,
    };

  return {
    [`:${sortKeyName}_lower`]: sortKeyValue.lower,
    [`:${sortKeyName}_upper`]: sortKeyValue.upper,
  };
};

export type PartialKeyExpression = Pick<
  QueryCommandInput,
  | "KeyConditionExpression"
  | "ExpressionAttributeNames"
  | "ExpressionAttributeValues"
>;

export const primaryKeyCondition = ({
  primaryKeyName,
  primaryKeyValue,
}: {
  primaryKeyName: string;
  primaryKeyValue: string;
}): PartialKeyExpression => ({
  KeyConditionExpression: `#${primaryKeyName} = :${primaryKeyName}`,
  ExpressionAttributeNames: {
    [`#${primaryKeyName}`]: primaryKeyName,
  },
  ExpressionAttributeValues: {
    [`:${primaryKeyName}`]: primaryKeyValue,
  },
});

export const sortKeyCondition = ({
  sortKeyName,
  sortKeyValue,
  condition,
}: {
  sortKeyName: string;
  sortKeyValue: string | { upper: string; lower: string };
  condition: keyof typeof sortKeyConditions;
}): PartialKeyExpression => ({
  KeyConditionExpression: sortKeyConditions[condition](sortKeyName),
  ExpressionAttributeNames: {
    [`#${sortKeyName}`]: sortKeyName,
  },
  ExpressionAttributeValues: sortKeyAttributeValues(sortKeyName, sortKeyValue),
});
