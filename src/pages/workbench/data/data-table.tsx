import React, { ReactElement, useContext, useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { ElectronStore } from "@src/contexts/electron-context";

// Takes in a table name and performs a scan to get the data
export const DataTable = (): ReactElement => {
  const {
    aws: { scan },
    credentials,
    table,
  } = useContext(ElectronStore);
  const [rows, setRows] = useState<Awaited<ReturnType<typeof scan>>["data"]>();

  useEffect(() => {
    const init = async () => {
      const results = await scan(
        credentials.profile,
        credentials.region,
        table,
        credentials.mfaCode
      );

      console.info("Rows", { rows: results.data });
      setRows(results.data);
    };

    init();
  }, [table]);

  if (!rows) return <></>;

  const allKeys: string[] = [];

  const everyKey: string[] =
    rows &&
    rows.Items.length &&
    rows.Items.reduce((acc, item) => {
      Object.keys(item).forEach((key) => {
        if (acc.indexOf(key) < 0) acc.push(key);
      });

      return acc;
    }, allKeys);

  const columns: GridColDef[] =
    everyKey &&
    everyKey.map((key) => ({
      field: key,
    }));

  const rowData =
    rows &&
    rows.Items.length &&
    rows.Items.map((row) => ({
      id: row.path,
      ...Object.entries(row).reduce((acc, [key, value]) => {
        acc[key] = JSON.stringify(value);
        return acc;
      }, {}),
    }));

  return (
    <div style={{ height: 400, width: "100%" }}>
      {rows && rows.Items.length > 0 && (
        <DataGrid
          rows={rowData}
          columns={columns}
          pageSize={5}
          checkboxSelection
        />
      )}
    </div>
  );
};
