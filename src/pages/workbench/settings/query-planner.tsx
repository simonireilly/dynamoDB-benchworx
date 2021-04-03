import { ElectronStore } from "@src/contexts/electron-context";
import React, { ReactElement, useContext } from "react";

export const QueryPlanner = (): ReactElement => {
  const { table } = useContext(ElectronStore);

  return <>Query planner</>;
};
