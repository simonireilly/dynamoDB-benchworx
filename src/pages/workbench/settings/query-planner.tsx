import React, { ReactElement, useContext, useState } from "react";
import {
  ButtonGroup,
  Button,
  InputLabel,
  NativeSelect,
  TextField,
  FormControl,
  Box,
} from "@material-ui/core";
import { ElectronStore } from "@src/contexts/electron-context";
import { useStyles } from "@src/styles";

export const QueryPlanner = (): ReactElement => {
  const {
    table,
    credentials,
    setNotification,
    aws: { scan },
  } = useContext(ElectronStore);
  const classes = useStyles();
  const [indexName, setIndexName] = useState<string>();

  const handleTableSelection = (
    e: React.ChangeEvent<{
      name?: string;
      value: unknown;
    }>
  ) => {
    console.info({ target: e.currentTarget.value });
    setIndexName(String(e.target.value));
  };

  // TODO: Figure out, how to set the rows in the table, based on these scans
  // 1. Set an items collection on the context
  //   - We also need the key schema, the PK, SK and may need other data
  // 2. Prop drill
  //   - Pass everything into the table from the query planner
  const getResults = async () => {
    const results = await scan(credentials.profile, credentials.region, {
      TableName: table?.Table?.TableName,
      IndexName: indexName,
    });
    setNotification(results);
  };

  return (
    <Box display="flex" alignItems="flex-start" flexDirection="column" p={1}>
      <ButtonGroup
        variant="text"
        color="primary"
        aria-label="text primary button group"
      >
        <Button>Query</Button>
        <Button>Scan</Button>
      </ButtonGroup>
      <FormControl
        data-test="select-profile"
        variant="outlined"
        className={classes.formControl}
        margin="dense"
      >
        <InputLabel htmlFor="select">Table or Index</InputLabel>
        <NativeSelect
          id="select"
          margin="dense"
          variant="outlined"
          value={indexName}
          onChange={handleTableSelection}
        >
          {table && (
            <option value={table.Table.TableName}>
              {table.Table.TableName}
            </option>
          )}
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
      <Button variant="contained" color="primary" onClick={() => getResults()}>
        Execute
      </Button>
    </Box>
  );
};
