import React from "react";
import { mount } from "@cypress/react";
import { Profile } from "@/pages/credentials/forms/profile";
import { ElectronContextProvider } from "@/contexts/electron-context";

const mockAws: Window["aws"] = {
  listTables: (profile: string, mfaCode?: string) =>
    Promise.resolve({
      type: "success",
      message: "Fetched tables",
      details: "Fetched 2 tables",
      data: {
        $metadata: {},
        LastEvaluatedTableName: "",
        TableNames: ["table-1", "table-2"],
      },
    }),
  listAwsConfig: () =>
    Promise.resolve({
      type: "success",
      message: "Fetched available profiles",
      data: [
        {
          profile: "default",
          region: "eu-west-1",
          mfa: false,
          assumeRole: false,
        },
      ],
      details: null,
    }),
};

describe("ManualCredentials Component", () => {
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

  describe("Credentials", () => {
    it("sets the credentials as the profile credentials when selected", () => {
      cy.get("#aws-select-profile").click({ force: true });
    });
  });
});
