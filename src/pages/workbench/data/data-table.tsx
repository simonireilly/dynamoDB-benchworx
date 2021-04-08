import React, { ReactElement, useContext, useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowData,
  GridRowSelectedParams,
  GridValueFormatterParams,
} from "@material-ui/data-grid";
import { ElectronStore } from "@src/contexts/electron-context";

export const DataTable = (): ReactElement => {
  const { table, items, setItem } = useContext(ElectronStore);
  const [hashKey, setHashKey] = useState<string>("");
  const [sortKey, setSortKey] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      setHashKey(
        table.Table.KeySchema.find((el) => el.KeyType === "HASH")?.AttributeName
      );
      setSortKey(
        table.Table.KeySchema.find((el) => el.KeyType === "RANGE")
          ?.AttributeName
      );
    };

    init();
  }, [table?.Table?.TableName]);

  const everyKey: string[] =
    items &&
    items.reduce<string[]>((acc, item) => {
      Object.keys(item).forEach((key) => {
        if (acc.indexOf(key) < 0) acc.push(key);
      });

      return acc;
    }, []);

  const columns: GridColDef[] =
    everyKey &&
    everyKey.map((key) => ({
      field: key,
      valueFormatter: (params: GridValueFormatterParams) =>
        JSON.stringify(params.value, null, 2),
    }));

  const constructCompositeKey = (row: GridRowData) =>
    [row[hashKey], row[sortKey]].filter(Boolean).join("-");

  const rowData =
    items &&
    items.map<GridRowData>((row) => ({
      // Assign ID to the pk attribute
      id: constructCompositeKey(row),
      ...row,
    }));

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
