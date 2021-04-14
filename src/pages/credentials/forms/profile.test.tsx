/**
 * @jest-environment jsdom
 */

import React from "react";
import { Profile } from "./profile";
import { render, fireEvent, screen } from "@testing-library/react";
import { ElectronStore } from "@src/contexts/electron-context";
import { mocked } from "ts-jest/utils";
import {
  describeTable,
  listTables,
  put,
  query,
  scan,
} from "@src/utils/aws/dynamo/queries";
import { listAwsConfig } from "@src/utils/aws/accounts/config";
import { authenticator } from "@src/utils/aws/credentials";

const listAwsConfigMock = mocked(listAwsConfig);

const awsMock: Window["aws"] = {
  scan: mocked(scan),
  query: mocked(query),
  listAwsConfig: listAwsConfigMock,
  listTables: mocked(listTables),
  authenticator: mocked(authenticator),
  put: mocked(put),
  describeTable: mocked(describeTable),
};

const setup = () => {
  return render(
    <ElectronStore.Provider
      value={{
        table: {
          $metadata: {},
        },
        aws: awsMock,
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
  it("renders the component with available profiles", async () => {
    setup();

    const alert = await screen.findByRole("alert");

    expect(alert).toHaveTextContent(/congrats/i);
  });
});
