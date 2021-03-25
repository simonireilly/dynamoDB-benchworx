import { Notification } from "../components/notification";
import React, { ReactElement } from "react";
import { ElectronContextProvider } from "../contexts/electron-context";

import {
  AppBar,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { WorkBench } from "./workbench";
import { Region } from "./credentials/forms/region";
import { Profile } from "./credentials/forms/profile";
import { useStyles } from "@src/styles";

export const App = (): ReactElement => {
  const classes = useStyles();
  return (
    <ElectronContextProvider>
      <>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography>DynamoWorx</Typography>
          </Toolbar>
        </AppBar>
        <Grid container spacing={5} className={classes.workbench}>
          <Grid item xs={3}>
            <Region />
            <Profile />
          </Grid>
          <Grid item xs={8}>
            <WorkBench />
          </Grid>
        </Grid>
        <Notification />
      </>
    </ElectronContextProvider>
  );
};
