import React from "react";
import { mount } from "@cypress/react";
import { ElectronStore } from "@src/contexts/electron-context";
import { UI } from "@src/pages/layout/ui";
import { mockAws } from "@cy/support/mocks";

describe("End to End tests", () => {
  beforeEach(() => {
    cy.clock(new Date(2020, 6, 24, 22, 19, 0).getTime());

    cy.fixture("describe-table").then((table) => {
      return mount(
        <ElectronStore.Provider
          value={{
            table,
            aws: mockAws,
            credentials: {
              profile: "default",
              region: "eu-west-1",
              expiration: new Date(2020, 6, 24, 22, 19, 30),
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
      );
    });
  });
  it("renders the application in full", () => {
    cy.wait(1000);

    cy.matchImageSnapshot("latest");
  });
});
