/**
 * @jest-environment jsdom
 */

import React from "react";
import { Profile } from "./profile";
import { screen, cleanup } from "@testing-library/react";
import { setup } from "@tests/utils/renderer";

afterEach(() => {
  cleanup;
});

describe("Profile", () => {
  it("renders the component with available profiles", async () => {
    const { awsMock, render } = setup(<Profile />);

    awsMock.listAwsConfig.mockResolvedValueOnce({
      data: [
        {
          region: "eu-west-1",
          mfa: false,
          profile: "profile-1",
          assumeRole: false,
        },
        {
          region: "eu-west-1",
          mfa: false,
          profile: "profile-2",
          assumeRole: false,
        },
      ],
      details: "Fetched a profile",
      type: "success",
      message: "Fetched profiles message",
    });

    render();

    const profileSelect = await screen.findByTestId("select-profile");
    const profileSelectOptions = await screen.findByTestId(
      "select-profile-options"
    );

    expect(awsMock.listAwsConfig).toHaveBeenCalled();
    expect(profileSelect).toHaveTextContent("profile");
    expect(profileSelectOptions).toHaveTextContent("profile-1profile-2");
  });
});
