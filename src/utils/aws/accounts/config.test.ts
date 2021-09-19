import { listAwsConfig } from "./config";

import { loadSharedConfigFiles } from "@aws-sdk/shared-ini-file-loader";
import { mocked } from "ts-jest/utils";

jest.mock("@aws-sdk/shared-ini-file-loader");
jest.spyOn(global.console, "info");

const fixture = {
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
    sso_admin: {
      sso_start_url: "https://sso.awsapps.com/start",
      sso_region: "eu-west-1",
      sso_account_id: "1123456789",
      sso_role_name: "AWSAdministratorAccess",
      region: "us-east-1",
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
};

const loadConfigMock = mocked(loadSharedConfigFiles);

describe("listAwsConfig", () => {
  it("loads the local config", async () => {
    loadConfigMock.mockResolvedValueOnce(fixture);
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
    expect(results.data.length).toEqual(6);
    expect(results.type).toEqual("success");
    expect(results.data).toMatchSnapshot();
  });

  it("returns an error response when there is no config", async () => {
    loadConfigMock.mockResolvedValueOnce(null);

    const results = await listAwsConfig();

    expect(results.type).toEqual("error");
    expect(results.message).toEqual(
      "Failed to fetch local roles from INI files in ~/.aws/"
    );
  });
});
