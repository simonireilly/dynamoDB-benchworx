import React, { ReactElement, useContext } from "react";
import { ElectronStore } from "@src/contexts/electron-context";
import { Chip } from "@material-ui/core";

export const Expiration = (): ReactElement => {
  const { credentials } = useContext(ElectronStore);

  return credentials?.expiration ? (
    <Chip
      data-testid="expiration"
      size="small"
      label={`Session: ${credentials.expiration.toUTCString()}`}
    />
  ) : (
    <></>
  );
};
