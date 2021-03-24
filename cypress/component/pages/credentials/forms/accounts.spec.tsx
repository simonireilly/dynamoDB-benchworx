import React from "react";
import { mount } from "@cypress/react";
import { Account } from "@/pages/credentials/forms/account";
import {
  blankCredentials,
  ElectronStore,
} from "@/contexts/electron-context";

describe("Account Component", () => {
  beforeEach(() => {
    mount(
      <ElectronStore.Provider value={{ credentials: blankCredentials }}>
        <Account />
      </ElectronStore.Provider>
    );
  });
  it("renders a select for available roles", () => {
    cy.contains("Choose AWS Account Profile").should("be.visible");
    cy.contains("AWS Access Key ID").should("be.visible");
  });

  describe("Credentials", () => {
    it("sets the credentials as the profile credentials when selected", () => {
      cy.get("#aws-select-profile").click({ force: true });
    });
    it("allows direct entry of credentials", () => {
      cy.get("#aws-access-key-id").type("key");
      cy.get("#aws-secret-access-key").type("secret");
    });
  });
});
