import React, { ReactElement, useContext } from "react";
import { ElectronStore } from "@src/contexts/electron-context";

import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { regions } from "@src/utils/aws/constants";

export const Region = (): ReactElement => {
  const { setCredentials, credentials } = useContext(ElectronStore);
  return (
    <Autocomplete
      id="autocomplete-region"
      size="small"
      options={regions}
      value={credentials.region}
      onChange={(event, newInputValue) => {
        setCredentials((current) => ({ ...current, region: newInputValue }));
      }}
      style={{ maxWidth: 180, width: 180 }}
      autoComplete
      autoHighlight
      autoSelect
      renderInput={(params) => (
        <TextField
          {...params}
          label="Region"
          variant="outlined"
          margin="dense"
        />
      )}
    />
  );
};
