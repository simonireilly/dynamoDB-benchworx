import { getKeySchema } from "./items";

describe("getKeySchema", () => {
  it("returns the pk and sk names", () => {
    const results = getKeySchema([
      {
        AttributeName: "primaryKeyName",
        KeyType: "HASH",
      },
      {
        AttributeName: "sk",
        KeyType: "RANGE",
      },
    ]);

    expect(results).toEqual(
      expect.objectContaining({
        hashKey: "primaryKeyName",
        sortKey: "sk",
      })
    );
  });
  it("returns pk only for tables without sort keys", () => {
    const results = getKeySchema([
      {
        AttributeName: "primaryKeyName",
        KeyType: "HASH",
      },
    ]);

    expect(results).toEqual(
      expect.objectContaining({
        hashKey: "primaryKeyName",
        sortKey: undefined,
      })
    );
  });
});
