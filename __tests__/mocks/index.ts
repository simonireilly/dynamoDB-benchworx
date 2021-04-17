import { PutCommandInput, QueryCommandInput } from "@aws-sdk/lib-dynamodb";

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
  scan: async (profile: string, region: string, options) => {
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
  authenticator: async ({
    profile,
    mfaCode,
  }: {
    profile: string;
    mfaCode: string;
  }) => ({
    data: { expiration: new Date() },
    type: "success",
    message: "Authenticated",
    details: "",
  }),
  describeTable: async (
    profile: string,
    region: string,
    TableName: string
  ) => ({
    data: {
      $metadata: {},
    },
    details: "",
    message: "",
    type: "success",
  }),
  put: async (profile: string, region: string, options: PutCommandInput) => ({
    data: {
      $metadata: {},
    },
    details: "",
    message: "",
    type: "success",
  }),
  query: async (
    profile: string,
    region: string,
    options: QueryCommandInput
  ) => ({
    data: {
      $metadata: {},
    },
    details: "",
    message: "",
    type: "success",
  }),
};
