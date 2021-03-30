import { listTables } from "./queries";
import { fetchCredentials } from "@src/utils/aws/credentials";

jest.mock("@aws-sdk/client-dynamodb");
jest.mock("@aws-sdk/lib-dynamodb");

jest.mock("@src/utils/aws/credentials");

const mockedFetchCredentials = fetchCredentials as jest.MockedFunction<
  typeof fetchCredentials
>;

describe("Queries", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("listTables", () => {
    it("lists all available tables", async () => {
      // Mock credential fetch
      mockedFetchCredentials.mockReturnValue({
        accessKeyId: "test-key",
        secretAccessKey: "test-secret",
      });
      // Mock dynamodb client constructor

      // Mock dynamoDB client.send

      // Act
      const result = await listTables("simon", "eu-west-1");

      // assert
      expect(result).toEqual({});
    });
  });
});
