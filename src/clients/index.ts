import {DynamoDBClient, ListTablesCommand, ListTablesCommandOutput} from '@aws-sdk/client-dynamodb'
import {credentials} from './credentials'

export const listTables = async (): Promise<ListTablesCommandOutput>  => {
  const client = new DynamoDBClient({region: 'eu-west-1'})
  const command = new ListTablesCommand({})

  const results = await client.send(command)

  return results
}
