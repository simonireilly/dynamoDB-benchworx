import { Notification } from "../components/notification";
import React, { ReactElement } from "react";
import { ElectronContextProvider } from "../contexts/electron-context";

import { Grid } from "@material-ui/core";
import { WorkBench } from "./workbench";
import { useStyles } from "@src/styles";
import { Header } from "./layout/header";

export const App = (): ReactElement => {
  const classes = useStyles();
  return (
    <ElectronContextProvider>
      <>
        <Header />
        <Grid container className={classes.workbench}>
          <Grid item xs={12}>
            <WorkBench />
          </Grid>
        </Grid>
        <Notification />
      </>
    </ElectronContextProvider>
  );
};
