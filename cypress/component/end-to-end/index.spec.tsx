import React from "react";
import { mount } from "@cypress/react";
import { ElectronStore } from "@src/contexts/electron-context";
import { UI } from "@src/pages/layout/ui";
import { mockAws } from "@cy/support/mocks";

describe("Manual Credentials Component", () => {
  beforeEach(() => {
    cy.fixture("describe-table").then((table) =>
      mount(
        <ElectronStore.Provider
          value={{
            table,
            aws: mockAws,
            credentials: {
              profile: "default",
              region: "eu-west-1",
            },
            setNotification: () => ({}),
            item: {
              pk: "test",
              sk: "example",
            },
          }}
        >
          <UI />
        </ElectronStore.Provider>
      )
    );
  });
  it("renders the application in full", () => {
    cy.wait(1000);

    cy.screenshot("latest");
  });
});
