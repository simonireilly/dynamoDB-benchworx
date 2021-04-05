// Get Credentials from the local INI files and organize into types for sign in
// which are safe for persistance and use inside the DOM

import { PreloaderResponse } from "@src/preload";
import {
  loadSharedConfigFiles,
  Profile,
  SharedConfigFiles,
} from "@aws-sdk/shared-ini-file-loader";

export type SafeProfile = {
  profile: string;
  mfa: boolean;
  assumeRole: boolean;
  region: string;
  endpoint?: string;
};

export const listAwsConfig = async (): Promise<
  PreloaderResponse<SafeProfile[]>
> => {
  const config = await loadSharedConfigFiles();

  if (config) {
    const data = Object.entries(mergeCredentialsAndConfig(config)).map(
      safeConfigConstructor
    );

    console.info(data);

    return {
      type: "success",
      data,
      message: "Fetched local roles from INI files in ~/.aws",
      details: `Configurations found: ${data.length}`,
    };
  } else {
    return {
      type: "error",
      data: null,
      message: "Failed to fetch local roles from INI files in ~/.aws/",
      details: "",
    };
  }
};

const mergeCredentialsAndConfig = (config: SharedConfigFiles) => {
  const profiles: { [key: string]: Profile } = {};

  const credentialProfiles = Object.entries(config.credentialsFile).reduce(
    (acc, [key, values]) => {
      acc[key] = {
        ...values,
        ...config.configFile[key],
      };

      return acc;
    },
    profiles
  );

  const completeProfiles = Object.entries(config.configFile).reduce(
    (acc, [key, values]) => {
      acc[key] = {
        ...acc[key],
        ...values,
      };

      return acc;
    },
    credentialProfiles
  );

  return completeProfiles;
};

const safeConfigConstructor = (entry: [string, Profile]): SafeProfile => {
  const [profile, data = {}] = entry;
  const { aws_access_key_id, aws_secret_access_key, ...safeData } = data;

  const currentProfile: SafeProfile = {
    profile,
    mfa: Boolean(safeData.mfa_serial),
    assumeRole: Boolean(safeData.role_arn),
    region: safeData.region,
  };

  if (safeData.endpoint) currentProfile.endpoint = safeData.endpoint;

  return currentProfile;
};
