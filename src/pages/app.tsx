import React, { ReactElement, useState } from "react";
import { ElectronContextProvider } from "@src/contexts/electron-context";

import { UI } from "../layout/ui";
import { AppBar, Box, Button, Tab, Tabs } from "@material-ui/core";

export const App = (): ReactElement => {
  // Store an array of workbenches, only onw
  // of which is the active workbench
  const [workBenches, setWorkBenches] = useState<ReactElement[]>([
    <ElectronContextProvider key={0}>
      <UI />
    </ElectronContextProvider>,
  ]);

  const [activeWorkBenchIndex, setActiveWorkBenchIndex] = useState<number>(0);

  const selectWorkBench = (event: React.ChangeEvent, newValue: number) => {
    setActiveWorkBenchIndex(newValue);
  };

  function TabPanel(props: {
    children?: React.ReactNode;
    index: any;
    value: any;
  }) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box>{children}</Box>}
      </div>
    );
  }

  function a11yProps(index: any) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <Box>
      <AppBar position="static" color="default">
        <Tabs
          value={activeWorkBenchIndex}
          onChange={selectWorkBench}
          indicatorColor="secondary"
          textColor="primary"
          variant="fullWidth"
          aria-label="action tabs example"
        >
          <Tab label="Workbench" {...a11yProps(0)} />
          <Tab label="Item Two" />
          <Tab label="Item Three" />
          <Button>Add +</Button>
        </Tabs>
      </AppBar>
      <TabPanel value={activeWorkBenchIndex} index={0}>
        {workBenches[0]}
      </TabPanel>
      <TabPanel value={activeWorkBenchIndex} index={1}>
        {workBenches[0]}
      </TabPanel>
    </Box>
  );
};
