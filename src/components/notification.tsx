import { ElectronStore } from "@src/contexts/electron-context";
import { Divider, Snackbar } from "@material-ui/core";
import { Alert, Color } from "@material-ui/lab";
import React, { ReactElement, useContext } from "react";

export const Notification = (): ReactElement => {
  const { notification } = useContext(ElectronStore);

  if (!notification) return <></>;
  return (
    <Snackbar open={!!notification} autoHideDuration={3000}>
      <Alert severity={(notification.type as Color) || "info"}>
        {notification.message}
        <Divider variant="fullWidth" />
        {notification.details}
      </Alert>
    </Snackbar>
  );
};
