import { PreloaderResponse } from "@src/preload";

import {
  DescribeTableCommand,
  DescribeTableCommandOutput,
  DynamoDBClient,
  DynamoDBClientConfig,
  ListTablesCommand,
  ListTablesCommandInput,
  ListTablesCommandOutput,
} from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocument,
  ScanCommandInput,
  ScanCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import { fetchCredentials } from "@src/utils/aws/credentials";
import { listAwsConfig } from "../accounts/config";

const clientConstructor = async (profile: string, region: string) => {
  if (!profile) throw Error("No profile provided to client");

  const credentials = await fetchCredentials(profile);
  const configurations = await listAwsConfig();

  const params: DynamoDBClientConfig = {
    region,
    credentials,
    logger: console,
  };

  const endpoint = configurations.data.find(
    (config) => config.profile === profile
  ).endpoint;

  if (endpoint) params.endpoint = endpoint;

  const client = new DynamoDBClient(params);

  return client;
};

const fetchAllTables = async (
  client: DynamoDBClient,
  previousResult?: ListTablesCommandOutput
): Promise<ListTablesCommandOutput> => {
  let TableNames: string[] = [];
  const params: ListTablesCommandInput = {
    Limit: 100,
  };

  if (previousResult?.LastEvaluatedTableName)
    params.ExclusiveStartTableName = previousResult.LastEvaluatedTableName;

  const command = new ListTablesCommand(params);
  const results = await client.send(command);

  if (results.TableNames.length === 100) {
    TableNames = [...TableNames, ...results.TableNames];
    const result = await fetchAllTables(client, results);
    TableNames = [...TableNames, ...result.TableNames];
    return {
      ...result,
      TableNames,
    };
  } else {
    return results;
  }
};

// Assume profile and list tables
export const listTables = async (
  profile: string,
  region: string
): Promise<PreloaderResponse<ListTablesCommandOutput | null>> => {
  let result;

  try {
    const client = await clientConstructor(profile, region);

    result = await fetchAllTables(client);

    return {
      type: "success",
      data: result,
      message: `Fetched list of tables from dynamo: ${region}`,
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
): Promise<PreloaderResponse<DescribeTableCommandOutput | null>> => {
  let result;

  try {
    const client = await clientConstructor(profile, region);

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
  options: ScanCommandInput
): Promise<PreloaderResponse<ScanCommandOutput | null>> => {
  let result;

  try {
    const client = await clientConstructor(profile, region);

    const documentClient = DynamoDBDocument.from(client);

    result = await documentClient.scan(options);

    return {
      type: "success",
      data: result,
      message: `Scanned table: ${options.TableName}`,
      details: `Scan count: ${result.Count}`,
    };
  } catch (e) {
    return {
      type: "error",
      data: null,
      message: `Scan operation failed: ${options.TableName}`,
      details: e.message,
    };
  }
};
