import React, { createContext, ReactElement } from "react";

interface Props {
  children: ReactElement;
}

export type ElectronContext = {
  aws: Window["aws"];
};

export const ElectronStore = createContext<ElectronContext>({
  aws: window.aws,
});

export const ElectronContextProvider = (props: Props): ReactElement => {
  return (
    <ElectronStore.Provider
      value={{
        aws: window.aws,
      }}
    >
      {props.children}
    </ElectronStore.Provider>
  );
};
