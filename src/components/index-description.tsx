import { List, ListItem, ListItemText, Collapse } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { ElectronStore } from "@src/contexts/electron-context";
import { getKeySchema } from "@src/utils/aws/dynamo/items";
import React, { useState, ReactElement, useContext, useMemo } from "react";

export type Props = {
  indexName: string;
};

export const IndexDescription = ({ indexName }: Props): ReactElement => {
  const { table } = useContext(ElectronStore);
  const [open, setOpen] = useState(false);

  const keySchema = useMemo<ReturnType<typeof getKeySchema> | void>(() => {
    return table?.Table && getKeySchema(table.Table.KeySchema);
  }, [indexName]);

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
              secondary={keySchema && keySchema.hashKey}
            />
            <ListItemText
              primary="Sort Key"
              secondary={keySchema && keySchema.sortKey}
            />
          </ListItem>
        </List>
      </Collapse>
    </>
  );
};
