// Preloading allows fetching node_modules/native code into the application
//
// In order to use the @aws-sdk we must import those utilities here and add
// those methods to the window.
//
// When writing those methods, we should encapsulate the actual calls to client,
// preventing injection and/or privilege escalation.

console.info("Preloading node modules");

import { contextBridge } from "electron";
import { isDeepStrictEqual } from "util";

import {
  describeTable,
  listTables,
  scan,
  query,
  put,
} from "@src/utils/aws/dynamo/queries";
import { listAwsConfig } from "@src/utils/aws/accounts/config";
import { authenticator } from "@src/utils/aws/credentials";

declare global {
  interface Window {
    aws: {
      authenticator: typeof authenticator;
      describeTable: typeof describeTable;
      listAwsConfig: typeof listAwsConfig;
      listTables: typeof listTables;
      scan: typeof scan;
      query: typeof query;
      put: typeof put;
    };
    util: {
      isDeepStrictEqual: typeof isDeepStrictEqual;
    };
  }
}

// All responses should implement this interface
export type PreloaderResponse<T> = {
  type: "success" | "error" | "warning" | "info";
  data: T | null;
  message: string;
  details: string | null;
};

// Expose the AWS object to over the context bridge to allow invocation of the attached
// methods in the renderer processes.
contextBridge.exposeInMainWorld("aws", {
  authenticator,
  describeTable,
  listAwsConfig,
  listTables,
  scan,
  query,
  put,
});

contextBridge.exposeInMainWorld("util", {
  isDeepStrictEqual,
});
