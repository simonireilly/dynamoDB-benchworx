import React, { ReactElement, useContext } from "react";
import Editor from "@monaco-editor/react";
import { ElectronStore } from "@src/contexts/electron-context";

// TODO: Consider packaging to monaco editor instead of fetching over the network
// as this means we can support offline (do we need to do that?)
export const ItemViewer = (): ReactElement => {
  const { item } = useContext(ElectronStore);

  return (
    <Editor
      defaultLanguage="json"
      value={JSON.stringify(item, null, 2)}
      defaultValue="// None selected"
    />
  );
};
