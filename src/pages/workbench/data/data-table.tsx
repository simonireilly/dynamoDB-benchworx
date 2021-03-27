import React, { ReactElement, useContext, useEffect, useState } from "react";
import ReactJson from "react-json-view";
import {
  DataGrid,
  GridColDef,
  GridRowData,
  GridValueFormatterParams,
} from "@material-ui/data-grid";
import { ElectronStore } from "@src/contexts/electron-context";
import {
  AppBar,
  Box,
  Card,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

// Takes in a table name and performs a scan to get the data
export const DataTable = (): ReactElement => {
  const {
    aws: { scan },
    credentials,
    table,
  } = useContext(ElectronStore);
  const [rows, setRows] = useState<Awaited<ReturnType<typeof scan>>["data"]>();
  const [hashKey, setHashKey] = useState<string>("");
  const [sortKey, setSortKey] = useState<string>("");

  const [value, setValue] = useState("one");

  const [tabPanels, setTabPanels] = useState<
    { tab: ReactElement; panel: ReactElement }[]
  >([]);

  const handleChange = (event: React.ChangeEvent, newValue: string) => {
    console.info({ newValue });
    setValue(newValue);
  };

  useEffect(() => {
    const init = async () => {
      if (table?.Table?.TableName === undefined) return;

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

  if (!rows) return <></>;

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

  const rowData =
    rows &&
    rows.Items.length &&
    rows.Items.map<GridRowData>((row) => ({
      // Assign ID to the pk attribute
      id: [row[hashKey], row[sortKey]].filter(Boolean).join("-"),
      ...row,
    }));

  const a11yProps = (index: any) => {
    return {
      id: `wrapped-tab-${index}`,
      "aria-controls": `wrapped-tabpanel-${index}`,
    };
  };

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    console.info(value);
    console.info(index);
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`wrapped-tabpanel-${index}`}
        aria-labelledby={`wrapped-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  return (
    <Paper style={{ height: "80vh", width: "100%" }}>
      <Card style={{ height: "35vh" }}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="selected item tabs"
          >
            {tabPanels && tabPanels.map(({ tab }) => tab)}
          </Tabs>
        </AppBar>
        {tabPanels && tabPanels.map(({ panel }) => panel)}
      </Card>
      {rows && rows.Items.length > 0 && (
        <DataGrid
          rows={rowData}
          onRowSelected={(params) => {
            setTabPanels((current) => [
              ...current,
              {
                tab: (
                  <Tab
                    value={params.data[hashKey]}
                    label={params.data[hashKey]}
                    key={params.data[hashKey]}
                    {...a11yProps(params.data[hashKey])}
                  />
                ),
                panel: (
                  <TabPanel
                    value={value}
                    index={params.data[hashKey]}
                    key={params.data[hashKey]}
                  >
                    <ReactJson src={params.data} />
                  </TabPanel>
                ),
              },
            ]);
            setValue(params.data[hashKey]);
          }}
          columns={columns}
          pageSize={5}
          checkboxSelection
          autoHeight
          density="compact"
        />
      )}
    </Paper>
  );
};
