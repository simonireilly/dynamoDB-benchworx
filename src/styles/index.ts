import { makeStyles, createStyles, Theme } from "@material-ui/core";

const mainHeight = "84vh";
const halfMainHeight = "42vh";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      padding: theme.spacing(1),
      minWidth: 151,
    },
    main: {
      height: mainHeight,
    },
    workbench: {
      height: "100%",
    },
    section: {
      height: halfMainHeight,
      maxHeight: halfMainHeight,
    },
    sidebar: {
      height: "100%",
    },
    tableDescription: {
      maxHeight: "80%",
      overflowY: "scroll",
      overflowX: "hidden",
    },
    listSection: {
      backgroundColor: "inherit",
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    "@global": {
      "*::-webkit-scrollbar": {
        width: "2px",
      },
      "*::-webkit-scrollbar-track": {
        "-webkit-box-shadow": "inset 0 0 3px rgba(0,0,0,0.00)",
      },
      "*::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(0,0,0,.1)",
        outline: "1px solid gainsboro",
      },
    },
  })
);
