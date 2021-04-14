/**
 * @jest-environment jsdom
 */

import React from "react";
import { customRender } from "@tests/utils/renderer";
import { Expiration } from "./expiration";
import { screen } from "@testing-library/dom";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup;
});

describe("expiration", () => {
  it("renders the session chip in the dom when expiration is present", async () => {
    customRender(<Expiration />, {
      providerProps: {
        value: {
          credentials: { expiration: new Date(1995, 11, 17, 3, 24, 0) },
        },
      },
    });

    const expiration = await screen.findByTestId("expiration");
    expect(expiration).toHaveTextContent(
      "Session: Sun, 17 Dec 1995 03:24:00 GMT"
    );
  });

  it("renders the session chip in the dom when expiration is present", async () => {
    customRender(<Expiration />, {
      providerProps: { value: { credentials: { expiration: null } } },
    });

    const expiration = screen.queryByText("session");
    expect(expiration).not.toBeInTheDocument();
  });
});
