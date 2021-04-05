import { mocked } from "ts-jest/utils";
import { describeTable, listTables, scan } from "./queries";
import nock from "nock";
import {
  ListTablesCommandInput,
  ListTablesCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { fetchCredentials } from "@src/utils/aws/credentials";
import { listAwsConfig } from "@src/utils/aws/accounts/config";
import { describeTableResponse } from "@fixtures/index";
import { PreloaderResponse } from "@src/preload";

jest.spyOn(global.console, "info");

jest.mock("@src/utils/aws/credentials");
const mockedFetchCredentials = mocked(fetchCredentials);

jest.mock("@src/utils/aws/accounts/config");
const mockedListAwsConfig = mocked(listAwsConfig);

describe("Queries", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    nock.disableNetConnect();

    mockedFetchCredentials.mockResolvedValueOnce({
      accessKeyId: "test",
      secretAccessKey: "secret",
    });

    mockedListAwsConfig.mockResolvedValueOnce({
      type: "success",
      data: [
        { profile: "cgu", mfa: false, assumeRole: false, region: "eu-west-1" },
      ],
      message: null,
      details: null,
    });
  });

  describe("listTables", () => {
    it("lists all available tables", async () => {
      const TableNames = ["Table-1", "Table-2", "Table-3"];
      // Mock post Request
      nock("https://dynamodb.eu-west-1.amazonaws.com").post("/").reply(200, {
        TableNames,
      });

      // Act
      const result = await listTables("cgu", "eu-west-1");

      // assert
      expect(result.data.TableNames).toEqual(
        expect.arrayContaining(TableNames)
      );
    });

    it("recursively fetches tables when greater than 100 tables found", async () => {
      const TableNames1 = [...Array.from({ length: 100 }, (x, i) => ++i)].map(
        (key: number) => `Table-${key}`
      );
      const TableNames2 = [
        ...Array.from({ length: 100 }, (x, i) => ++i + 100),
      ].map((key: number) => `Table-${key}`);
      const TableNames3 = ["Table-201"];

      nock("https://dynamodb.eu-west-1.amazonaws.com")
        .post("/")
        .reply(200, {
          TableNames: TableNames1,
          LastEvaluatedTableName: "Table-100",
          $metadata: {},
        } as ListTablesCommandOutput);

      nock("https://dynamodb.eu-west-1.amazonaws.com")
        .post("/", {
          Limit: 100,
          ExclusiveStartTableName: "Table-100",
        })
        .reply(200, {
          TableNames: TableNames2,
          LastEvaluatedTableName: "Table-200",
          $metadata: {},
        } as ListTablesCommandOutput);

      nock("https://dynamodb.eu-west-1.amazonaws.com")
        .post("/", {
          Limit: 100,
          ExclusiveStartTableName: "Table-200",
        } as ListTablesCommandInput)
        .reply(200, {
          TableNames: TableNames3,
          LastEvaluatedTableName: "Table-201",
          $metadata: {},
        } as ListTablesCommandOutput);

      // Act
      const result = await listTables("cgu", "eu-west-1");

      // assert
      expect(result.data.TableNames.length).toEqual(201);
      expect(result.data.TableNames).toEqual(
        expect.arrayContaining([...TableNames1, ...TableNames2, ...TableNames3])
      );
    });
  });

  describe("scan", () => {
    it("calls scan command on the document client", async () => {
      const Items = [
        {
          ReplyDateTime: {
            S: "2019-10-31 11:27:17",
          },
          Message: {
            S: "DynamoDB Thread 1 Reply 2 text",
          },
          PostedBy: {
            S: "User B",
          },
          Id: {
            S: "Amazon DynamoDB#DynamoDB Thread 1",
          },
        },
      ];
      // Mock post Request
      nock("https://dynamodb.eu-west-1.amazonaws.com").post("/").reply(200, {
        Count: 1,
        Items,
        ScannedCount: 1,
      });

      // Act
      const result = await scan("cgu", "eu-west-1", {
        TableName: "test-table",
      });

      // assert
      expect(result.data.Items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ReplyDateTime: "2019-10-31 11:27:17",
            Message: "DynamoDB Thread 1 Reply 2 text",
            PostedBy: "User B",
            Id: "Amazon DynamoDB#DynamoDB Thread 1",
          }),
        ])
      );
    });
  });

  describe("describeTable", () => {
    it("returns the information for the table", async () => {
      // Mock post Request
      nock("https://dynamodb.eu-west-1.amazonaws.com")
        .post("/")
        .reply(200, describeTableResponse);

      // Act
      const result = await describeTable("cgu", "eu-west-1", "test-table");

      // assert
      expect(result.data).toMatchSnapshot();
    });
  });

  describe("error handling", () => {
    let result: PreloaderResponse<any>;
    beforeEach(() => {
      // Mock post Request
      nock("https://dynamodb.eu-west-1.amazonaws.com").post("/").reply(404);
    });

    afterEach(() => {
      // assert
      expect(result.type).toEqual("error");
    });
    it("listTables", async () => {
      // Act
      result = await listTables("cgu", "eu-west-1");
    });
    it("scan", async () => {
      // Act
      result = await scan("cgu", "eu-west-1", {
        TableName: "test-table",
      });
    });
    it("query", async () => {
      // Act
      result = await query("cgu", "eu-west-1", {
        TableName: "test-table",
      });
    });
    it("describeTable", async () => {
      // Act
      result = await describeTable("cgu", "eu-west-1", "test-table");
    });
  });
});
