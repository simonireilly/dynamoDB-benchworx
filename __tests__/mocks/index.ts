import { scan } from "@src/utils/aws/dynamo/queries";
import { mocked } from "ts-jest/utils";

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
  scan: mocked(scan),
};
