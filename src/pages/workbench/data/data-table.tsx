import React, { ReactElement, useContext, useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowData,
  GridRowSelectedParams,
  GridValueFormatterParams,
} from "@material-ui/data-grid";
import { ElectronStore } from "@src/contexts/electron-context";
import { Paper } from "@material-ui/core";
import { useStyles } from "@src/styles";

// TODO: Rep[lace with react table as we will not use the complex functions
// we currently only need an onclick to set the current item
export const DataTable = (): ReactElement => {
  const {
    aws: { scan },
    credentials,
    table,
    setItem,
  } = useContext(ElectronStore);
  const classes = useStyles();
  const [rows, setRows] = useState<Awaited<ReturnType<typeof scan>>["data"]>();
  const [hashKey, setHashKey] = useState<string>("");
  const [sortKey, setSortKey] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      if (table?.Table?.TableName === undefined)
        return setRows({
          Items: [],
          $metadata: {},
        });

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
    console.info("selected");
    const { data } = params;
    setItem(data);
  };

  return (
    <Paper className={classes.workbench}>
      {rows && rows.Items.length > 0 && (
        <DataGrid
          rows={rowData}
          onRowSelected={handleRowSelection}
          columns={columns}
          pageSize={25}
          density="compact"
        />
      )}
    </Paper>
  );
};
