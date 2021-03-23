// Preloading allows fetching node_modules/native code into the application
//
// In order to use the @aws-sdk we must import those utilities here and add
// those methods to the window.
//
// When writing those methods, we should encapsulate the actual calls to client,
// preventing injection and/or privilege escalation

console.info("Preloading node modules");

import { contextBridge } from "electron";

import { listTables } from "./utils/aws/dynamo/queries";
import { loadSharedConfigFiles } from "@aws-sdk/shared-ini-file-loader";

declare global {
  interface Window {
    aws: {
      loadSharedConfigFiles: typeof loadSharedConfigFiles;
      listTables: typeof listTables;
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
  loadSharedConfigFiles,
  listTables,
});
