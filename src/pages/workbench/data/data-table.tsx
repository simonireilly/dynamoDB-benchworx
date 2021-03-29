import React, { ReactElement, useContext, useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowData,
  GridRowSelectedParams,
  GridValueFormatterParams,
} from "@material-ui/data-grid";
import { ElectronStore } from "@src/contexts/electron-context";
import { Card, Paper } from "@material-ui/core";
import Editor from "@monaco-editor/react";

interface Item {
  name: string;
  language: string;
  value: string;
}

// Takes in a table name and performs a scan to get the data
export const DataTable = (): ReactElement => {
  const {
    aws: { scan },
    credentials,
    table,
  } = useContext(ElectronStore);
  const [rows, setRows] = useState<Awaited<ReturnType<typeof scan>>["data"]>();
  const [hashKey, setHashKey] = useState<string>("");
  const [sortKey, setSortKey] = useState<string>("");

  const [items, setItems] = useState<{ [key: string]: Item }>({});
  const [activeItem, setActiveItem] = useState<string>();

  useEffect(() => {
    const init = async () => {
      if (table?.Table?.TableName === undefined) return;

      const results = await scan(
        credentials.profile,
        credentials.region,
        table?.Table?.TableName
      );

      setHashKey(
        table.Table.KeySchema.find((el) => el.KeyType === "HASH")?.AttributeName
      );
      setSortKey(
        table.Table.KeySchema.find((el) => el.KeyType === "RANGE")
          ?.AttributeName
      );
      setRows(results.data);
    };

    init();
  }, [table?.Table?.TableName]);

  if (!rows) return <></>;

  const everyKey: string[] =
    rows &&
    rows.Items.length &&
    rows.Items.reduce<string[]>((acc, item) => {
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
    rows &&
    rows.Items.length &&
    rows.Items.map<GridRowData>((row) => ({
      // Assign ID to the pk attribute
      id: constructCompositeKey(row),
      ...row,
    }));

  const handleRowSelection = (params: GridRowSelectedParams) => {
    const { data, isSelected } = params;
    const name = constructCompositeKey(data);

    setItems((current) => {
      if (isSelected) {
        return {
          ...current,
          [name]: {
            value: JSON.stringify(data, null, 2),
            name,
            language: "json",
          },
        };
      } else {
        delete current[name];
        return current;
      }
    });
    setActiveItem(constructCompositeKey(params.data));
  };

  return (
    <Paper style={{ height: "88vh", width: "100%" }}>
      <Card style={{ height: "35vh" }}>
        {Object.keys(items).map((name) => (
          <button
            disabled={activeItem === name}
            key={name}
            onClick={() => setActiveItem(name)}
          >
            {name}
          </button>
        ))}
        <Editor
          theme="vs-dark"
          path={items[activeItem]?.name}
          defaultLanguage={items[activeItem]?.language}
          defaultValue={items[activeItem]?.value}
        />
      </Card>
      {rows && rows.Items.length > 0 && (
        <DataGrid
          rows={rowData}
          onRowSelected={handleRowSelection}
          columns={columns}
          pageSize={5}
          checkboxSelection
          autoHeight
          density="compact"
        />
      )}
    </Paper>
  );
};
