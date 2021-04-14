/**
 * @jest-environment jsdom
 */

import React, { ReactElement, useContext } from "react";
import { customRender } from "@tests/utils/renderer";
import { ElectronStore } from "./electron-context";

const RenderContext = (): ReactElement => {
  const context = useContext(ElectronStore);

  return <pre>{JSON.stringify(context, null, 2)}</pre>;
};

describe("electron context", () => {
  it("renders the context", () => {
    customRender(<RenderContext />, {});
  });
});
