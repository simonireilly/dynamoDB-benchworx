import React, { ReactElement, useContext, useState, useRef } from "react";
import Editor, { OnChange } from "@monaco-editor/react";
import { ElectronStore } from "@src/contexts/electron-context";
import { Box, Toolbar, Button } from "@material-ui/core";

// TODO: Consider packaging to monaco editor instead of fetching over the network
// as this means we can support offline (do we need to do that?)
export const ItemViewer = (): ReactElement => {
  const {
    item,
    setNotification,
    credentials,
    table,
    aws: { put },
  } = useContext(ElectronStore);

  const [changed, setChanged] = useState(false);
  const [changedItem, setChangedItem] = useState(item);

  const handleEditorChange: OnChange = (value, event) => {
    try {
      setChangedItem(JSON.parse(value));
      setChanged(true);
    } catch {
      setNotification({
        message: "Invalid JSON detected",
        data: null,
        details: null,
        type: "error",
      });
    }
  };

  const updateItem = async () => {
    const results = await put(credentials.profile, credentials.region, {
      TableName: table.Table.TableName,
      Item: changedItem,
      ReturnConsumedCapacity: "TOTAL",
    });
    setNotification(results);
  };

  return (
    <>
      <Box flex={1}>
        <Editor
          theme="vs-dark"
          defaultLanguage="json"
          value={JSON.stringify(item, null, 2)}
          defaultValue="// None selected"
          onChange={handleEditorChange}
        />
      </Box>
      <Box>
        <Toolbar>
          <Button
            variant="contained"
            color="primary"
            onClick={updateItem}
            disabled={!changed}
          >
            Update Item
          </Button>
        </Toolbar>
      </Box>
    </>
  );
};
