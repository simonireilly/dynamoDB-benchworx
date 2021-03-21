import React from "react";
import { mount } from "@cypress/react";
import { Steps } from "../../../../../src/pages/credentials/steps";

describe("Steps Component", () => {
  beforeEach(() => {
    mount(<Steps />);
  });
  it("has steps for selecting aws profile or access keys", () => {
    // Within here we assert the child component is mounted
  });
  it("has steps for aliasing to a role", () => {
    // Within here we assert the child component is mounted
  });
});
