// Context will need to hold the active profile, aws actions permitted in the DOM
//
// Wrap entire application and access the current authenticated user for this context
//

import React, {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useState,
} from "react";

interface Props {
  children: ReactElement;
}

export type Credentials = {
  awsAccountId: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsRoleArn?: string;
  sessionToken?: string;
};

export type ElectronContext = {
  aws: Window["aws"];
  credentials?: Credentials;
  setCredentials?: Dispatch<SetStateAction<Credentials>>;
};

export const ElectronStore = createContext<ElectronContext>({
  aws: window.aws,
});

export const ElectronContextProvider = (props: Props): ReactElement => {
  const [credentials, setCredentials] = useState({
    profile: "",
    awsAccountId: "",
    awsAccessKeyId: "",
    awsSecretAccessKey: "",
    awsRoleArn: "",
    sessionToken: "",
  });

  return (
    <ElectronStore.Provider
      value={{
        aws: window.aws,
        credentials,
        setCredentials,
      }}
    >
      {props.children}
    </ElectronStore.Provider>
  );
};
