import React, {
  ReactElement,
  SyntheticEvent,
  useContext,
  useState,
} from "react";
import {
  Button,
  InputLabel,
  NativeSelect,
  TextField,
  FormControl,
  Box,
} from "@material-ui/core";
import { ElectronStore } from "@src/contexts/electron-context";
import { useStyles } from "@src/styles";
import type { ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

export const QueryPlanner = (): ReactElement => {
  const {
    table,
    credentials,
    setNotification,
    setItems,
    aws: { scan },
  } = useContext(ElectronStore);
  const classes = useStyles();
  const [operation, setOperation] = React.useState<string | null>("scan");

  const handleOperation = (
    event: React.MouseEvent<HTMLElement>,
    newOperation: string | null
  ) => {
    setOperation(newOperation);
  };
  const [indexName, setIndexName] = useState<string>();
  const [limit, setLimit] = useState<number>(100);

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

    if (indexName) options.IndexName = indexName;
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
      <Box display="flex" alignItems="flex-start" flexDirection="column" p={1}>
        <FormControl
          data-test="toggle-operation"
          variant="outlined"
          className={classes.formControl}
          margin="dense"
        >
          <ToggleButtonGroup
            size="small"
            value={operation}
            exclusive
            onChange={handleOperation}
            aria-label="dynamodb operation"
          >
            <ToggleButton value="scan" aria-label="scan dynamodb">
              Scan
            </ToggleButton>
            <ToggleButton value="query" aria-label="query dynamodb">
              Query
            </ToggleButton>
          </ToggleButtonGroup>
        </FormControl>
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
            {table && <option value={null}>{table.Table.TableName}</option>}
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
            label="(Primary Key)"
            variant="outlined"
            margin="dense"
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
            label="(Sort Key)"
            variant="outlined"
            margin="dense"
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
