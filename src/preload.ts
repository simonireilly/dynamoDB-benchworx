console.info("Preloading node modules");

import { contextBridge } from "electron";

import {
  loadSharedConfigFiles,
  SharedConfigFiles,
} from "@aws-sdk/shared-ini-file-loader";

declare global {
  interface Window {
    aws: {
      listCredentials: () => Promise<SharedConfigFiles>;
    };
  }
}

contextBridge.exposeInMainWorld("aws", {
  listCredentials: () => loadSharedConfigFiles(),
});
