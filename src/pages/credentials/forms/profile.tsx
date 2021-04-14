import React, {
  ReactElement,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { ElectronStore } from "@src/contexts/electron-context";

import {
  Backdrop,
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  NativeSelect,
  TextField,
  Typography,
} from "@material-ui/core";
import { SafeProfile } from "@src/utils/aws/accounts/config";
import { useStyles } from "@src/styles";

export const Profile = (): ReactElement => {
  const {
    aws: { authenticator, listAwsConfig },
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

  const auth = async () => {
    if (mfaRequire && credentials.mfaCode.length === 6) {
      const response = await authenticator({
        profile: credentials.profile,
        mfaCode: credentials.mfaCode,
      });
      setNotification(response);
    }
  };

  useEffect(() => {
    auth();
  }, [credentials.profile, credentials.mfaCode]);

  const handleProfileChange = async (
    e: React.ChangeEvent<{
      name?: string;
      value: unknown;
    }>
  ) => {
    const profile = String(e.target.value);

    const mfaIsRequired = config.find(
      (collection) => collection.profile === profile
    ).mfa;

    setCredentials((current) => ({
      ...current,
      ...{
        profile,
        mfaCode: "",
      },
    }));

    setMfaRequired(mfaIsRequired);
    setOpen(mfaIsRequired);

    if (!mfaIsRequired) {
      await authenticator({ profile, mfaCode: "" });
    }
  };

  const [open, setOpen] = useState(mfaRequire);

  const handleMfaSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    auth();
    setOpen(false);
  };

  return (
    <div>
      <Backdrop className={classes.backdrop} open={open}>
        <Card>
          <Box p={4} display="flex" flexDirection="column">
            <form onSubmit={handleMfaSubmit}>
              <Typography>
                Multi-Factor Authentication is required for this account.
              </Typography>
              <br />
              <TextField
                data-test="input-mfa"
                margin="dense"
                id="aws-mfa-code"
                label="AWS MFA Code"
                variant="outlined"
                required={mfaRequire}
                value={credentials.mfaCode}
                focused={mfaRequire && !credentials.mfaCode}
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
              <br />
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <Button variant="contained" type="submit" color="primary">
                  Authenticate
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setOpen(false)}
                  color="secondary"
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Box>
        </Card>
      </Backdrop>
      <FormControl
        data-testid="select-profile"
        variant="outlined"
        className={classes.formControl}
        margin="dense"
      >
        <InputLabel htmlFor="aws-select-profile">profile</InputLabel>
        <NativeSelect
          value={credentials.profile}
          onChange={(e) => handleProfileChange(e)}
          inputProps={{
            name: "Choose AWS Account Profile",
            id: "aws-select-profile",
          }}
          margin="dense"
          variant="outlined"
          data-testid="select-profile-options"
        >
          {config &&
            config.map(({ profile, assumeRole, mfa }) => (
              <option
                value={profile}
                key={[profile, assumeRole, mfa].join("-")}
              >
                {profile}
              </option>
            ))}
        </NativeSelect>
      </FormControl>
    </div>
  );
};
