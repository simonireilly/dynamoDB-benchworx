/**
 * @jest-environment jsdom
 */

import React from "react";
import { Profile } from "./profile";
import { mount } from "enzyme";
import { mockAws } from "@mocks/index";
import { ElectronStore } from "@src/contexts/electron-context";

const setup = () => {
  return mount(
    <ElectronStore.Provider
      value={{
        table: {
          $metadata: {},
        },
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
      <Profile />
    </ElectronStore.Provider>
  );
};

describe("Profile", () => {
  it("renders the component", () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
