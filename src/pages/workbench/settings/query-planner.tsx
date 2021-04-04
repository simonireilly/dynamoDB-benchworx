import React, {
  ReactElement,
  SyntheticEvent,
  useContext,
  useState,
} from "react";
import {
  ButtonGroup,
  Button,
  InputLabel,
  NativeSelect,
  TextField,
  FormControl,
  Box,
} from "@material-ui/core";
import { DescribeTableCommandOutput } from "@aws-sdk/client-dynamodb";
import { ElectronStore } from "@src/contexts/electron-context";
import { useStyles } from "@src/styles";

export const QueryPlanner = (): ReactElement => {
  const { table } = useContext(ElectronStore);
  const classes = useStyles();
  const [selected, setSelected] = useState<
    Partial<DescribeTableCommandOutput["Table"]>
  >();

  const handleTableSelection = (e: SyntheticEvent) => {
    console.info({ target: e.currentTarget.nodeValue });
  };

  return (
    <Box display="flex" alignItems="flex-start" flexDirection="column" p={1}>
      <ButtonGroup
        variant="text"
        color="primary"
        aria-label="text primary button group"
      >
        <Button>Query</Button>
        <Button>Scan</Button>
      </ButtonGroup>
      <FormControl
        data-test="select-profile"
        variant="outlined"
        className={classes.formControl}
        margin="dense"
      >
        <InputLabel htmlFor="select">Table or Index</InputLabel>
        <NativeSelect
          id="select"
          margin="dense"
          variant="outlined"
          value={selected}
          onChange={handleTableSelection}
        >
          {table && (
            <option value={table.Table.TableName}>
              {table.Table.TableName}
            </option>
          )}
          {table && table.Table.LocalSecondaryIndexes && (
            <optgroup label="Local Secondary Indexes">
              {table.Table.LocalSecondaryIndexes.map((lsi) => (
                <option value={lsi.IndexName} key={lsi.IndexName}>
                  {lsi.IndexName}
                </option>
              ))}
            </optgroup>
          )}
          {table && table.Table.GlobalSecondaryIndexes && (
            <optgroup label="Global Secondary Indexes">
              {table.Table.GlobalSecondaryIndexes.map((gsi) => (
                <option value={gsi.IndexName} key={gsi.IndexName}>
                  {gsi.IndexName}
                </option>
              ))}
            </optgroup>
          )}
        </NativeSelect>
      </FormControl>
      <FormControl
        data-test="enter-pk"
        variant="outlined"
        className={classes.formControl}
        margin="dense"
      >
        <TextField
          id="text-pk"
          label="(Primary Key)"
          variant="outlined"
          margin="dense"
        />
      </FormControl>
      <FormControl
        data-test="enter-sk"
        variant="outlined"
        className={classes.formControl}
        margin="dense"
      >
        <TextField
          id="text-sk"
          label="(Sort Key)"
          variant="outlined"
          margin="dense"
        />
      </FormControl>
    </Box>
  );
};
