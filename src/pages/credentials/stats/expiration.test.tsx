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
  jest.useRealTimers();
});

describe("expiration", () => {
  it("renders the session chip in the dom when expiration is present and only ten minutes left", async () => {
    jest
      .useFakeTimers("modern")
      .setSystemTime(new Date(1995, 11, 17, 3, 22, 0).getTime());

    customRender(<Expiration />, {
      providerProps: {
        value: {
          credentials: { expiration: new Date(1995, 11, 17, 3, 24, 0) },
        },
      },
    });

    const expiration = await screen.findByTestId("expiration");

    expect(expiration).toHaveTextContent("Session expires in 120 seconds");
  });

  it("does not show expiration when it is not a date", async () => {
    customRender(<Expiration />, {
      providerProps: { value: { credentials: { expiration: null } } },
    });

    const expiration = screen.queryByText("session");
    expect(expiration).not.toBeInTheDocument();
  });
});
