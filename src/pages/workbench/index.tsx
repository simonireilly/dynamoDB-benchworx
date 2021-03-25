import { Typography } from "@material-ui/core";
import { ElectronStore } from "@src/contexts/electron-context";
import React, { ReactElement, useContext, useState, useEffect } from "react";

import { Region } from "@src/pages/credentials/forms/region";

type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

export const WorkBench = (): ReactElement => {
  const {
    aws: { listTables },
    credentials,
    setNotification,
  } = useContext(ElectronStore);

  const [tables, setTables] = useState<
    Awaited<ReturnType<typeof listTables>>["data"]
  >();

  useEffect(() => {
    const init = async () => {
      const results = await listTables(
        credentials.profile,
        credentials.region,
        credentials.mfaCode
      );
      setNotification(results);
      setTables(results.data);
    };

    init();
  }, [credentials]);

  return (
    <>
      <Typography>
        <h1>Workbench</h1>
      </Typography>
      <Region />
      <pre>{JSON.stringify(tables, null, 2)}</pre>
    </>
  );
};
