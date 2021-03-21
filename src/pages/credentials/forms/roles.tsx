import React, { ReactElement, useState } from "react";

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
  FormHelperText,
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

// Todo, find roles for the source_profile, so they can be assumed as an STSAssumeRole
// call, with the given credentials.
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
          <FormHelperText>
            If the Profile selected is referenced as a{" "}
            <code>source_profile</code> for any roles, they will appear above
          </FormHelperText>
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
