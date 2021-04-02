import { List, ListItem, ListItemText } from "@material-ui/core";
import { IndexDescription } from "@src/components/index-description";
import { ElectronStore } from "@src/contexts/electron-context";
import React, { ReactElement, useContext } from "react";

export const TableDescription = (): ReactElement => {
  const { table } = useContext(ElectronStore);

  return (
    <List dense disablePadding>
      {table && (
        <ListItem>
          <ListItemText
            primary="Created Date"
            secondary={
              table
                ? typeof table.Table.CreationDateTime.getMonth === "function"
                  ? table.Table.CreationDateTime.toLocaleDateString()
                  : table.Table.CreationDateTime
                : "None"
            }
          />
          <ListItemText
            primary="Item Count"
            secondary={table ? table.Table.ItemCount : "None"}
          />
        </ListItem>
      )}
      {table && (
        <IndexDescription
          {...{
            indexName: "Primary Index",
            keySchema: table.Table.KeySchema,
          }}
        />
      )}
      {table && table.Table.LocalSecondaryIndexes && (
        <ListItem>
          {table
            ? table.Table.LocalSecondaryIndexes.map((lsi) => (
                <IndexDescription
                  key={lsi.IndexName}
                  {...{
                    indexName: `LSI: ${lsi.IndexName}`,
                    keySchema: lsi.KeySchema,
                  }}
                />
              ))
            : "None"}
        </ListItem>
      )}
      {table && table.Table.GlobalSecondaryIndexes && (
        <>
          {table
            ? table.Table.GlobalSecondaryIndexes.map((gsi) => (
                <IndexDescription
                  key={gsi.IndexName}
                  {...{
                    indexName: `GSI: ${gsi.IndexName}`,
                    keySchema: gsi.KeySchema,
                  }}
                />
              ))
            : "None"}
        </>
      )}
    </List>
  );
};
