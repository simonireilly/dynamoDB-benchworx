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
  profile: string;
  userId: string;
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
  clearCredentials?: () => void;
};

export const ElectronStore = createContext<ElectronContext>({
  aws: window.aws,
});

export const blankCredentials = {
  profile: "",
  userId: "",
  awsAccountId: "",
  awsAccessKeyId: "",
  awsSecretAccessKey: "",
  awsRoleArn: "",
  sessionToken: "",
};

export const ElectronContextProvider = (props: Props): ReactElement => {
  const [credentials, setCredentials] = useState<Credentials>(blankCredentials);
  const emptyCredentials = { ...blankCredentials };
  const clearCredentials = () => setCredentials(emptyCredentials);

  return (
    <ElectronStore.Provider
      value={{
        aws: window.aws,
        credentials,
        setCredentials,
        clearCredentials,
      }}
    >
      {props.children}
    </ElectronStore.Provider>
  );
};
