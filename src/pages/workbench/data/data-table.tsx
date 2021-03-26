import React, { ReactElement, useContext, useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowData,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@material-ui/data-grid";
import { ElectronStore } from "@src/contexts/electron-context";

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

  console.info(hashKey);

  useEffect(() => {
    const init = async () => {
      const results = await scan(
        credentials.profile,
        credentials.region,
        table.Table.TableName
      );

      setHashKey(
        table.Table.KeySchema.find((el) => el.KeyType === "HASH").AttributeName
      );
      setSortKey(
        table.Table.KeySchema.find((el) => el.KeyType === "RANGE").AttributeName
      );
      setRows(results.data);
    };

    init();
  }, [table]);

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
      resizable: true,
      valueFormatter: (params: GridValueFormatterParams) => {
        if (Array.isArray(params.value) || typeof params.value === "object")
          return JSON.stringify(params.value, null, 2);
      },
    }));

  const rowData =
    rows &&
    rows.Items.length &&
    rows.Items.map<GridRowData>((row) => ({
      // Assign ID to the pk attribute
      id: [row[hashKey], row[sortKey]].filter(Boolean).join("-"),
      ...row,
    }));

  return (
    <div style={{ height: 400, width: "100%" }}>
      {rows && rows.Items.length > 0 && (
        <DataGrid
          rows={rowData}
          columns={columns}
          pageSize={25}
          checkboxSelection
          density="compact"
        />
      )}
    </div>
  );
};
