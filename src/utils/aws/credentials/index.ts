import { fromIni } from "@aws-sdk/credential-provider-ini";

import { roleAssumer } from "@src/utils/aws/credentials/role-assumer";
import { Credentials } from "@aws-sdk/types";
import { PreloaderResponse } from "@src/preload";

type Props = {
  profile: string;
  mfaCode: string;
};

const inMemoryCache: {
  [key: string]: Credentials;
} = {};

export const authenticator = async ({
  profile,
  mfaCode,
}: Props): Promise<PreloaderResponse<{ expiration?: Date }>> => {
  let result;

  const credentials = fromIni({
    profile,
    roleAssumer,
    mfaCodeProvider: (mfaSerial: string): Promise<string> => {
      return new Promise((resolve) => resolve(mfaCode));
    },
  });

  try {
    result = await credentials();
    inMemoryCache[profile] = result;

    console.info({ result });

    return {
      type: "success",
      message: `Authenticated for ${profile}`,
      details: null,
      data: {
        expiration: result.Expiration,
      },
    };
  } catch (e) {
    return {
      type: "error",
      message: `Failed to authenticate for ${profile}`,
      details: e.message,
      data: null,
    };
  }
};

export const fetchCredentials = async (
  profile: string
): Promise<Credentials> => {
  if (!inMemoryCache[profile]) {
    await authenticator({ profile, mfaCode: "" });
  }
  return inMemoryCache[profile];
};
