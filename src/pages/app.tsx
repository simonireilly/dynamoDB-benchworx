import { Notification } from "../components/notification";
import React, { ReactElement } from "react";
import { ElectronContextProvider } from "../contexts/electron-context";

import { Steps } from "./credentials/steps";
import { Grid } from "@material-ui/core";
import { WorkBench } from "./workbench";

export const App = (): ReactElement => {
  return (
    <ElectronContextProvider>
      <>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Steps />
          </Grid>
          <Grid item xs={9}>
            <WorkBench />
          </Grid>
        </Grid>
        <Notification />
      </>
    </ElectronContextProvider>
  );
};
