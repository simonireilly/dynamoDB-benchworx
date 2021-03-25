import React from "react";
import { mountHook, mount } from "@cypress/react";
import { Profile } from "@src/pages/credentials/forms/profile";
import { ElectronContextProvider } from "@src/contexts/electron-context";
import { mockAws } from "@cy/support/mocks";

describe("ManualCredentials Component", () => {
  describe("Credentials", () => {
    beforeEach(() => {
      mount(
        <ElectronContextProvider aws={{ ...mockAws }}>
          <Profile />
        </ElectronContextProvider>
      );
    });
    it("renders a select for available roles", () => {
      cy.contains("Choose AWS Account Profile").should("be.visible");
    });
    it("sets the credentials as the profile credentials when selected", () => {
      cy.get("#aws-select-profile").click({ force: true });
    });
  });
});
