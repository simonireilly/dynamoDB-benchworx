import React, {
  ReactElement,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { ElectronStore } from "@src/contexts/electron-context";

import { TextField, Grid, IconButton } from "@material-ui/core";
import { Refresh } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";

export const SelectTable = (): ReactElement => {
  const {
    setNotification,
    table,
    setTable,
    aws: { listTables, describeTable },
    credentials,
  } = useContext(ElectronStore);

  const [tables, setTables] = useState<
    Awaited<ReturnType<typeof listTables>>["data"]["TableNames"]
  >([]);

  const fetchTables = async () => {
    const results = await listTables(credentials.profile, credentials.region);
    setNotification(results);
    if (results.type === "success") setTables(results.data.TableNames);
  };

  useEffect(() => {
    fetchTables();
  }, [credentials.region, credentials.profile]);

  const handleTableSelect = async (
    e: SyntheticEvent,
    newInputValue: string
  ) => {
    if (newInputValue === null) {
      setTable(null);
      setNotification({
        type: "info",
        message: "Cleared tables",
        data: null,
        details: null,
      });
    }

    const results = await describeTable(
      credentials.profile,
      credentials.region,
      newInputValue
    );
    setNotification(results);
    if (results.type === "success") setTable(results.data);
  };

  return (
    <Grid container direction="row" alignContent="center">
      <Grid item xs={10}>
        <Autocomplete
          id="autocomplete-table"
          size="small"
          options={tables}
          value={table?.Table?.TableName}
          onChange={handleTableSelect}
          autoComplete
          autoHighlight
          autoSelect
          renderInput={(params) => (
            <TextField
              {...params}
              label="Table"
              variant="outlined"
              margin="dense"
            />
          )}
        />
      </Grid>
      <Grid item xs={2}>
        <IconButton color="primary" onClick={() => fetchTables()}>
          <Refresh />
        </IconButton>
      </Grid>
    </Grid>
  );
};
