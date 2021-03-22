console.info("Preloading node modules");

import { contextBridge } from "electron";

import {
  loadSharedConfigFiles,
  SharedConfigFiles,
  SharedConfigInit,
} from "@aws-sdk/shared-ini-file-loader";

declare global {
  interface Window {
    aws: {
      loadSharedConfigFiles: (
        init?: SharedConfigInit
      ) => Promise<SharedConfigFiles>;
    };
  }
}

contextBridge.exposeInMainWorld("aws", {
  loadSharedConfigFiles,
});
