import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import { ElectronStore } from "../contexts/electron-context";

export const Credentials = (): ReactElement => {
  const { aws } = useContext(ElectronStore);

  const [credentials, setCredentials] = useState({});

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

  const handleChange = () => {
    return "";
  };

  return (
    <>
      <FormControl component="fieldset">
        <FormLabel component="legend">Gender</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={credentials}
          onChange={handleChange}
        >
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
          <FormControlLabel
            value="disabled"
            disabled
            control={<Radio />}
            label="(Disabled option)"
          />
        </RadioGroup>
      </FormControl>
      <pre>
        <h1>AWS Credentials available for configuration</h1>;
        <pre>{JSON.stringify(credentials, null, 2)}</pre>
      </pre>
    </>
  );
};
