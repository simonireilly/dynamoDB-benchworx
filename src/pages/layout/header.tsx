import { AppBar, Toolbar, Typography } from "@material-ui/core";
import React, { ReactElement } from "react";
import { Profile } from "@src/pages/credentials/forms/profile";
import { Region } from "@src/pages/credentials/forms/region";
import { Expiration } from "@src/pages/credentials/expiration";

export const Header = (): ReactElement => (
  <AppBar position="static" color="default">
    <Toolbar variant="dense" disableGutters>
      &nbsp;
      <Region />
      <Profile />
      <Typography>DynamoWorx</Typography>
      <Expiration />
    </Toolbar>
  </AppBar>
);
