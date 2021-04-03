export const mockAws: Window["aws"] = {
  listTables: (profile: string, mfaCode?: string) =>
    Promise.resolve({
      type: "success",
      message: "Fetched tables",
      details: "Fetched 2 tables",
      data: {
        $metadata: {},
        LastEvaluatedTableName: "",
        TableNames: ["table-1", "table-2"],
      },
    }),
  listAwsConfig: () =>
    Promise.resolve({
      type: "success",
      message: "Fetched available profiles",
      data: [
        {
          profile: "default",
          region: "eu-west-1",
          mfa: false,
          assumeRole: false,
        },
      ],
      details: null,
    }),
  scan: async (profile: string, region: string, tableName: string) => {
    return {
      data: {
        $metadata: {},
        Count: 2,
        ScannedCount: 2,
        ConsumedCapacity: 2,
        LastEvaluatedKey: null,
        Items: [...Array.from({ length: 100 }, (x, i) => ++i)].map(
          (key: number) => ({
            pk: `user-${key}`,
            sk: new Date(Date.now()),
          })
        ),
      },
      details: null,
      message: "",
      type: "success",
    };
  },
};
