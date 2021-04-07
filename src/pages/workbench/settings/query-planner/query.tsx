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
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import { ElectronStore } from "@src/contexts/electron-context";
import { useStyles } from "@src/styles";
import {
  primaryKeyCondition,
  sortKeyCondition,
  sortKeyConditions,
  PartialKeyExpression,
} from "@src/utils/aws/dynamo/builders";
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
  const [scanIndexForward, setScanIndexForward] = useState<boolean>(true);
  const [pk, setPk] = useState<string>("");
  const [sk, setSk] = useState<string | { lower: string; upper: string }>("");
  const [hashKey, setHashKey] = useState<string>("");
  const [sortKey, setSortKey] = useState<string>("");
  const [queryString, setQueryString] = useState<string>("");
  const [skCondition, setSkCondition] = useState<
    keyof typeof sortKeyConditions
  >("=");

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
    };

    const pkAttrs =
      pk &&
      primaryKeyCondition({
        primaryKeyName: hashKey,
        primaryKeyValue: pk,
      });

    const skAttrs =
      sk &&
      sortKeyCondition({
        sortKeyName: sortKey,
        sortKeyValue: sk,
        condition: skCondition,
      });

    const attrs: PartialKeyExpression = {
      KeyConditionExpression: [
        pkAttrs.KeyConditionExpression,
        skAttrs.KeyConditionExpression,
      ]
        .filter(Boolean)
        .join(" and "),
      ExpressionAttributeNames: {
        ...pkAttrs.ExpressionAttributeNames,
        ...skAttrs.ExpressionAttributeNames,
      },
      ExpressionAttributeValues: {
        ...pkAttrs.ExpressionAttributeValues,
        ...skAttrs.ExpressionAttributeValues,
      },
    };

    if (indexName !== "primary") options.IndexName = indexName;
    if (limit) options.Limit = limit;

    setQueryString(
      JSON.stringify(
        {
          ...options,
          ...attrs,
        },
        null,
        2
      )
    );

    const results = await query(credentials.profile, credentials.region, {
      ...options,
      ...attrs,
    });
    setNotification(results);
    if (results.type === "success") setItems(results.data.Items);
  };

  const handleKeyConditionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const currentCondition = String(e.target.value);
    setSkCondition(currentCondition as keyof typeof sortKeyConditions);
    currentCondition === "between"
      ? setSk({ lower: "", upper: "" })
      : setSk("");
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
          <Box display="flex">
            <NativeSelect
              variant="outlined"
              value={skCondition}
              onChange={handleKeyConditionChange}
            >
              {Object.keys(sortKeyConditions).map((key) => (
                <option value={key} key={key}>
                  {key}
                </option>
              ))}
            </NativeSelect>
            {typeof sk === "object" ? (
              <>
                <TextField
                  id="text-sk-lower"
                  label={`Lower (${sortKey})`}
                  disabled={!sortKey}
                  variant="outlined"
                  margin="dense"
                  value={typeof sk === "object" ? sk.lower : ""}
                  onChange={(e) =>
                    setSk((current) => {
                      if (typeof current === "object")
                        return { ...current, lower: e.target.value };
                      return {
                        lower: e.target.value,
                        upper: "",
                      };
                    })
                  }
                />
                <TextField
                  id="text-sk-upper"
                  label={`Upper (${sortKey})`}
                  disabled={!sortKey}
                  variant="outlined"
                  margin="dense"
                  value={typeof sk === "object" ? sk.upper : ""}
                  onChange={(e) =>
                    setSk((current) => {
                      if (typeof current === "object")
                        return { ...current, upper: e.target.value };
                      return {
                        upper: e.target.value,
                        lower: "",
                      };
                    })
                  }
                />
              </>
            ) : (
              <TextField
                id="text-sk"
                label={`Sort Key (${sortKey})`}
                disabled={!sortKey}
                variant="outlined"
                margin="dense"
                value={sk}
                onChange={(e) => setSk(e.target.value)}
              />
            )}
          </Box>
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
          data-test="switch-scan"
          variant="outlined"
          className={classes.formControl}
          margin="dense"
        >
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={scanIndexForward}
                onChange={() => setScanIndexForward((c) => !c)}
                name="checkedB"
                color="primary"
              />
            }
            label={`Scan Index Forward (ascending order)`}
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
        <code>
          <pre>{queryString}</pre>
        </code>
      </Box>
    </form>
  );
};
