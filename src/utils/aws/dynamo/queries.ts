import { PreloaderResponse } from "@src/preload";
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
  region: string,
  mfaCode?: string
): Promise<PreloaderResponse<ListTablesCommandOutput>> => {
  let result;

  try {
    // Credential fetching needs to be cached
    const credentials = fromIni({
      profile,
      roleAssumer,
      mfaCodeProvider: (mfaSerial: string): Promise<string> => {
        return new Promise((resolve) => resolve(mfaCode));
      },
    });

    const client = new DynamoDBClient({
      region,
      credentials,
      logger: console,
    });

    console.info(credentials);

    result = await client.send(new ListTablesCommand({ Limit: 100 }));

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
