import React, { ReactElement } from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import { useStyles } from "@src/styles";

import { DataTable } from "@src/pages/workbench/data/data-table";
import { SelectTable } from "@src/pages/workbench/settings/select-table";

export const WorkBench = (): ReactElement => {
  const classes = useStyles();

  return (
    <Paper className={classes.workbench}>
      <Typography>Workbench</Typography>
      <Grid container>
        <Grid container>
          <Grid item xs={2}>
            <SelectTable />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <DataTable />
        </Grid>
      </Grid>
    </Paper>
  );
};
