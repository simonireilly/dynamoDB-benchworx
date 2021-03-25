import React, { ReactElement, useContext } from "react";
import { ElectronStore } from "@src/contexts/electron-context";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { regions } from "@src/utils/aws/constants";
import { useStyles } from "@src/styles";

export const Region = (): ReactElement => {
  const { setCredentials, credentials, setNotification } = useContext(
    ElectronStore
  );
  const classes = useStyles();

  return (
    <div>
      <form noValidate autoComplete="off">
        <FormControl className={classes.formControl}>
          <Typography>Select an available region</Typography>
        </FormControl>
        <FormControl
          data-test="select-region"
          variant="filled"
          className={classes.formControl}
          margin="dense"
        >
          <InputLabel htmlFor="aws-select-region">Choose region</InputLabel>
          <Select
            value={credentials.region}
            onChange={async (e) => {
              const region = String(e.target.value);
              setCredentials((current) => ({
                ...current,
                ...{
                  region,
                },
              }));
              setNotification({
                type: "success",
                message: `Region change to ${region}`,
                details: null,
                data: null,
              });
            }}
            inputProps={{
              name: "Choose AWS region",
              id: "aws-select-region",
            }}
            autoWidth
            margin="dense"
          >
            {regions.map((region) => (
              <MenuItem value={region} key={region}>
                {region}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </form>
    </div>
  );
};
