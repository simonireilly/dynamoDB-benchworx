import { ScanCommandInput } from "@aws-sdk/client-dynamodb";
import {
  Box,
  FormControl,
  InputLabel,
  NativeSelect,
  TextField,
  Button,
} from "@material-ui/core";
import { IndexDescription } from "@src/components/index-description";
import { ElectronStore } from "@src/contexts/electron-context";
import { useStyles } from "@src/styles";
import React, {
  ReactElement,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from "react";

export const Scan = (): ReactElement => {
  const {
    table,
    credentials,
    setNotification,
    setItems,
    aws: { scan },
  } = useContext(ElectronStore);
  const classes = useStyles();
  const [indexName, setIndexName] = useState<string>("primary");
  const [limit, setLimit] = useState<number>(100);

  useEffect(() => {
    setIndexName("primary");
  }, [table?.Table?.TableName]);

  const handleTableSelection = (
    e: React.ChangeEvent<{
      name?: string;
      value: unknown;
    }>
  ) => {
    setIndexName(String(e.target.value));
  };

  const getResults = async (e: SyntheticEvent) => {
    e.preventDefault();
    const options: ScanCommandInput = {
      TableName: table?.Table?.TableName,
    };

    if (indexName !== "primary") options.IndexName = indexName;
    if (limit) options.Limit = limit;

    const results = await scan(
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
            onChange={handleTableSelection}
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
