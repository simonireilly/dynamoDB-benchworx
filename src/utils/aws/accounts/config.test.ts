import { listAwsConfig } from "./config";

jest.mock("@aws-sdk/shared-ini-file-loader", () => ({
  loadSharedConfigFiles: (): Promise<unknown> => {
    return new Promise((resolve, _) => {
      resolve({
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
    });
  },
}));

describe("listAwsConfig", () => {
  it("loads the local config", async () => {
    const results = await listAwsConfig();

    expect(results.data).toEqual(
      expect.arrayContaining([
        {
          profile: "default",
          mfa: false,
          assumeRole: false,
          region: "eu-west-2",
        },
        {
          profile: "mfaRoleAssume",
          mfa: true,
          assumeRole: true,
          region: "eu-west-1",
        },
      ])
    );
    expect(results.data.length).toEqual(4);
    expect(results.data).toMatchSnapshot();
  });
});
