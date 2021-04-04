import React, {
  ReactElement,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { ElectronStore } from "@src/contexts/electron-context";

import { TextField, IconButton, Box } from "@material-ui/core";
import { Refresh } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { classnames } from "@material-ui/data-grid";
import { useStyles } from "@src/styles";

export const SelectTable = (): ReactElement => {
  const {
    setNotification,
    table,
    setTable,
    aws: { listTables, describeTable },
    credentials,
  } = useContext(ElectronStore);
  const classes = useStyles();

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
    <Box display="flex" alignItems="center">
      <Autocomplete
        id="autocomplete-table"
        className={classes.formControl}
        size="small"
        fullWidth
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

      <IconButton color="primary" onClick={() => fetchTables()}>
        <Refresh />
      </IconButton>
    </Box>
  );
};
