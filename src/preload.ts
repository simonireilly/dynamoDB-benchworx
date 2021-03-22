console.info("Preloading node modules");

import { contextBridge } from "electron";

import {
  loadSharedConfigFiles,
  SharedConfigFiles,
  SharedConfigInit,
} from "@aws-sdk/shared-ini-file-loader";

import { defaultProvider } from "@aws-sdk/credential-provider-node";

declare global {
  interface Window {
    aws: {
      defaultProvider: typeof defaultProvider;
      loadSharedConfigFiles: (
        init?: SharedConfigInit
      ) => Promise<SharedConfigFiles>;
    };
  }
}

contextBridge.exposeInMainWorld("aws", {
  loadSharedConfigFiles,
  defaultProvider,
});
