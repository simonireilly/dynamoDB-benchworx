import "@testing-library/jest-dom/extend-expect";

import React, { FC, ReactChildren, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ElectronContext, ElectronStore } from "@src/contexts/electron-context";
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

jest.mock("@src/utils/aws/accounts/config");
jest.mock("@src/utils/aws/dynamo/queries");
jest.mock("@src/utils/aws/credentials");

const awsMock = {
  scan: mocked(scan),
  query: mocked(query),
  listAwsConfig: mocked(listAwsConfig),
  listTables: mocked(listTables),
  authenticator: mocked(authenticator),
  put: mocked(put),
  describeTable: mocked(describeTable),
};

beforeEach(() => {
  jest.resetAllMocks();
});

const WrappedComponent: FC = ({ children }: { children: ReactChildren }) => {
  return (
    <ElectronStore.Provider
      value={{
        table: {
          $metadata: {},
        },
        aws: awsMock,
        credentials: {
          profile: "default",
          region: "eu-west-1",
          expiration: new Date(1995, 11, 17, 3, 24, 0),
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
      {children}
    </ElectronStore.Provider>
  );
};

export const setup = (
  ui: ReactElement,
  options?: { providerProps?: { value: Partial<ElectronContext> } } & Omit<
    RenderOptions,
    "queries"
  >
): { awsMock: typeof awsMock; render: () => ReturnType<typeof render> } => ({
  awsMock,
  render: () =>
    customRender(ui, {
      wrapper: WrappedComponent,
      ...options,
    }),
});

export const customRender = (
  ui: ReactElement,
  {
    providerProps = { value: {} },
    ...renderOptions
  }: { providerProps?: { value: Partial<ElectronContext> } } & Omit<
    RenderOptions,
    "queries"
  >
): ReturnType<typeof render> => {
  const props = {
    value: {
      table: {
        $metadata: {},
      },
      aws: awsMock,
      credentials: {
        profile: "default",
        region: "eu-west-1",
        expiration: new Date(1995, 11, 17, 3, 24, 0),
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
      ...(providerProps && providerProps.value),
    },
  };

  return render(
    <ElectronStore.Provider {...props}>{ui}</ElectronStore.Provider>,
    renderOptions
  );
};
