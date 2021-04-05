import { mocked } from "ts-jest/utils";
import { authenticator, fetchCredentials } from "./index";
import { fromIni } from "@aws-sdk/credential-provider-ini";

jest.mock("@aws-sdk/credential-provider-ini");
const mockFromIni = mocked(fromIni);

const credentialFixture = { accessKeyId: "test", secretAccessKey: "secret" };

describe("fetchCredentials", () => {
  it("caches credentials for the session duration", async () => {
    mockFromIni.mockReturnValue(() => Promise.resolve(credentialFixture));

    const result = await fetchCredentials("profile-name");
    await fetchCredentials("profile-name");

    expect(result).toEqual(credentialFixture);
    expect(mockFromIni).toHaveBeenCalledTimes(1);
  });
});

describe("authenticator", () => {
  it("returns authenticated profiles", async () => {
    mockFromIni.mockReturnValue(() => Promise.resolve(credentialFixture));

    const result = await authenticator({
      profile: "profile-name",
      mfaCode: "",
    });

    expect(result.type).toEqual("success");
    expect(result.message).toEqual(`Authenticated for profile-name`);
  });

  it("handles errors by passing back failure messages", async () => {
    mockFromIni.mockReturnValue(() => Promise.reject("Serious error!!"));

    const result = await authenticator({
      profile: "profile-name",
      mfaCode: "",
    });

    expect(result.type).toEqual("error");
    expect(result.message).toEqual(`Failed to authenticate for profile-name`);
  });
});
