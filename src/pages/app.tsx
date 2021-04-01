import React, { ReactElement } from "react";
import { ElectronContextProvider } from "../contexts/electron-context";

import { UI } from "./ui";

export const App = (): ReactElement => {
  return (
    <ElectronContextProvider>
      <UI />
    </ElectronContextProvider>
  );
};
