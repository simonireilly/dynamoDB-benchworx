import { makeStyles, createStyles, Theme } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      padding: theme.spacing(1),
      minWidth: 151,
    },
    workbench: {
      padding: theme.spacing(1),
      margin: "auto",
    },
  })
);
