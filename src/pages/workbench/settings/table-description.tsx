import { List, ListItem, ListItemText, ListSubheader } from "@material-ui/core";
import { ElectronStore } from "@src/contexts/electron-context";
import React, { ReactElement, useContext } from "react";

export const TableDescription = (): ReactElement => {
  const { table } = useContext(ElectronStore);

  console.info(table);

  return (
    <List dense>
      <ListSubheader>Info</ListSubheader>
      <ListItem>
        <ListItemText
          primary="Created Date"
          secondary={table ? table.Table.CreationDateTime : "None"}
        />
        <ListItemText
          primary="Item Count"
          secondary={table ? table.Table.ItemCount : "None"}
        />
      </ListItem>
      <ListSubheader>Primary Index</ListSubheader>
      <ListItem>
        <ListItemText
          primary="Primary Key"
          secondary={
            table
              ? table.Table.KeySchema.find((entry) => entry.KeyType === "HASH")
                  .AttributeName
              : "None"
          }
        />
        <ListItemText
          primary="Sort Key"
          secondary={
            table
              ? table.Table.KeySchema.find((entry) => entry.KeyType === "RANGE")
                  ?.AttributeName
              : "None"
          }
        />
      </ListItem>
      {table && table.Table.LocalSecondaryIndexes && (
        <ListItem>
          <ListSubheader>Local Secondary Indexes</ListSubheader>
          {table
            ? table.Table.LocalSecondaryIndexes.map((lsi) => (
                <>{lsi.IndexName}</>
              ))
            : "None"}
        </ListItem>
      )}
      {table && table.Table.GlobalSecondaryIndexes && (
        <>
          <ListSubheader>Global Secondary Indexes</ListSubheader>
          {table
            ? table.Table.GlobalSecondaryIndexes.map((gsi) => (
                <>
                  <ListSubheader>{gsi.IndexName}</ListSubheader>
                  <ListItem key={gsi.IndexName}>
                    <ListItemText
                      primary="Primary Key"
                      secondary={
                        gsi.KeySchema.find((entry) => entry.KeyType === "HASH")
                          .AttributeName || "None"
                      }
                    />
                    <ListItemText
                      primary="Sort Key"
                      secondary={
                        gsi.KeySchema.find((entry) => entry.KeyType === "RANGE")
                          ?.AttributeName || "None"
                      }
                    />
                  </ListItem>
                </>
              ))
            : "None"}
        </>
      )}
    </List>
  );
};
