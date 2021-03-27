import React, { ReactElement, useContext, useEffect, useState } from "react";
import { ElectronStore } from "@src/contexts/electron-context";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  NativeSelect,
} from "@material-ui/core";
import { useStyles } from "@src/styles/index";

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

  return (
    <div>
      <form noValidate autoComplete="off">
        <FormControl
          data-test="refresh-tables"
          variant="filled"
          className={classes.formControl}
          margin="dense"
        >
          <Button onClick={() => fetchTables()}>Refresh</Button>
        </FormControl>
        <FormControl
          data-test="select-region"
          variant="filled"
          className={classes.formControl}
          margin="dense"
        >
          <InputLabel htmlFor="aws-dynamo-select-table">table</InputLabel>
          <NativeSelect
            margin="dense"
            value={table?.Table?.TableName}
            onChange={async (e) => {
              const tableName = String(e.target.value);
              const results = await describeTable(
                credentials.profile,
                credentials.region,
                tableName
              );
              setNotification(results);
              if (results.type === "success") setTable(results.data);
            }}
            inputProps={{
              name: "Choose table",
              id: "aws-dynamo-select-table",
            }}
          >
            {tables.map((table) => (
              <option value={table} key={table}>
                {table}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
      </form>
    </div>
  );
};
