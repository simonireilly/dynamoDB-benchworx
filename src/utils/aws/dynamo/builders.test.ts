import {
  primaryKeyCondition,
  PartialKeyExpression,
  sortKeyCondition,
} from "./builders";

describe("primaryKeyCondition", () => {
  it("creates a partial for deep merging", () => {
    const result = primaryKeyCondition({
      primaryKeyName: "pk",
      primaryKeyValue: "1122334",
    });

    expect(result).toEqual(
      expect.objectContaining({
        KeyConditionExpression: `#pk = :pk`,
        ExpressionAttributeNames: {
          "#pk": "pk",
        },
        ExpressionAttributeValues: {
          ":pk": "1122334",
        },
      } as PartialKeyExpression)
    );
  });
});

describe("sortKeyCondition", () => {
  it("creates a partial for deep merging", () => {
    const result = sortKeyCondition({
      sortKeyName: "sk",
      sortKeyValue: "1122334",
      condition: "beginsWith",
    });

    expect(result).toEqual(
      expect.objectContaining({
        ExpressionAttributeNames: { "#sk": "sk" },
        ExpressionAttributeValues: { ":sk": "1122334" },
        KeyConditionExpression: "begins_with(#sk, :sk)",
      } as PartialKeyExpression)
    );
  });

  it("creates a partial for deep merging", () => {
    const result = sortKeyCondition({
      sortKeyName: "sk",
      sortKeyValue: { lower: "2", upper: "3" },
      condition: "between",
    });

    expect(result).toEqual(
      expect.objectContaining({
        ExpressionAttributeNames: { "#sk": "sk" },
        ExpressionAttributeValues: { ":sk_lower": "2", ":sk_upper": "3" },
        KeyConditionExpression: "#sk BETWEEN :sk_lower AND :sk_upper",
      } as PartialKeyExpression)
    );
  });
});
