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
          <form className={classes.form} onSubmit={handleSignIn}>
            <div className={classes.containerIcon}>
              <img
                alt="Logo"
                src="/images/logos/color.svg"
                className={classes.img}
              />
            </div>
            <Typography
              className={classes.title}
              variant="h2"
              align="center"
              color="primary">
              Sign In
            </Typography>
            <TextField
              size="small"
              id="email"
              className={classes.textField}
              error={hasError('email') || error ? true : null}
              fullWidth
              helperText={hasError('email') ? formState.errors.email[0] : null}
              label="Email address"
              name="email"
              onChange={handleChange}
              type="text"
              value={formState.values.email || ''}
              variant="outlined"
            />
            <TextField
              size="small"
              className={classes.textField}
              error={hasError('password') || error ? true : null}
              fullWidth
              label="Password"
              name="password"
              onChange={handleChange}
              type="password"
              value={formState.values.password || ''}
              variant="outlined"
              helperText={
                hasError('password') ? formState.errors.password[0] : null
              }
            />
            {error ? (
              <Alert severity="error" className={classes.error}>
                {error}
              </Alert>
            ) : null}
            <Grid
              container
              justify="space-between"
              alignItems="center"
              direction="row-reverse">
              <Grid item>
                <Button
                  color="primary"
                  disabled={!formState.isValid}
                  type="submit"
                  variant="contained"
                  size="small">
                  {' '}
                  Sign in now{' '}
                </Button>
              </Grid>
              <Grid item>
                <Typography color="textSecondary" variant="body1">
                  <Link component={RouterLink} to="/sign-up" variant="h6">
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
