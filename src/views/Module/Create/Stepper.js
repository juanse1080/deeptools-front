import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';

import axios from 'axios';

import { useDispatch } from 'react-redux';
import { actions } from '_redux';

import { Protocol, Structure, ModelDetail } from './components';

import { example as options, error } from 'utils';

import validate from 'validate.js';

import { host, ws, authHeaderJSON, history } from 'helpers';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(3)
      // backgroundColor: theme.palette.white
    }
  },
  stepper: {
    backgroundColor: 'transparent',
    paddingBottom: theme.spacing(3),
    padding: 0
  },
  button: {
    marginRight: theme.spacing(1)
  },
  backButton: {
    marginRight: theme.spacing(1)
  },
  buttons: {
    marginTop: theme.spacing(2)
  },
  completed: {
    display: 'inline-block'
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

const rulesOne = {
  protocol: {
    presence: {
      allowEmpty: false,
      message: '^The data collection protocol definition field cannot be empty.'
    }
  }
};

const rulesTwo = {
  elements: {
    presence: {
      allowEmpty: false,
      message:
        '^There is an error in the construction of the data structure, reload the page and try again.'
    }
  }
};

const rulesThree = {
  name: {
    presence: {
      allowEmpty: false,
      message: '^The name field cannot be empty.'
    }
  },
  image: {
    presence: {
      allowEmpty: false,
      message: '^The image field cannot be empty.'
    }
  },
  workdir: {
    presence: {
      allowEmpty: false,
      message: '^The path field cannot be empty.'
    }
  },
  file: {
    presence: {
      allowEmpty: false,
      message: '^The filename field cannot be empty.'
    }
  },
  classname: {
    presence: {
      allowEmpty: false,
      message: '^The classname field cannot be empty.'
    }
  },
  background: {
    presence: {
      allowEmpty: false,
      message: '^Select an image that represents your algorithm.'
    }
  },
  description: {
    presence: {
      allowEmpty: false,
      message: '^The description field cannot be empty.'
    }
  }
};

export default function Steppers() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const ref = useRef(null);

  const [step, setStep] = useState(0);
  const [protocol, setProtocol] = useState('');
  const [details, setDetails] = useState({
    name: '',
    image: '',
    workdir: '',
    file: '',
    classname: '',
    description: '',
    view: 0,
    extensions: '',
    background: ''
  });
  const [elements, setElements] = useState({
    input: { state: true, len: 0, value: 'video' },
    response: { state: true, len: 0, value: 'text' },
    output: { state: true, len: 0, value: 'video' },
    graph: { state: true, len: 1, value: options }
  });
  const [form, setForm] = useState({ errors: {} });

  const handleElements = name => ({ value, len }) => {
    setElements({
      ...elements,
      [name]: { ...elements[name], value: value, len: len }
    });
  };

  const checkElements = (name, value) => {
    setElements({ ...elements, [name]: { ...elements[name], state: value } });
  };

  const handleProtocol = value => {
    console.log(value);
    setProtocol(value);
  };

  const handleDetails = (name, value) => {
    setDetails({ ...details, [name]: value });
  };

  const handleStep = newStep => () => {
    let flag;
    switch (step) {
      case 0:
        flag = validateStepOne();
        break;
      case 1:
        flag = validateStepTwo();
        break;
      default:
        break;
    }
    if (flag) setStep(newStep);
  };

  const handleNext = () => {
    let flag;
    switch (step) {
      case 0:
        flag = validateStepOne();
        break;
      case 1:
        flag = validateStepTwo();
        break;
      default:
        break;
    }
    if (flag) setStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setStep(prevStep => prevStep - 1);
  };

  // Funciones de validación

  const validateStepOne = () => {
    const errors = validate({ protocol }, rulesOne);
    setForm(form => ({ ...form, errors: errors || {} }));
    return errors ? false : true;
  };

  const validateStepTwo = () => {
    const errors = validate({ elements }, rulesTwo);
    setForm(form => ({ ...form, errors: errors || {} }));
    return errors ? false : true;
  };

  const validateStepThree = () => {
    const errors = validate(details, rulesThree);
    setForm(form => ({ ...form, errors: errors || {} }));
    return errors ? false : true;
  };

  const activeElements = () => {
    let elements_ = [];
    for (var key in elements) {
      if (elements[key].state) {
        if (key === 'graph') {
          elements[key].value.forEach(graph => {
            elements_.push({
              state: true,
              len: graph.len,
              kind: key,
              value: JSON.stringify(graph.options)
            });
          });
        } else {
          elements_.push({ ...elements[key], kind: key });
        }
      }
    }
    return JSON.stringify(elements_);
  };

  const connect = id => {
    ref.current = new WebSocket(`${ws}/ws/build/${id}`);
    ref.current.onopen = () => {
      console.log('steeper: CONNECT');
    };
    ref.current.onclose = () => {
      console.log('steeper: CLOSE');
    };
    ref.current.onmessage = e => {
      console.log(e);
    };
  };

  const build_image = id => {
    connect(id);
    waitForSocketConnection(() => {
      sendMessage({ command: 'build' });
      ref.current.close();
      // window.open(`http://localhost:3000/module/${id}`, "_blank")
      history.push(`/module/${id}`);
    });
  };

  const waitForSocketConnection = callback => {
    setTimeout(function() {
      // Check if websocket state is OPEN
      if (ref.current.readyState === 1) {
        callback();
        return;
      } else {
        console.log('steeper: wait for connection...');
        waitForSocketConnection(callback);
      }
    }, 100); // wait 100 milisecond for the connection...
  };

  const sendMessage = data => {
    try {
      ref.current.send(JSON.stringify({ ...data }));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    axios
      .post(
        `${host}/modules/check/`,
        { permissions: ['module.add_docker'] },
        authHeaderJSON()
      )
      .then(function(res) {
        setLoading(!res.data);
      })
      .catch(function(err) {
        error(err);
      });
    return () => {
      if (red.current) ref.current.close();
    };
  }, []);

  const save = () => {
    dispatch(actions.startLoading());
    const data = { protocol, ...details, elements: activeElements() };
    axios
      .post(`${host}/modules/create/`, dataToForm(data), authHeaderJSON())
      .then(function(res) {
        dispatch(actions.finishLoading());
        build_image(res.data);
      })
      .catch(function(err) {
        dispatch(actions.finishLoading());
        console.log(err.response.data);
        setForm(form => ({ ...form, errors: err.response.data }));
      });
  };

  const dataToForm = data => {
    let form = new FormData();
    Object.keys(data).forEach(key => {
      form.append(key, data[key]);
    });
    return form;
  };

  const sendData = () => {
    const flag = validateStepThree();
    console.log(flag, form.errors, details);
    if (flag) {
      save();
    }
  };

  const steps = [
    {
      label: 'Data collection',
      content: (
        <Protocol
          value={protocol}
          change={handleProtocol}
          errors={form.errors}
        />
      )
    },
    {
      label: 'Representation',
      content: (
        <Structure
          check={checkElements}
          change={handleElements}
          elements={elements}
          errors={form.errors}
          changeView={handleDetails}
        />
      )
    },
    {
      label: 'Model detail',
      content: (
        <ModelDetail
          value={details}
          change={handleDetails}
          errors={form.errors}
          input={elements.input}
        />
      )
    }
  ];

  return (
    <div className={classes.root}>
      {loading ? (
        <>
          <Grid container justify="space-around" spacing={3}>
            <Grid item>
              <Skeleton
                animation="wave"
                className="mb-2"
                variant="circle"
                width={40}
                height={40}
              />
              <Skeleton
                animation="wave"
                variant="text"
                height={10}
                width={40}
              />
            </Grid>
            <Grid item>
              <Skeleton
                animation="wave"
                className="mb-2"
                variant="circle"
                width={40}
                height={40}
              />
              <Skeleton
                animation="wave"
                variant="text"
                height={10}
                width={40}
              />
            </Grid>
            <Grid item>
              <Skeleton
                animation="wave"
                className="mb-2"
                variant="circle"
                width={40}
                height={40}
              />
              <Skeleton
                animation="wave"
                variant="text"
                height={10}
                width={40}
              />
            </Grid>
            <Grid item xs={12}>
              <Skeleton
                className={classes.fullHeight}
                animation="wave"
                variant="text"
              />
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Stepper
            alternativeLabel
            nonLinear
            activeStep={step}
            classes={{ root: classes.stepper }}>
            {steps.map(({ label }, item) => (
              <Step key={label}>
                <StepButton onClick={handleStep(item)}>{label}</StepButton>
              </Step>
            ))}
          </Stepper>
          {steps[step].content}
          <div className={classes.buttons}>
            <Button
              variant="outlined"
              disabled={step === 0}
              onClick={handleBack}
              className={classes.backButton}>
              Back
            </Button>
            <Button
              variant="outlined"
              onClick={step >= steps.length - 1 ? sendData : handleNext}>
              {step >= steps.length - 1 ? 'Send' : 'Next'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
