/**
 * @jest-environment jsdom
 */

import React from "react";
import { setup } from "@tests/utils/renderer";
import { Expiration } from "./expiration";
import { screen, waitFor } from "@testing-library/dom";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup;
});

describe("expiration", () => {
  it("renders the session chip in the dom when expiration is present", () => {
    const { render } = setup(<Expiration />);

    render();

    waitFor(() => {
      const expiration = screen.findByTestId("expiration");
      expect(expiration).toHaveTextContent("session");
    });
  });
});
