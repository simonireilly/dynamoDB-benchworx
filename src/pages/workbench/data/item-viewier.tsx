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
    setItem,
    setNotification,
    credentials,
    table,
    aws: { put },
  } = useContext(ElectronStore);

  const { isDeepStrictEqual } = window["util"] || {};

  // Bind the item value to the state allowing the edit to control the state
  const [value, setValue] = useState(item || {});
  // Item has same pk, sk but attrs are different
  const [changed, setChanged] = useState(false);
  // pk and sk have been changed so a new item will be created
  const [newItem, setNewItem] = useState(false);

  const keySchema = useMemo(() => {
    return table?.Table && getKeySchema(table.Table.KeySchema);
  }, [table?.Table?.TableName]);

  const handleEditorChange: OnChange = (value, event) => {
    try {
      const currentValue = JSON.parse(value);
      setValue(currentValue);
      // Set changed when the item is not equal to the currentValue
      console.info({
        item,
        currentValue,
      });

      setChanged(!isDeepStrictEqual(item, currentValue));
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
    setValue(item);
  }, [JSON.stringify(item)]);

  // Item is a new item if the pk or sk have been changed, or item is not in context
  // so this is a new blank entry
  const isNewItem = (current: Record<string, unknown>): boolean => {
    if (!item) return true;

    return (
      item[keySchema.hashKey] !== current[keySchema.hashKey] ||
      item[keySchema.sortKey] !== current[keySchema.sortKey]
    );
  };

  const putItem = async () => {
    const results = await put(credentials?.profile, credentials?.region, {
      TableName: table?.Table?.TableName,
      Item: value,
      ReturnConsumedCapacity: "TOTAL",
    });

    setNotification(results);

    if (results.type === "success") {
      setChanged(false);
      setNewItem(false);
      setItem(value);
    }
  };

  return (
    <>
      <Box flex={1}>
        <Editor
          theme="vs-dark"
          defaultLanguage="json"
          value={JSON.stringify(value, null, 2)}
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
