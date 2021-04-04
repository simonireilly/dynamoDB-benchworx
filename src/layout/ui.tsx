import React, { ReactElement } from "react";
import { Box, Grid } from "@material-ui/core";
import { Header } from "@src/layout/header";
import { Sidebar } from "@src/layout/sidebar";
import { Main } from "@src/layout/main";
import { Notification } from "@src/components/notification";

export const UI = (): ReactElement => {
  return (
    <>
      <Header />
      <Box m={1} p={1}>
        <Grid container spacing={1}>
          <Grid item xs={4} md={3} lg={2}>
            <Sidebar />
          </Grid>
          <Grid item xs={8} md={9} lg={10}>
            <Main />
          </Grid>
        </Grid>
      </Box>
      <Notification />
    </>
  );
};
