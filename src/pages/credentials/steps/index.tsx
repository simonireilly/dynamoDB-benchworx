import React, { ReactElement } from "react";
import {
  makeStyles,
  Theme,
  createStyles,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
} from "@material-ui/core";
import { Account } from "../forms/account";
import { Roles } from "../forms/roles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
  })
);

function getSteps() {
  return [
    "Select AWS Account Profile, or Access Keys",
    "(Optional) Assume a Role using the chosen credentials",
  ];
}

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <Account />;
    case 1:
      return <Roles />;
    default:
      return "Unknown step";
  }
}

// TODO: Consider ditching steps, they obscure the form, although they look nice
export const Steps = (): ReactElement => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {getStepContent(index)}
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>You have an active session for the Account ID</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReset}
            className={classes.button}
          >
            Change Credentials
          </Button>
        </Paper>
      )}
    </div>
  );
};
