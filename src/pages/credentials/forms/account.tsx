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
  const { aws, setCredentials, credentials, clearCredentials } = useContext(
    ElectronStore
  );
  const classes = useStyles();
  const [config, setConfig] = useState(null);
  const [showAccessKey, setShowAccessKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const configuration = await aws.listCredentials();
        setConfig(configuration);
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
            value={credentials.profile}
            onChange={(e) => {
              const profile = String(e.target.value);
              if (!profile) return clearCredentials();
              setCredentials((current) => ({
                ...current,
                ...{
                  profile: String(e.target.value),
                  awsAccessKeyId: String(
                    config.credentialsFile[profile]["aws_access_key_id"]
                  ),
                  awsSecretAccessKey: String(
                    config.credentialsFile[profile]["aws_secret_access_key"]
                  ),
                },
              }));
            }}
            autoWidth
            inputProps={{
              name: "Choose AWS Account Profile",
              id: "aws-select-profile",
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {config &&
              Object.keys(config.credentialsFile).map((profile) => (
                <MenuItem value={profile} key={profile}>
                  {profile}
                </MenuItem>
              ))}
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
            value={credentials.awsAccessKeyId}
            type={showAccessKey ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowAccessKey((current) => !current)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showAccessKey ? <Visibility /> : <VisibilityOff />}
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
            value={credentials.awsSecretAccessKey}
            type={showSecretKey ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowSecretKey((current) => !current)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showSecretKey ? <Visibility /> : <VisibilityOff />}
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
