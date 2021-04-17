declare module "@cypress/react/plugins/load-webpack" {
  const injectDevServer: (
    on: Cypress.PluginEvents,
    config: Cypress.PluginConfigOptions,
    options: { webpackFilename: string }
  ) => Cypress.PluginConfigOptions;

  export default injectDevServer;
}

interface Window {
  isDeepStrictEqual: () => void;
}
