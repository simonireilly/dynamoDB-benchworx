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
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 300,
    },
  })
);

export const Account = (): ReactElement => {
  const { aws } = useContext(ElectronStore);
  const classes = useStyles();

  const [credentials, setCredentials] = useState({});
  const [profile, setProfile] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const configuration = await aws.listCredentials();
        setCredentials(configuration);
      } catch (e) {
        console.error(e);
      }
    };

    fetchCredentials();
  }, []);

  return (
    <div>
      <form noValidate autoComplete="off">
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel htmlFor="aws-select-profile">
            Choose AWS Account Profile
          </InputLabel>
          <Select
            value={profile}
            onChange={(e) => setProfile(String(e.target.value))}
            autoWidth
            inputProps={{
              name: "Choose AWS Account Profile",
              id: "aws-select-profile",
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
            These profiles were found on your local machine. To use another
            profile edit the <em>`~/.aws</em> files
          </FormHelperText>
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            id="aws-access-key-id"
            label="AWS Access Key ID"
            variant="filled"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((current) => !current)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            id="aws-secret-access-key"
            label="AWS Secret Access Key"
            variant="filled"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((current) => !current)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </form>
    </div>
  );
};
