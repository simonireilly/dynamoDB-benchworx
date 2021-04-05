import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import { Credentials } from "@aws-sdk/types";
import { AssumeRoleParams } from "@aws-sdk/credential-provider-ini";

// Assume a role using the source credentials provided
export const roleAssumer = async (
  sourceCredentials: Credentials,
  params: AssumeRoleParams
): Promise<Credentials> => {
  const client = new STSClient({
    region: "us-east-1",
    credentials: sourceCredentials,
  });

  const command = new AssumeRoleCommand(params);
  const response = await client.send(command);

  return {
    expiration: response.Credentials.Expiration,
    accessKeyId: response.Credentials.AccessKeyId,
    secretAccessKey: response.Credentials.SecretAccessKey,
    sessionToken: response.Credentials.SessionToken,
  };
};
