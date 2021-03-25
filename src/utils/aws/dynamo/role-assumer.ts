import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import { Credentials } from "@aws-sdk/types";
import { AssumeRoleParams } from "@aws-sdk/credential-provider-ini";

export const roleAssumer = async (
  sourceCredentials: Credentials,
  params: AssumeRoleParams
): Promise<Credentials> => {
  const client = new STSClient({
    region: "eu-west-2",
    credentials: sourceCredentials,
  });

  const command = new AssumeRoleCommand(params);
  const response = await client.send(command);

  return {
    ...response.Credentials,
    accessKeyId: response.Credentials.AccessKeyId,
    secretAccessKey: response.Credentials.SecretAccessKey,
    sessionToken: response.Credentials.SessionToken,
  };
};
