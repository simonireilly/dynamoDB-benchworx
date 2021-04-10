import React, {
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Editor, { OnChange } from "@monaco-editor/react";
import { ElectronStore } from "@src/contexts/electron-context";
import { Box, Toolbar, Button } from "@material-ui/core";
import { getKeySchema } from "@src/utils/aws/dynamo/items";

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

  // Item has same pk, sk but attrs are different
  const [changed, setChanged] = useState(false);
  // pk and sk have been changed so a new item will be created
  const [newItem, setNewItem] = useState(false);
  const [editorItem, setEditorItem] = useState(item);

  const keySchema = useMemo(() => {
    return table?.Table && getKeySchema(table.Table.KeySchema);
  }, [table?.Table?.TableName]);

  // TODO: These handle changes are slow and cause the editor to feel laggy
  // Instead we should handle validation separately
  // And handle submits by getting the current value
  // TODO: The editor does not fire change events when the item is changed
  // back to its original value, need to investigate why this is
  const handleEditorChange: OnChange = (value, event) => {
    console.info("Change event");
    try {
      const currentValue = JSON.parse(value);
      setEditorItem(currentValue);
      setChanged(true);
      setNewItem(isNewItem(currentValue));
    } catch {
      setNotification({
        message: "Invalid JSON detected",
        data: null,
        details: null,
        type: "error",
      });
    }
  };

  useEffect(() => {
    setChanged(false);
    setNewItem(false);
  }, [JSON.stringify(item)]);

  // Item is a new item if the pk or sk have been changed
  const isNewItem = (current: Record<string, unknown>): boolean => {
    console.info([
      item[keySchema.hashKey],
      current[keySchema.hashKey],
      item[keySchema.sortKey],
      current[keySchema.sortKey],
    ]);
    return (
      item[keySchema.hashKey] !== current[keySchema.hashKey] ||
      item[keySchema.sortKey] !== current[keySchema.sortKey]
    );
  };

  const putItem = async () => {
    const results = await put(credentials.profile, credentials.region, {
      TableName: table.Table.TableName,
      Item: editorItem,
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
          defaultValue="{}"
          onChange={handleEditorChange}
        />
      </Box>
      <Box>
        <Toolbar>
          <Button
            variant="contained"
            color="primary"
            onClick={putItem}
            disabled={!changed || newItem}
          >
            Update Item
          </Button>
          &nbsp;
          <Button
            variant="contained"
            color="secondary"
            onClick={putItem}
            disabled={!newItem}
          >
            Add New Item
          </Button>
        </Toolbar>
      </Box>
    </>
  );
};
