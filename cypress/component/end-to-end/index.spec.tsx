import React from "react";
import { mount } from "@cypress/react";
import { ElectronStore } from "@src/contexts/electron-context";
import { UI } from "@src/layout/ui";
import { mockAws } from "@cy/support/mocks";

describe("End to End tests", () => {
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
            items: [
              {
                pk: "test",
                sk: "example",
              },
            ],
          }}
        >
          <UI />
        </ElectronStore.Provider>
      )
    );
  });
  it("renders the application in full", () => {
    cy.wait(2000);

    cy.matchImageSnapshot("latest");
  });
});
