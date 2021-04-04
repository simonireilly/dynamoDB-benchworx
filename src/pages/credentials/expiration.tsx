import React, { ReactElement, useContext, useEffect, useState } from "react";
import { ElectronStore } from "@src/contexts/electron-context";
import { Chip } from "@material-ui/core";

const calculateSecondsLeft = (date: Date): number => {
  if (date) return Math.abs(date.getTime() - new Date().getTime()) / 1000;
};

export const Expiration = (): ReactElement => {
  const { credentials } = useContext(ElectronStore);

  const [secondsLeft, setSecondsLeft] = useState<number>(
    calculateSecondsLeft(credentials.expiration)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setSecondsLeft(calculateSecondsLeft(credentials.expiration));
    }, 500);

    return clearTimeout(timer);
  });

  return credentials.expiration ? (
    <Chip
      label={`Session expiry: ${secondsLeft}`}
      color="secondary"
      variant="outlined"
    />
  ) : (
    <></>
  );
};
