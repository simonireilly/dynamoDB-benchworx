import { AppBar, Box, Button, Chip } from "@material-ui/core";
import React, { ReactElement, useContext } from "react";
import { Profile } from "@src/pages/credentials/forms/profile";
import { Region } from "@src/pages/credentials/forms/region";
import { ElectronStore } from "@src/contexts/electron-context";
import { SelectTable } from "@src/pages/workbench/settings/select-table";
import { Expiration } from "@src/pages/credentials/stats/expiration";

export const Header = (): ReactElement => {
  const { credentials, clearCredentials } = useContext(ElectronStore);

  return (
    <AppBar position="static" color="default">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={1}
      >
        <Box width="400px">
          <SelectTable />
        </Box>
        <Box display="flex" alignItems="center">
          <Expiration />
          <Region />
          <Profile />
          <Button
            color="primary"
            variant="contained"
            onClick={() => clearCredentials()}
          >
            Clear Credentials
          </Button>
        </Box>
      </Box>
    </AppBar>
  );
};
