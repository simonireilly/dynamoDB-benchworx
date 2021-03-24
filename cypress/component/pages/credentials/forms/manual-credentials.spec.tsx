import React from "react";
import { mount } from "@cypress/react";
import { Profile } from "@/pages/credentials/forms/profile";

describe("Role Component", () => {
  beforeEach(() => {
    mount(<Profile />);
  });
  it("renders a select for available roles", () => {
    cy.contains("Choose AWS Account Role").should("be.visible");
  });

  it("allows direct input of an ARN for the role", () => {
    cy.get("#aws-role-arn").type(
      "arn:aws:iam::account-id:role/role-name-with-path"
    );
  });
});
