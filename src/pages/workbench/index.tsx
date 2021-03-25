import { Grid, Paper, Typography } from "@material-ui/core";
import { ElectronStore } from "@src/contexts/electron-context";
import React, { ReactElement, useContext, useState, useEffect } from "react";
import { DataTable } from "@src/pages/workbench/data/data-table";
import { useStyles } from "@src/styles";
import { SelectTable } from "./settings/select-table";

type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

export const WorkBench = (): ReactElement => {
  const {
    aws: { listTables },
    credentials,
    setNotification,
  } = useContext(ElectronStore);

  const classes = useStyles();

  const [tables, setTables] = useState<
    Awaited<ReturnType<typeof listTables>>["data"]
  >();

  useEffect(() => {
    const init = async () => {
      const results = await listTables(
        credentials.profile,
        credentials.region,
        credentials.mfaCode
      );
      setNotification(results);
      setTables(results.data);
    };

    init();
  }, [credentials]);

  return (
    <Paper className={classes.workbench}>
      <Typography>Workbench</Typography>
      <Grid container>
        <Grid container>
          <Grid item xs={10}></Grid>
          <Grid item xs={2}>
            <SelectTable tables={tables?.TableNames || []} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <DataTable />
        </Grid>
      </Grid>
      <pre>{JSON.stringify(tables, null, 2)}</pre>
    </Paper>
  );
};
