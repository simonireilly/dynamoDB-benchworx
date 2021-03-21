import React from "react";
import { mount } from "@cypress/react";
import { Roles } from "./../../../../../src/pages/credentials/forms/roles";

describe("Role Component", () => {
  beforeEach(() => {
    mount(<Roles />);
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
