import { mocked } from "ts-jest";
import { listTables } from "./queries";
import nock from "nock";
import {
  ListTablesCommandInput,
  ListTablesCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { fetchCredentials } from "@src/utils/aws/credentials";

jest.mock("@src/utils/aws/credentials");

const mockedFetchCredentials = mocked(fetchCredentials);

describe("Queries", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    nock.disableNetConnect();

    mockedFetchCredentials.mockResolvedValueOnce({
      accessKeyId: "test",
      secretAccessKey: "secret",
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
});
