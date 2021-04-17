import injectWebpackDevServer from "@cypress/react/plugins/load-webpack";
import { addMatchImageSnapshotPlugin } from "cypress-image-snapshot/plugin";

/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************
// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars

module.exports = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
) => {
  console.info({ config });
  config.env.webpackFilename = "./webpack.main.config.js";

  injectWebpackDevServer(on, config, {
    webpackFilename: "./webpack.main.config.js",
  });
  addMatchImageSnapshotPlugin(on, config);

  return config;
};
