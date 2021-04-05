import React, { ReactElement, useState } from "react";
import { FormControl, Box } from "@material-ui/core";
import { useStyles } from "@src/styles";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { Scan } from "@src/pages/workbench/settings/query-planner/scan";
import { Query } from "@src/pages/workbench/settings/query-planner/query";

export const QueryPlanner = (): ReactElement => {
  const classes = useStyles();
  const [operation, setOperation] = useState<string | null>("scan");

  const handleOperation = (
    event: React.MouseEvent<HTMLElement>,
    newOperation: string | null
  ) => {
    setOperation(newOperation);
  };

  return (
    <Box display="flex" alignItems="flex-start" flexDirection="column" p={1}>
      <FormControl
        data-test="toggle-operation"
        variant="outlined"
        className={classes.formControl}
        margin="dense"
      >
        <ToggleButtonGroup
          size="small"
          value={operation}
          exclusive
          onChange={handleOperation}
          aria-label="dynamodb operation"
        >
          <ToggleButton value="scan" aria-label="scan dynamodb">
            Scan
          </ToggleButton>
          <ToggleButton value="query" aria-label="query dynamodb">
            Query
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>
      {operation === "scan" ? <Scan /> : <Query />}
    </Box>
  );
};
