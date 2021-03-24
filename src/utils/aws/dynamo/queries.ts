import { PreloaderResponse } from "@/preload";
import { fromIni } from "@aws-sdk/credential-provider-ini";

import {
  DynamoDBClient,
  ListTablesCommand,
  ListTablesCommandOutput,
} from "@aws-sdk/client-dynamodb";

import { roleAssumer } from "./role-assumer";

// Assume profile and list tables
export const listTables = async (
  profile: string,
  mfaCode?: string
): Promise<PreloaderResponse<ListTablesCommandOutput>> => {
  let result;

  try {
    const credentials = fromIni({
      profile,
      roleAssumer,
      mfaCodeProvider: (mfaSerial: string): Promise<string> => {
        return new Promise((resolve) => resolve(mfaCode));
      },
    });

    const client = new DynamoDBClient({
      region: "eu-west-2",
      credentials,
      logger: console,
    });

    result = await client.send(new ListTablesCommand({ Limit: 10 }));

    return {
      type: "success",
      data: result,
      message: `Fetched list of tables from dynamo with ${profile}`,
      details: `Table count: ${result.TableNames.length}`,
    };
  } catch (e) {
    return {
      type: "error",
      data: null,
      message: `Unable to list tables for profile: ${profile}`,
      details: e.message,
    };
  }
};
