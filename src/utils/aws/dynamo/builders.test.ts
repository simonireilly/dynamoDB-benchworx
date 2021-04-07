import {
  primaryKeyCondition,
  PartialKeyExpression,
  sortKeyCondition,
  sortKeyConditions,
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

describe("sortKeyConditions", () => {
  const cases: {
    condition: keyof typeof sortKeyConditions;
    sortKey: string;
    expectedResult: string;
  }[] = [
    {
      condition: "=",
      sortKey: "dob",
      expectedResult: "#dob = :dob",
    },
    {
      condition: "<",
      sortKey: "gsi_1_sk",
      expectedResult: "#gsi_1_sk < :gsi_1_sk",
    },
    {
      condition: "<=",
      sortKey: "gsi_2_sk",
      expectedResult: "#gsi_2_sk <= :gsi_2_sk",
    },
    {
      condition: ">",
      sortKey: "lsi_sk",
      expectedResult: "#lsi_sk > :lsi_sk",
    },
    {
      condition: ">=",
      sortKey: "gsi_sk",
      expectedResult: "#gsi_sk >= :gsi_sk",
    },
    {
      condition: "between",
      sortKey: "sk1",
      expectedResult: "#sk1 BETWEEN :sk1_lower AND :sk1_upper",
    },
    {
      condition: "beginsWith",
      sortKey: "sk",
      expectedResult: "begins_with(#sk, :sk)",
    },
  ];

  test.each(cases)(
    `invoke %o.condition returning string`,
    ({ condition, sortKey, expectedResult }) => {
      const result = sortKeyConditions[condition](sortKey);
      expect(result).toEqual(expectedResult);
    }
  );
});
