// Preloading allows fetching node_modules/native code into the application
//
// In order to use the @aws-sdk we must import those utilities here and add
// those methods to the window.
//
// When writing those methods, we should encapsulate the actual calls to client,
// preventing injection and/or privilege escalation

console.info("Preloading node modules");

import { contextBridge } from "electron";

import { describeTable, listTables, scan } from "@src/utils/aws/dynamo/queries";
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

contextBridge.exposeInMainWorld("aws", {
  authenticator,
  describeTable,
  listAwsConfig,
  listTables,
  scan,
});
