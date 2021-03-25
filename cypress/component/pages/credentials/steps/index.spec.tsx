import React from "react";
import { mount } from "@cypress/react";
import { Steps } from "@src/pages/credentials/steps";
import { ElectronContextProvider } from "@src/contexts/electron-context";
import { mockAws } from "@cy/support/mocks";

describe("Steps Component", () => {
  beforeEach(() => {
    mount(
      <ElectronContextProvider aws={{ ...mockAws }}>
        <Steps />
      </ElectronContextProvider>
    );
  });
});
