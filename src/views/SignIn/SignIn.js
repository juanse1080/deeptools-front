import {
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
// Import Material UI componetes
import { makeStyles } from '@material-ui/styles';
// import local
import { history } from 'helpers/route';
// Import other modules
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import validate from 'validate.js';
import { actions } from '_redux';
import logo from 'assets/img/color.svg';

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  content: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      alignItems: 'start'
    }
  },
  form: {
    paddingTop: theme.spacing(3),
    padding: theme.spacing(7),
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  textField: {
    marginBottom: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(0, 0, 1, 0)
  },
  containerIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3)
  },
  img: {
    height: theme.spacing(8)
  },
  title: {
    padding: theme.spacing(0, 0, 4, 0),
    fontWeight: 600
  },
  paper: {
    width: '450px'
  },
  error: {
    marginBottom: theme.spacing(2)
  },
  fontFamily: {
    fontFamily: '"Raleway", sans-serif'
  }
}));

const SignIn = props => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token !== null) history.push('/dashboard');
  });

  const classes = useStyles();
  const dispatch = useDispatch();
  const error = useSelector(state => state.error);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);
    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleSignIn = event => {
    event.preventDefault();

    if (!formState.isValid) return;

    dispatch(
      actions.authLogin(formState.values.email, formState.values.password)
    );
    document.getElementById('email').focus();
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Box className={classes.paper}>
          <form
            className={classes.form}
            onSubmit={handleSignIn}
          >
            <div className={classes.containerIcon}>
              <img
                alt="Logo"
                className={classes.img}
                src={logo}
              />
            </div>
            <Typography
              align="center"
              className={classes.title}
              classes={{ root: classes.fontFamily }}
              color="primary"
              variant="h2"
            >
              Sign In
            </Typography>
            <TextField
              className={classes.textField}
              color="primary"
              error={hasError('email') || error ? true : null}
              fullWidth
              helperText={hasError('email') ? formState.errors.email[0] : null}
              id="email"
              label="Email address"
              name="email"
              onChange={handleChange}
              size="small"
              type="text"
              value={formState.values.email || ''}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              color="primary"
              error={hasError('password') || error ? true : null}
              fullWidth
              helperText={
                hasError('password') ? formState.errors.password[0] : null
              }
              label="Password"
              name="password"
              onChange={handleChange}
              size="small"
              type="password"
              value={formState.values.password || ''}
              variant="outlined"
            />
            {error ? (
              <Alert
                className={classes.error}
                severity="error"
              >
                {error}
              </Alert>
            ) : null}
            <Grid
              alignItems="center"
              container
              direction="row-reverse"
              justify="space-between"
            >
              <Grid item>
                <Button
                  color="primary"
                  disabled={!formState.isValid}
                  size="small"
                  type="submit"
                  variant="contained"
                >
                  {' '}
                  Sign in now{' '}
                </Button>
              </Grid>
              <Grid item>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  <Link
                    component={RouterLink}
                    to="/sign-up"
                    variant="h6"
                  >
                    Create account
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Box>
      </div>
    </div>
  );
};

SignIn.propTypes = {
  history: PropTypes.object
};

export default SignIn;
