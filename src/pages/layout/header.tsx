import { AppBar, Toolbar, Typography } from "@material-ui/core";
import React, { ReactElement } from "react";
import { Profile } from "@src/pages/credentials/forms/profile";
import { Region } from "@src/pages/credentials/forms/region";
import { SelectTable } from "../workbench/settings/select-table";

export const Header = (): ReactElement => (
  <AppBar position="static" color="transparent">
    <Toolbar variant="dense">
      <Typography>DynamoWorx</Typography>
      <Region />
      <Profile />
      <SelectTable />
    </Toolbar>
  </AppBar>
);
