import React, {
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DataGrid,
  GridColDef,
  GridRowData,
  GridRowSelectedParams,
  GridValueFormatterParams,
} from "@material-ui/data-grid";
import { ElectronStore } from "@src/contexts/electron-context";
import { getKeySchema } from "@src/utils/aws/dynamo/items";

export const DataTable = (): ReactElement => {
  const { table, items = [], setItem } = useContext(ElectronStore);
  const [hashKey, setHashKey] = useState<string>("");
  const [sortKey, setSortKey] = useState<string>("");

  useEffect(() => {
    const keySchema = table && getKeySchema(table.Table.KeySchema);
    if (keySchema) {
      setHashKey(keySchema.hashKey);
      setSortKey(keySchema.sortKey);
    }
  }, [table?.Table?.TableName]);

  const everyKey: string[] = useMemo(
    () =>
      items &&
      items.reduce<string[]>((acc, item) => {
        Object.keys(item).forEach((key) => {
          if (acc.indexOf(key) < 0) acc.push(key);
        });

        return acc;
      }, []),
    [items.length]
  );

  const columns: GridColDef[] = useMemo(
    () =>
      everyKey &&
      everyKey.map((key) => ({
        field: key,
        width: [hashKey, sortKey].includes(key) ? 250 : 100,
        valueFormatter: (params: GridValueFormatterParams) =>
          JSON.stringify(params.value, null, 2),
      })),
    [sortKey, hashKey, items.length]
  );

  const constructCompositeKey = (row: GridRowData) =>
    [row[hashKey], row[sortKey]].filter(Boolean).join("-");

  const rowData = useMemo(
    () =>
      items &&
      items.map<GridRowData>((row) => {
        return {
          // TODO: Having to assign ID here is not ideal, we would be better to have a unique key that is not part of the item
          // For this reason we should move away from material UI DataGrid
          id: constructCompositeKey(row),
          ...row,
        };
      }),
    [sortKey, hashKey, items.length]
  );
  console.info("RowData", { rowData });

  const handleRowSelection = (params: GridRowSelectedParams) => {
    const { data } = params;
    setItem(data);
  };

  return items ? (
    items.length > 0 && (
      <DataGrid
        rows={rowData}
        onRowSelected={handleRowSelection}
        columns={columns}
        pageSize={25}
        density="compact"
      />
    )
  ) : (
    <></>
  );
};
