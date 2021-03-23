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
  Snackbar,
  Divider,
} from "@material-ui/core";
import { Alert, Color } from "@material-ui/lab";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { PreloaderResponse } from "../../../preload";
import { ListTablesCommandOutput } from "@aws-sdk/client-dynamodb";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 300,
    },
  })
);

export const Account = (): ReactElement => {
  const {
    aws: { listTables, loadSharedConfigFiles },
    setCredentials,
    credentials,
  } = useContext(ElectronStore);
  const classes = useStyles();
  const [config, setConfig] = useState(null);
  const [results, setResults] = useState<
    PreloaderResponse<ListTablesCommandOutput>
  >({
    message: "No access to Dynamo",
    type: "warning",
    data: null,
    details: null,
  });
  const [showAccessKey, setShowAccessKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        const configuration = await loadSharedConfigFiles();
        setConfig(configuration);

        const newResults = await listTables(credentials.profile);
        setResults(newResults);
      } catch (e) {
        console.error(e);
      }
    };

    setup();
  }, []);

  // TODO: Encapsulate this logic in the credential fetcher
  const profiles: { profile: string; type: string }[] = config
    ? [
        ...Object.keys(config.configFile).map((profile) => ({
          profile,
          type: "config",
        })),
        ...Object.keys(config.credentialsFile).map((profile) => ({
          profile,
          type: "credential",
        })),
      ]
    : [];

  return (
    <div>
      <Snackbar open={!!results} autoHideDuration={6000}>
        <Alert severity={(results.type as Color) || "info"}>
          {results.message}
          <Divider variant="fullWidth" />
          {results.details}
        </Alert>
      </Snackbar>
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
            onChange={async (e) => {
              const profile = String(e.target.value);
              setCredentials((current) => ({
                ...current,
                ...{
                  profile,
                },
              }));
              const newResults = await listTables(profile);
              setResults(newResults);
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
              profiles.map((profile) => (
                <MenuItem
                  value={profile.profile}
                  key={profile.profile + profile.type}
                >
                  <b>{profile.profile}</b>-<em>{profile.type}</em>
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
