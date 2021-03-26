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
}: Props): Promise<PreloaderResponse<void>> => {
  const credentials = fromIni({
    profile,
    roleAssumer,
    mfaCodeProvider: (mfaSerial: string): Promise<string> => {
      return new Promise((resolve) => resolve(mfaCode));
    },
  });

  try {
    inMemoryCache[profile] = await credentials();

    return {
      type: "success",
      message: `Authenticated for ${profile}`,
      details: null,
      data: null,
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

export const fetchCredentials = (profile: string): Credentials => {
  return inMemoryCache[profile];
};
