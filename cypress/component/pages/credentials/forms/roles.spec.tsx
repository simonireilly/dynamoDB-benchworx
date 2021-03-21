import React from "react";
import { mount } from "@cypress/react";
import { Roles } from "./../../../../../src/pages/credentials/forms/roles";

describe("HelloWorld component", () => {
  it("works", () => {
    mount(<Roles />);
    // now use standard Cypress commands
    cy.contains("Choose AWS Account Role").should("be.visible");
  });
});
