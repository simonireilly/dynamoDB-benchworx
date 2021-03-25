import React, { ReactElement, useContext } from "react";
import { ElectronStore } from "@src/contexts/electron-context";

import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { useStyles } from "@src/styles/index";

export const SelectTable = ({ tables }: { tables: string[] }): ReactElement => {
  const { setNotification, table, setTable } = useContext(ElectronStore);
  const classes = useStyles();

  return (
    <div>
      <form noValidate autoComplete="off">
        <FormControl
          data-test="select-region"
          variant="filled"
          className={classes.formControl}
          margin="dense"
        >
          <InputLabel htmlFor="aws-dynamo-select-table">
            Choose table
          </InputLabel>
          <Select
            margin="dense"
            value={table}
            onChange={async (e) => {
              const table = String(e.target.value);
              setTable(table);
              setNotification({
                type: "success",
                message: `Selected table changed to ${table}`,
                details: null,
                data: null,
              });
            }}
            inputProps={{
              name: "Choose table",
              id: "aws-dynamo-select-table",
            }}
            autoWidth
          >
            {tables.map((table) => (
              <MenuItem value={table} key={table}>
                {table}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </form>
    </div>
  );
};
