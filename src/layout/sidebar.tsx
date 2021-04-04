import { Box, Grid, Paper } from "@material-ui/core";
import React, { ReactElement } from "react";
import { SelectTable } from "@src/pages/workbench/settings/select-table";
import { TableDescription } from "@src/pages/workbench/settings/table-description";
import { useStyles } from "@src/styles";
import { ItemViewer } from "@src/pages/workbench/data/item-viewier";

export const Sidebar = (): ReactElement => {
  const classes = useStyles();

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item xs={12}>
        <Paper className={classes.section}>
          <SelectTable />
          <Box className={classes.tableDescription}>
            <TableDescription />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};
