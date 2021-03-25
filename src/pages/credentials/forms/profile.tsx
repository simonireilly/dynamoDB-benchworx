import React, {
  ReactElement,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { ElectronStore } from "@src/contexts/electron-context";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  TextField,
  Typography,
  Button,
} from "@material-ui/core";
import { SafeProfile } from "@src/utils/aws/accounts/config";
import { useStyles } from "../../../styles";

export const Profile = (): ReactElement => {
  const {
    aws: { listTables, listAwsConfig },
    setCredentials,
    credentials,
    setNotification,
  } = useContext(ElectronStore);
  const classes = useStyles();
  const [config, setConfig] = useState<SafeProfile[]>([]);
  const [mfaRequire, setMfaRequired] = useState<boolean>(false);

  useEffect(() => {
    const setup = async () => {
      try {
        const configuration = await listAwsConfig();
        setConfig(configuration.data);
        setNotification(configuration);
      } catch (e) {
        console.error(e);
      }
    };

    setup();
  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const results = await listTables(
      credentials.profile,
      credentials.region,
      credentials.mfaCode
    );
    setNotification(results);
  };

  return (
    <div>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <FormControl className={classes.formControl}>
          <Typography>Select an available profile</Typography>
        </FormControl>
        <FormControl
          data-test="select-profile"
          variant="filled"
          className={classes.formControl}
          margin="dense"
        >
          <InputLabel htmlFor="aws-select-profile">Choose Profile</InputLabel>
          <Select
            value={credentials.profile}
            onChange={async (e) => {
              const profile = String(e.target.value);
              setCredentials((current) => ({
                ...current,
                ...{
                  profile,
                  mfaCode: "",
                },
              }));
              setMfaRequired(
                config.find((collection) => collection.profile === profile).mfa
              );
            }}
            inputProps={{
              name: "Choose AWS Account Profile",
              id: "aws-select-profile",
            }}
            autoWidth
            margin="dense"
          >
            {config &&
              config.map(({ profile, assumeRole, mfa }) => (
                <MenuItem
                  value={profile}
                  key={[profile, assumeRole, mfa].join("-")}
                >
                  <b>{profile}</b>
                </MenuItem>
              ))}
          </Select>
          <FormHelperText>
            These profiles were found on your local machine. To use another
            profile edit the <em>`~/.aws</em> files
          </FormHelperText>
        </FormControl>
        {mfaRequire && (
          <>
            <FormControl className={classes.formControl}>
              <TextField
                margin="dense"
                id="aws-mfa-code"
                label="AWS MFA Code"
                variant="filled"
                required={mfaRequire}
                value={credentials.mfaCode}
                onChange={(e) =>
                  setCredentials((current) => ({
                    ...current,
                    ...{
                      mfaCode: String(e.target.value),
                    },
                  }))
                }
                type="text"
              />
            </FormControl>
          </>
        )}
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
