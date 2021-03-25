// Context will need to hold the active profile, aws actions permitted in the DOM
//
// Wrap entire application and access the current authenticated user for this context
//

import { PreloaderResponse } from "@src/preload";
import React, {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useState,
} from "react";

interface Props {
  children: ReactElement;
  aws?: Window["aws"];
  value?: ElectronContext;
}

export type Credentials = {
  profile: string;
  userId: string;
  awsAccountId: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsRoleArn?: string;
  sessionToken?: string;
  mfaCode?: string;
};

export type ElectronContext = {
  aws: Window["aws"];
  credentials?: Credentials;
  setCredentials?: Dispatch<SetStateAction<Credentials>>;
  notification?: PreloaderResponse<unknown>;
  setNotification?: Dispatch<SetStateAction<PreloaderResponse<unknown>>>;
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
  mfaCode: "",
};

export const ElectronContextProvider = (props: Props): ReactElement => {
  // TODO: Set credentials must assign AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
  // when those values are passed in, and also, remove them from the env when those
  // values are unset
  const [credentials, setCredentials] = useState<Credentials>(blankCredentials);
  const [notification, setNotification] = useState<PreloaderResponse<unknown>>({
    message: "Welcome!",
    type: "info",
    data: null,
    details: null,
  });
  const emptyCredentials = { ...blankCredentials };
  const clearCredentials = () => setCredentials(emptyCredentials);

  return (
    <ElectronStore.Provider
      value={{
        aws: props.aws || window.aws,
        credentials,
        setCredentials,
        notification,
        setNotification,
        clearCredentials,
      }}
    >
      {props.children}
    </ElectronStore.Provider>
  );
};
