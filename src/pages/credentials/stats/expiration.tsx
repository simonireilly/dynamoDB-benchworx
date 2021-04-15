import React, { ReactElement, useContext, useEffect, useState } from "react";
import { ElectronStore } from "@src/contexts/electron-context";
import { Chip } from "@material-ui/core";
import { AccessTime } from "@material-ui/icons";

const getSecondsFromDate = (expiration: Date): number => {
  const currentEpoch = Date.now();
  const expirationEpoch = expiration.valueOf();
  return Math.trunc((expirationEpoch - currentEpoch) / 1000);
};

export const Expiration = (): ReactElement => {
  const { credentials } = useContext(ElectronStore);
  const { expiration } = credentials;
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    expiration ? getSecondsFromDate(expiration) : 0
  );

  useEffect(() => {
    if (!credentials?.expiration) return;

    const countDownTimer = setTimeout(() => {
      const seconds = getSecondsFromDate(expiration);

      setRemainingSeconds(seconds);
    }, 50);

    return () => {
      clearTimeout(countDownTimer);
    };
  });

  if (!expiration) return <></>;

  if (remainingSeconds && remainingSeconds < 600)
    return (
      <Chip
        data-testid="expiration"
        size="small"
        color="primary"
        label={`Session expires in ${remainingSeconds} seconds`}
        icon={<AccessTime />}
      />
    );

  return <></>;
};
