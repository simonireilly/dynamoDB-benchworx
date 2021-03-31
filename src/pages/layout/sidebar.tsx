import { Grid, Paper } from "@material-ui/core";
import React, { ReactElement } from "react";
import { SelectTable } from "../workbench/settings/select-table";
import { TableDescription } from "../workbench/settings/table-description";

export const Sidebar = (): ReactElement => {
  return (
    <Grid container style={{ height: "100%" }}>
      <Grid item xs={12} style={{ height: "50%" }}>
        <Paper>
          <SelectTable />
          <TableDescription />
        </Paper>
      </Grid>
      <Grid item xs={12} style={{ height: "50%" }}>
        <Paper>2</Paper>
      </Grid>
    </Grid>
  );
};
