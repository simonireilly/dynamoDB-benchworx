import React, {
  ChangeEvent,
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
  NativeSelect,
  FormHelperText,
  TextField,
  Typography,
} from "@material-ui/core";
import { SafeProfile } from "@src/utils/aws/accounts/config";
import { useStyles } from "../../../styles";
import { Autocomplete } from "@material-ui/lab";

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

  useEffect(() => {
    const auth = async () => {
      if (mfaRequire && credentials.mfaCode.length === 6)
        await authenticator({
          profile: credentials.profile,
          mfaCode: credentials.mfaCode,
        });
    };

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

    if (!mfaIsRequired) {
      await authenticator({ profile, mfaCode: "" });
    }
  };

  return (
    <div>
      <FormControl
        data-test="select-profile"
        variant="filled"
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
      <TextField
        data-test="input-mfa"
        margin="dense"
        id="aws-mfa-code"
        label="AWS MFA Code"
        variant="filled"
        required={mfaRequire}
        disabled={!mfaRequire}
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
    </div>
  );
};
