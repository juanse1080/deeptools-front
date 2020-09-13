import React, { useState, useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepButton from '@material-ui/core/StepButton'
import Button from '@material-ui/core/Button'

import axios from 'axios'

import { Protocol, Structure, ModelDetail } from './components'

import { example as options } from 'utils'

import validate from 'validate.js'

import { host, ws, authHeaderJSON, history } from 'helpers'
import { red } from '@material-ui/core/colors'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(3),
    }
  },
  stepper: {
    backgroundColor: 'transparent',
    paddingBottom: theme.spacing(3),
    padding: 0,
  },
  button: {
    marginRight: theme.spacing(1),
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  buttons: {
    marginTop: theme.spacing(2),
  },
  completed: {
    display: 'inline-block',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))

export default function Detail({ module }) {
  const classes = useStyles()
  const [step, setStep] = useState(0)

  const handleStep = (newStep) => () => {
    setStep(newStep)
  }

  console.log(module)

  const steps = [
    {
      label: 'Data collection',
      content: <Protocol value={module.protocol} />
    },
    {
      label: 'Representation',
      content: <Structure elements={module.elements} />
    },
    {
      label: 'Model detail',
      content: <ModelDetail value={module} />
    },
  ]

  return <div className={classes.root}>
    <Stepper alternativeLabel nonLinear activeStep={step} classes={{ root: classes.stepper }}>
      {
        steps.map(({ label }, item) =>
          <Step key={label}>
            <StepButton onClick={handleStep(item)} >
              {label}
            </StepButton>
          </Step>
        )
      }
    </Stepper>
    {steps[step].content}
    <div className={classes.buttons}>
      <Button disabled={step === 0} onClick={handleStep(step - 1)} className={classes.backButton}>Back</Button>
      <Button disabled={step === 2} variant="outlined" onClick={handleStep(step + 1)}>
        Next
      </Button>
    </div>
  </div >
}
