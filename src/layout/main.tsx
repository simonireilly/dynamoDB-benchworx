import React, { ReactElement } from "react";

import { DataTable } from "@src/pages/workbench/data/data-table";
import { Box, Paper } from "@material-ui/core";
import { QueryPlanner } from "@src/pages/workbench/settings/query-planner";
import { ItemViewer } from "@src/pages/workbench/data/item-viewier";

export const Main = (): ReactElement => {
  return (
    <Paper>
      <Box
        display="flex"
        p={1}
        flexDirection="row"
        alignItems=""
        justifyContent="center"
        width="100%"
        height="88vh"
      >
        <Box flexGrow={1} minWidth="400px">
          <QueryPlanner />
        </Box>
        <Box flexGrow={2} display="flex" flexDirection="column" p={2}>
          <Box flex={1}>
            <ItemViewer />
          </Box>
          <Box flex={1}>
            <DataTable />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
