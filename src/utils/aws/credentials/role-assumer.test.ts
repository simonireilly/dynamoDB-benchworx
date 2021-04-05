import { roleAssumer } from "./role-assumer";

const credentialFixture = {
  Expiration: new Date(2020, 4, 5, 9, 30, 0),
  AccessKeyId: "temporary-key",
  SecretAccessKey: "temporary-secret",
  SessionToken: "role-session",
};

jest.mock("@aws-sdk/client-sts", () => {
  return {
    STSClient: jest.fn().mockImplementation(() => {
      return {
        send: () =>
          Promise.resolve({
            Credentials: { ...credentialFixture },
          }),
      };
    }),
    AssumeRoleCommand: jest.fn().mockImplementation(() => {
      return {};
    }),
  };
});

describe("roleAssumer", () => {
  it("returns the temporary credentials from the assumed role", async () => {
    const credentials = await roleAssumer(
      {
        accessKeyId: "test",
        secretAccessKey: "secret",
      },
      {
        RoleArn: "string arn",
        RoleSessionName: "super-session",
      }
    );

    expect(credentials).toEqual({
      accessKeyId: "temporary-key",
      expiration: new Date(2020, 4, 5, 9, 30, 0),
      secretAccessKey: "temporary-secret",
      sessionToken: "role-session",
    });
  });
});
