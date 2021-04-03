// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

export default {};

import { addMatchImageSnapshotCommand } from "cypress-image-snapshot/command";

declare global {
  // eslint-disable-next-line
  namespace Cypress {
    interface Chainable<Subject> {
      dataTest(dataTest: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add("dataTest", (id) => cy.get(`[data-test="${id}"]`));
addMatchImageSnapshotCommand();
