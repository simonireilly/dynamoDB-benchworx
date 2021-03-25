import React from "react";
import { mount } from "@cypress/react";
import { ManualCredentials } from "@src/pages/credentials/forms/manual-credentials";
import { mockAws } from "@cy/support/mocks";
import { ElectronContextProvider } from "@src/contexts/electron-context";

describe("Manual Credentials Component", () => {
  beforeEach(() => {
    mount(
      <ElectronContextProvider aws={{ ...mockAws }}>
        <ManualCredentials />
      </ElectronContextProvider>
    );
  });
  it("has space to enter credentials", () => {
    cy.dataTest("input-aws-access-key-id").should("be.visible");
    cy.dataTest("input-aws-secret-access-key").should("be.visible");
  });
});
