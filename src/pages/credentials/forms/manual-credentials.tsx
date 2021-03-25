import React, {
  ReactElement,
  SyntheticEvent,
  useContext,
  useState,
} from "react";
import { ElectronStore } from "@src/contexts/electron-context";

import {
  FormControl,
  makeStyles,
  createStyles,
  Theme,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Button,
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

export const ManualCredentials = (): ReactElement => {
  const {
    aws: { listTables },
    setCredentials,
    credentials,
    setNotification,
  } = useContext(ElectronStore);
  const classes = useStyles();

  const [showAccessKey, setShowAccessKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const results = await listTables(credentials.profile, credentials.mfaCode);
    setNotification(results);
  };

  return (
    <div>
      <form noValidate autoComplete="off">
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
        <FormControl className={classes.formControl}>
          <div>
            <Button type="submit" variant="contained" color="secondary">
              Authenticate
            </Button>
          </div>
        </FormControl>
      </form>
    </div>
  );
};
