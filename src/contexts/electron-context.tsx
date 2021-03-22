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
  // TODO: Set credentials must assign AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
  // when those values are passed in, and also, remove them from the env when those
  // values are unset
  const [credentials, setCredentials] = useState<Credentials>(blankCredentials);
  const emptyCredentials = { ...blankCredentials };
  const clearCredentials = () => setCredentials(emptyCredentials);

  // Handles assuming credentials in order of:
  //
  // 1. From process.env
  // 2. From shared INI
  // 3. EC2 instance profile
  //
  // We should ensure the order is:
  //
  // 1. ENV if set in the process
  // 2. Profile if set
  // 3. TODO: SSO once it can be supported
  const configureProvider = (credentials: Credentials) => {
    window.aws.defaultProvider({ profile: credentials.profile });
  };

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
