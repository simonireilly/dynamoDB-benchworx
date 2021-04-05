import { listAwsConfig } from "./config";

jest.spyOn(global.console, "info");
jest.mock("@aws-sdk/shared-ini-file-loader", () => ({
  loadSharedConfigFiles: (): Promise<unknown> => {
    return Promise.resolve({
      configFile: {
        simpleProfile: {
          region: "us-east-1",
        },
        default: {
          region: "eu-west-2",
          output: "json",
        },
        mfaRoleAssume: {
          mfa_serial: "arn:aws:iam::1111111111111:mfa/user.name",
          role_arn: "arn:aws:iam::2222222222:role/userRoleTOAssume",
          source_profile: "default",
          region: "eu-west-1",
          output: "json",
        },
        local: {
          region: "local",
          endpoint: "http://localhost:1234",
        },
      },
      credentialsFile: {
        simpleProfile: {
          aws_access_key_id: "access-1",
          aws_secret_access_key: "key-2",
        },
        cgu: {
          aws_access_key_id: "access-2",
          aws_secret_access_key: "key-2",
        },
        default: {
          aws_access_key_id: "access-3",
          aws_secret_access_key: "key-3",
        },
      },
    });
  },
}));

describe("listAwsConfig", () => {
  it("loads the local config", async () => {
    const results = await listAwsConfig();

    expect(results.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          profile: "default",
          mfa: false,
          assumeRole: false,
          region: "eu-west-2",
        }),
        expect.objectContaining({
          profile: "mfaRoleAssume",
          mfa: true,
          assumeRole: true,
          region: "eu-west-1",
        }),
        expect.objectContaining({
          profile: "local",
          mfa: false,
          assumeRole: false,
          region: "local",
          endpoint: "http://localhost:1234",
        }),
      ])
    );
    expect(results.data.length).toEqual(5);
    expect(results.data).toMatchSnapshot();
  });
});
