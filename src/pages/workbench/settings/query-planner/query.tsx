import {
  GlobalSecondaryIndexDescription,
  KeySchemaElement,
  LocalSecondaryIndexDescription,
} from "@aws-sdk/client-dynamodb";
import { QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import {
  Box,
  FormControl,
  InputLabel,
  NativeSelect,
  TextField,
  Button,
} from "@material-ui/core";
import { ElectronStore } from "@src/contexts/electron-context";
import { useStyles } from "@src/styles";
import React, {
  ReactElement,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from "react";

type MergedIndexes = (
  | LocalSecondaryIndexDescription
  | GlobalSecondaryIndexDescription
)[];

const sortKeyConditions = {
  equal: (val: string): string => `= ${val}`,
  lessThan: (val: string): string => `< ${val}`,
  lessThanOrEqualTo: (val: string): string => `<= ${val}`,
  greaterThan: (val: string): string => `> ${val}`,
  greaterThanOrEqualTo: (val: string): string => `>= ${val}`,
  between: (
    val: string,
    { lower, upper }: { lower: string; upper: string }
  ): string => `BETWEEN ${lower} AND ${upper}`,
  begins_with: (sortKeyName: string, val: string): string =>
    `begins_with(${sortKeyName}, ${val})`,
};

export const Query = (): ReactElement => {
  const {
    table,
    credentials,
    setNotification,
    setItems,
    aws: { query },
  } = useContext(ElectronStore);
  const classes = useStyles();
  const [indexName, setIndexName] = useState<string>("primary");
  const [allIndexes, setAllIndexes] = useState<MergedIndexes>([]);
  const [limit, setLimit] = useState<number>(100);
  const [pk, setPk] = useState<string>("");
  const [sk, setSk] = useState<string>("");
  const [hashKey, setHashKey] = useState<string>("");
  const [sortKey, setSortKey] = useState<string>("");

  const getKeySchema = (keySchema: KeySchemaElement[]) => {
    if (!keySchema || !keySchema.length) return;

    setHashKey(keySchema.find((el) => el.KeyType === "HASH")?.AttributeName);
    setSortKey(keySchema.find((el) => el.KeyType === "RANGE")?.AttributeName);
  };

  useEffect(() => {
    setIndexName("primary");
    getKeySchema(table?.Table?.KeySchema);

    const indexes: MergedIndexes = [];

    table?.Table?.LocalSecondaryIndexes &&
      indexes.push(...table.Table.LocalSecondaryIndexes);
    table?.Table?.GlobalSecondaryIndexes &&
      indexes.push(...table.Table.GlobalSecondaryIndexes);

    setAllIndexes(indexes);
  }, [table?.Table?.TableName]);

  const handleIndexSelection = (
    e: React.ChangeEvent<{
      name?: string;
      value: unknown;
    }>
  ) => {
    const indexValue = String(e.target.value);
    setIndexName(indexValue);

    let keySchema = table.Table.KeySchema;

    if (indexValue !== "primary") {
      keySchema =
        allIndexes.length &&
        allIndexes.find((i) => i.IndexName === indexValue).KeySchema;
    }

    getKeySchema(keySchema);
  };

  const getResults = async (e: SyntheticEvent) => {
    e.preventDefault();
    const options: QueryCommandInput = {
      TableName: table?.Table?.TableName,
      KeyConditionExpression: `#pk = :pk and ${sortKeyConditions.begins_with(
        "#sk",
        ":sk"
      )}`,
      ExpressionAttributeNames: {
        "#pk": hashKey,
        "#sk": sortKey,
      },
      ExpressionAttributeValues: {
        ":pk": pk,
        ":sk": sk,
      },
    };

    if (indexName !== "primary") options.IndexName = indexName;
    if (limit) options.Limit = limit;

    const results = await query(
      credentials.profile,
      credentials.region,
      options
    );
    setNotification(results);
    if (results.type === "success") setItems(results.data.Items);
  };

  return (
    <form onSubmit={getResults}>
      <Box display="flex" alignItems="flex-start" flexDirection="column">
        <FormControl
          data-test="select-profile"
          variant="outlined"
          className={classes.formControl}
          margin="dense"
        >
          <InputLabel htmlFor="select" shrink>
            Table or Index
          </InputLabel>
          <NativeSelect
            id="select"
            margin="dense"
            variant="outlined"
            value={indexName}
            onChange={handleIndexSelection}
          >
            {table && <option value="primary">{table.Table.TableName}</option>}
            {table && table.Table.LocalSecondaryIndexes && (
              <optgroup label="Local Secondary Indexes">
                {table.Table.LocalSecondaryIndexes.map((lsi) => (
                  <option value={lsi.IndexName} key={lsi.IndexName}>
                    {lsi.IndexName}
                  </option>
                ))}
              </optgroup>
            )}
            {table && table.Table.GlobalSecondaryIndexes && (
              <optgroup label="Global Secondary Indexes">
                {table.Table.GlobalSecondaryIndexes.map((gsi) => (
                  <option value={gsi.IndexName} key={gsi.IndexName}>
                    {gsi.IndexName}
                  </option>
                ))}
              </optgroup>
            )}
          </NativeSelect>
        </FormControl>
        <FormControl
          data-test="enter-pk"
          variant="outlined"
          className={classes.formControl}
          margin="dense"
        >
          <TextField
            id="text-pk"
            label={`Primary Key (${hashKey})`}
            disabled={!hashKey}
            variant="outlined"
            margin="dense"
            value={pk}
            onChange={(e) => setPk(e.target.value)}
          />
        </FormControl>
        <FormControl
          data-test="enter-sk"
          variant="outlined"
          className={classes.formControl}
          margin="dense"
        >
          <TextField
            id="text-sk"
            label={`Sort Key (${sortKey})`}
            disabled={!sortKey}
            variant="outlined"
            margin="dense"
            value={sk}
            onChange={(e) => setSk(e.target.value)}
          />
        </FormControl>
        <FormControl
          data-test="number-limit"
          variant="outlined"
          className={classes.formControl}
          margin="dense"
        >
          <TextField
            id="number-limit"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            InputLabelProps={{ shrink: true }}
            InputProps={{ inputProps: { min: 0, max: 100 } }}
            inputMode="numeric"
            type="number"
            label="Item Limit"
            variant="outlined"
            margin="dense"
          />
        </FormControl>
        <FormControl
          data-test="button-execute"
          variant="outlined"
          className={classes.formControl}
          margin="dense"
        >
          <Button variant="contained" color="primary" type="submit">
            Execute
          </Button>
        </FormControl>
      </Box>
    </form>
  );
};
