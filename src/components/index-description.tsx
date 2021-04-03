import type { DescribeTableCommandOutput } from "@aws-sdk/client-dynamodb";
import { List, ListItem, ListItemText, Collapse } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useState, ReactElement } from "react";

export type Props = {
  keySchema: DescribeTableCommandOutput["Table"]["KeySchema"];
  indexName: string;
};

export const IndexDescription = ({
  keySchema,
  indexName,
}: Props): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ListItem button onClick={() => setOpen((o) => !o)}>
        <ListItemText primary={indexName} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto">
        <List component="div" disablePadding>
          <ListItem key={indexName}>
            <ListItemText
              primary="Primary Key"
              secondary={
                keySchema.find((entry) => entry.KeyType === "HASH")
                  .AttributeName || "None"
              }
            />
            <ListItemText
              primary="Sort Key"
              secondary={
                keySchema.find((entry) => entry.KeyType === "RANGE")
                  ?.AttributeName || "None"
              }
            />
          </ListItem>
        </List>
      </Collapse>
    </>
  );
};
