/**
 * @jest-environment jsdom
 */

import React from "react";
import { Profile } from "./profile";
import { screen, cleanup } from "@testing-library/react";
import { setup } from "@tests/utils/renderer";
import userEvent from "@testing-library/user-event";
import { PreloaderResponse } from "@src/preload";
import { SafeProfile } from "@src/utils/aws/accounts/config";

afterEach(() => {
  cleanup;
});

const profilesFixture: PreloaderResponse<SafeProfile[]> = {
  data: [
    {
      region: "eu-west-1",
      mfa: false,
      profile: "profile-1",
      assumeRole: false,
    },
    {
      region: "eu-west-1",
      mfa: true,
      profile: "profile-2",
      assumeRole: false,
    },
  ],
  details: "Fetched a profile",
  type: "success",
  message: "Fetched profiles message",
};

describe("Profile", () => {
  it("renders the component with available profiles", async () => {
    const { awsMock, render } = setup(<Profile />);

    awsMock.listAwsConfig.mockResolvedValueOnce(profilesFixture);

    render();

    const profileSelect = await screen.findByTestId("select-profile");
    const profileSelectOptions = await screen.findByTestId(
      "select-profile-options"
    );

    expect(awsMock.listAwsConfig).toHaveBeenCalled();
    expect(profileSelect).toHaveTextContent("profile");
    expect(profileSelectOptions).toHaveTextContent("profile-1profile-2");
  });

  describe("selecting a profile", () => {
    it("renders the MFA modal when mfa is required", async () => {
      // Arrange
      const setCredentialsMock = jest.fn();
      const { awsMock, render } = setup(<Profile />, {
        providerProps: { value: { setCredentials: setCredentialsMock } },
      });

      awsMock.listAwsConfig.mockResolvedValueOnce(profilesFixture);

      const { container } = render();

      // Act
      await screen.findByTestId("select-profile");
      const profileSelect = container.querySelector("#aws-select-profile");
      userEvent.selectOptions(profileSelect, "profile-2");
      const mfaModal = await screen.findByTestId("mfa-modal");

      // Assert
      expect(mfaModal).toBeVisible();
      expect(awsMock.listAwsConfig).toHaveBeenCalled();
      expect(awsMock.authenticator).not.toHaveBeenCalled();
    });

    it("calls the authenticator when mfa is not required", async () => {
      // Arrange
      const setCredentialsMock = jest.fn();

      const { awsMock, render } = setup(<Profile />, {
        providerProps: { value: { setCredentials: setCredentialsMock } },
      });

      awsMock.listAwsConfig.mockResolvedValueOnce(profilesFixture);
      awsMock.authenticator.mockResolvedValueOnce({
        data: null,
        message: "Assumed role",
        details: "Session expiration returned",
        type: "success",
      });

      const { container } = render();

      // Act
      await screen.findByTestId("select-profile");
      const profileSelect = container.querySelector("#aws-select-profile");
      userEvent.selectOptions(profileSelect, "profile-1");

      // Assert
      expect(awsMock.listAwsConfig).toHaveBeenCalled();
      expect(awsMock.authenticator).toHaveBeenCalledWith({
        profile: "profile-1",
        mfaCode: "",
      });
      expect(setCredentialsMock).toHaveBeenCalledTimes(1);
    });

    it("sets the expiration when returned by the authenticator", async () => {
      // Arrange
      const setCredentialsMock = jest.fn();

      const { awsMock, render } = setup(<Profile />, {
        providerProps: { value: { setCredentials: setCredentialsMock } },
      });

      awsMock.listAwsConfig.mockResolvedValueOnce(profilesFixture);
      awsMock.authenticator.mockResolvedValueOnce({
        data: {
          expiration: new Date(1995, 11, 17, 3, 24, 0),
        },
        message: "Assumed role",
        details: "Session expiration returned",
        type: "success",
      });

      const { container } = render();

      // Act
      await screen.findByTestId("select-profile");
      const profileSelect = container.querySelector("#aws-select-profile");
      userEvent.selectOptions(profileSelect, "profile-1");

      // Assert
      expect(awsMock.listAwsConfig).toHaveBeenCalled();
      expect(awsMock.authenticator).toHaveBeenCalledWith({
        profile: "profile-1",
        mfaCode: "",
      });
      expect(setCredentialsMock).toHaveBeenCalledTimes(1);
    });
  });
});
