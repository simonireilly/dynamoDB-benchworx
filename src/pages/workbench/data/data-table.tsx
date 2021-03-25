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
  const [rows, setRows] = useState<Awaited<ReturnType<typeof scan>>["data"]>({
    Items: [
      {
        path: "one",
      },
    ],
  });

  console.info({ rows });

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

  const columns: GridColDef[] =
    rows &&
    rows.Items.length &&
    Object.keys(rows.Items[0]).map((key) => ({
      field: key,
    }));

  const rowData =
    rows &&
    rows.Items.length &&
    rows.Items.map((row) => ({
      id: row.path,
      ...row,
    }));

  return (
    <div style={{ height: 400, width: "100%" }}>
      {rows && rows.Items.length && (
        <DataGrid
          rows={rowData}
          columns={columns}
          pageSize={5}
          checkboxSelection
        />
      )}
      <pre>{JSON.stringify(rows, null, 2)}</pre>
    </div>
  );
};
