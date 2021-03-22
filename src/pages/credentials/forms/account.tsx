import React, { ReactElement, useContext, useEffect, useState } from "react";
import { ElectronStore } from "../../../contexts/electron-context";

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
  Typography,
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
        const configuration = await aws.loadSharedConfigFiles();
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
        <FormControl className={classes.formControl}>
          <Typography>Select an available profile</Typography>
        </FormControl>
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel htmlFor="aws-select-profile">
            Choose AWS Account Profile
          </InputLabel>
          <Select
            value={credentials.profile}
            onChange={(e) => {
              const profile = String(e.target.value);
              setCredentials((current) => ({
                ...current,
                ...{
                  profile,
                },
              }));
            }}
            inputProps={{
              name: "Choose AWS Account Profile",
              id: "aws-select-profile",
            }}
            autoWidth
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
          <Typography>Enter credentials manually</Typography>
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            id="aws-access-key-id"
            label="AWS Access Key ID"
            variant="filled"
            disabled={credentials.profile !== ""}
            value={credentials.awsAccessKeyId}
            onChange={(e) =>
              setCredentials((current) => ({
                ...current,
                ...{
                  awsAccessKeyId: String(e.target.value),
                },
              }))
            }
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
            disabled={credentials.profile !== ""}
            type={showSecretKey ? "text" : "password"}
            onChange={(e) =>
              setCredentials((current) => ({
                ...current,
                ...{
                  awsSecretAccessKey: String(e.target.value),
                },
              }))
            }
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
