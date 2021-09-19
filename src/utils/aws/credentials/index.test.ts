import { mocked } from "ts-jest/utils";
import { authenticator, fetchCredentials } from "./index";
import { defaultProvider } from "@aws-sdk/credential-provider-node";

jest.mock("@aws-sdk/credential-provider-node");
const mockDefaultProvider = mocked(defaultProvider);

const credentialFixture = { accessKeyId: "test", secretAccessKey: "secret" };

describe("fetchCredentials", () => {
  it("caches credentials for the session duration", async () => {
    mockDefaultProvider.mockReturnValue(() =>
      Promise.resolve(credentialFixture)
    );

    const result = await fetchCredentials("profile-name");
    await fetchCredentials("profile-name");

    expect(result).toEqual(credentialFixture);
    expect(mockDefaultProvider).toHaveBeenCalledTimes(1);
  });
});

describe("authenticator", () => {
  it("returns authenticated profiles", async () => {
    mockDefaultProvider.mockReturnValue(() =>
      Promise.resolve(credentialFixture)
    );

    const result = await authenticator({
      profile: "profile-name",
      mfaCode: "",
    });

    expect(result.type).toEqual("success");
    expect(result.message).toEqual(`Authenticated for profile-name`);
  });

  it("handles errors by passing back failure messages", async () => {
    mockDefaultProvider.mockReturnValue(() =>
      Promise.reject("Serious error!!")
    );

    const result = await authenticator({
      profile: "profile-name",
      mfaCode: "",
    });

    expect(result.type).toEqual("error");
    expect(result.message).toEqual(`Failed to authenticate for profile-name`);
  });
});
