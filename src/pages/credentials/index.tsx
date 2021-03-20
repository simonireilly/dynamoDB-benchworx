import React, { ReactElement, useContext, useEffect, useState } from "react";
import { ElectronStore } from "../contexts/electron-context";

export const Credentials = (): ReactElement => {
  const { aws } = useContext(ElectronStore);

  const [credentials, setCredentials] = useState({});

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const configuration = await aws.listCredentials();
        setCredentials(configuration);
      } catch (e) {
        console.error(e);
      }
    };

    fetchCredentials();
  }, []);

  return (
    <pre>
      <h1>AWS Credentials available for configuration</h1>
      <pre>{JSON.stringify(credentials, null, 2)}</pre>
    </pre>
  );
};
