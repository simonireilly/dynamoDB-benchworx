import React from "react";
import { mount } from "@cypress/react";
import { ElectronStore } from "@src/contexts/electron-context";
import { UI } from "@src/layout/ui";
import { mockAws } from "@cy/support/mocks";
import { Box } from "@material-ui/core";

describe("End to End tests", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.isDeepStrictEqual = () => null;
    });

    // Freeze cypress time
    const now = new Date(1995, 11, 17, 3, 22, 0).getTime();
    cy.clock(now);

    cy.window().should("have.property", "isDeepStrictEqual");

    cy.fixture("describe-table").then((table) =>
      mount(
        <ElectronStore.Provider
          value={{
            table,
            aws: mockAws,
            credentials: {
              profile: "default",
              region: "eu-west-1",
              expiration: new Date(1995, 11, 17, 3, 24, 0),
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
          <Box p={1}>
            <UI />
          </Box>
        </ElectronStore.Provider>
      )
    );
  });
  it("renders the application in full", () => {
    cy.wait(2000);

    cy.matchImageSnapshot("latest");
  });
});
