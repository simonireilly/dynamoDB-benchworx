import React, { ReactElement, useContext } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowData,
  GridRowSelectedParams,
  GridValueFormatterParams,
} from "@material-ui/data-grid";
import { ElectronStore } from "@src/contexts/electron-context";

type Props = {
  items: { [key: string]: any }[];
  hashKey: string;
  sortKey: string;
};

export const DataTable = ({ items, hashKey, sortKey }: Props): ReactElement => {
  const { setItem } = useContext(ElectronStore);

  const everyKey: string[] =
    items.length &&
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
    items.length &&
    items.map<GridRowData>((row) => ({
      // Assign ID to the pk attribute
      // TODO: SOmetimes there is a column already called ID, and this causes the
      // table to break because it will override the id to another value
      //
      // Since we are only using the onClick for this data table we could replace
      // it with a simpler, dynamoDB specific table
      id: constructCompositeKey(row),
      ...row,
    }));

  const handleRowSelection = (params: GridRowSelectedParams) => {
    const { data } = params;
    setItem(data);
  };

  return items.length > 0 ? (
    <DataGrid
      rows={rowData}
      onRowSelected={handleRowSelection}
      columns={columns}
      pageSize={25}
      density="compact"
    />
  ) : (
    <></>
  );
};
