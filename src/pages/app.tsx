import { Notification } from "../components/notification";
import React, { ReactElement } from "react";
import { ElectronContextProvider } from "../contexts/electron-context";

import { Grid } from "@material-ui/core";
import { WorkBench } from "./workbench";
import { useStyles } from "@src/styles";
import { Header } from "@src/pages/layout/header";
import { Sidebar } from "@src/pages/layout/sidebar";

export const App = (): ReactElement => {
  const classes = useStyles();
  return (
    <ElectronContextProvider>
      <>
        <Header />
        <Grid container className={classes.workbench} spacing={1}>
          <Grid item md={3}>
            {/* Replace with a fat drawer that can be hidden when not used */}
            <Sidebar />
          </Grid>
          <Grid item md={9}>
            <WorkBench />
          </Grid>
        </Grid>
        <Notification />
      </>
    </ElectronContextProvider>
  );
};
