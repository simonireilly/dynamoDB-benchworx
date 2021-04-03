import React, { ReactElement } from "react";
import { ElectronContextProvider } from "../contexts/electron-context";

import { UI } from "./layout/ui";

export const App = (): ReactElement => {
  return (
    <ElectronContextProvider>
      <UI />
    </ElectronContextProvider>
  );
};
