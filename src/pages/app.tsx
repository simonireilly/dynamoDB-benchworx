import React, { ReactElement } from "react";
import { ElectronContextProvider } from "../contexts/electron-context";

import { Steps } from "./credentials/steps";

export const App = (): ReactElement => {
  return (
    <ElectronContextProvider>
      <Steps />
    </ElectronContextProvider>
  );
};
