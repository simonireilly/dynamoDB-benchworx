import React, { ReactElement } from "react";
import { ElectronContextProvider } from "./contexts/electron-context";

import { Credentials } from "./credentials";

export const App = (): ReactElement => {
  return (
    <ElectronContextProvider>
      <>
        Contains the renderer
        <Credentials />
      </>
    </ElectronContextProvider>
  );
};
