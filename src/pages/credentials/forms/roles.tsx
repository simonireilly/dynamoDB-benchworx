import React, { ReactElement, useContext, useEffect, useState } from "react";
import { ElectronStore } from "../../contexts/electron-context";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
  createStyles,
  Theme,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 300,
    },
  })
);

export const Roles = (): ReactElement => {
  const classes = useStyles();

  const [role, setRole] = useState("");

  return (
    <div>
      <form noValidate autoComplete="off">
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel htmlFor="aws-select-role">
            Choose AWS Account Role
          </InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(String(e.target.value))}
            autoWidth
            inputProps={{
              name: "Choose AWS Account Role",
              id: "aws-select-role",
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            id="aws-role-arn"
            label="AWS Role ARN"
            type="text"
            variant="filled"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </form>
    </div>
  );
};
