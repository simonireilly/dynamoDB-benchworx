import React, { ReactElement } from "react";
import { Box } from "@material-ui/core";
import { Header } from "@src/layout/header";
import { Main } from "@src/layout/main";
import { Notification } from "@src/components/notification";

export const UI = (): ReactElement => {
  return (
    <>
      <Header />
      <Box m={1} p={1}>
        <Main />
      </Box>
      <Notification />
    </>
  );
};
