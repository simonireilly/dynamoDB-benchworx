import React from "react";
import { mount } from "@cypress/react";
import { Steps } from "../../../../../src/pages/credentials/steps";
import {
  blankCredentials,
  ElectronStore,
} from "../../../../../src/contexts/electron-context";

describe("Steps Component", () => {
  beforeEach(() => {
    mount(
      <ElectronStore.Provider value={{ credentials: blankCredentials }}>
        <Steps />
      </ElectronStore.Provider>
    );
  });
  it("has steps for selecting aws profile or access keys", () => {
    // Within here we assert the child component is mounted
  });
  it("has steps for aliasing to a role", () => {
    // Within here we assert the child component is mounted
  });
});
