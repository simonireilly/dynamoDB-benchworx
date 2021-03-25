import React from "react";
import { mount } from "@cypress/react";
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
      cy.dataTest("select-profile").should("be.visible");
    });
    it("sets the credentials as the profile credentials when selected", () => {
      cy.dataTest("select-profile").click({ force: true });
    });
  });
});
