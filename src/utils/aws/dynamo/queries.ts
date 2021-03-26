import { PreloaderResponse } from "@src/preload";

import {
  DescribeTableCommand,
  DescribeTableCommandOutput,
  DynamoDBClient,
  ListTablesCommand,
  ListTablesCommandOutput,
} from "@aws-sdk/client-dynamodb";

import { DynamoDBDocument, ScanCommandOutput } from "@aws-sdk/lib-dynamodb";
import { fetchCredentials } from "@src/utils/aws/credentials";

// Assume profile and list tables
export const listTables = async (
  profile: string,
  region: string
): Promise<PreloaderResponse<ListTablesCommandOutput>> => {
  let result;

  try {
    const credentials = fetchCredentials(profile);

    const client = new DynamoDBClient({
      region,
      credentials,
      logger: console,
    });

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

export const describeTable = async (
  profile: string,
  region: string,
  tableName: string
): Promise<PreloaderResponse<DescribeTableCommandOutput>> => {
  let result;

  try {
    const credentials = fetchCredentials(profile);

    const client = new DynamoDBClient({
      region,
      credentials,
      logger: console,
    });

    result = await client.send(
      new DescribeTableCommand({ TableName: tableName })
    );

    return {
      type: "success",
      data: result,
      message: `Fetched table schema for ${tableName}`,
      details: `Table item count: ${result.Table.ItemCount}`,
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

export const scan = async (
  profile: string,
  region: string,
  tableName: string
): Promise<PreloaderResponse<ScanCommandOutput>> => {
  let result;

  try {
    const credentials = fetchCredentials(profile);

    const client = new DynamoDBClient({
      region,
      credentials,
      logger: console,
    });

    const documentClient = DynamoDBDocument.from(client);

    result = await documentClient.scan({ TableName: tableName, Limit: 50 });

    return {
      type: "success",
      data: result,
      message: `Fetched list of tables from dynamo with ${profile}`,
      details: `Scan count: ${result.Count}`,
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
