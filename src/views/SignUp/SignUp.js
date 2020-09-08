import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import { Grid, Button, IconButton, TextField, Link, FormHelperText, Checkbox, Typography, Box } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const schema = {
  firstName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  lastName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
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
  },
  policy: {
    presence: { allowEmpty: false, message: 'is required' },
    checked: true
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
      alignItems: 'start',
    }
  },
  form: {
    paddingTop: theme.spacing(5),
    padding: theme.spacing(7),
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  signInButton: {
    margin: theme.spacing(0, 0, 1, 0)
  },
  containerIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2)
  },
  img: {
    height: theme.spacing(10),
    align: 'center'
  },
  title: {
    padding: theme.spacing(2, 0, 4, 0)
  },
  paper: {
    width: '528px'
  },
  error: {
    marginBottom: theme.spacing(2)
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  textField: {
    marginBottom: theme.spacing(2)
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  signUpButton: {
    margin: theme.spacing(2, 0)
  }
}));

const SignUp = props => {
  const { history } = props;

  const classes = useStyles();

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

  const handleBack = () => {
    history.goBack();
  };

  const handleSignUp = event => {
    event.preventDefault();
    history.push('/');
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Box className={classes.paper}>
          <form
            className={classes.form}
            onSubmit={handleSignUp}
          >
            <Typography
              className={classes.title}
              variant="h2"
            >
              Create new account
                </Typography>
            <Typography
              color="textSecondary"
              gutterBottom
            >
              Use your email to create new account
                </Typography>
            <TextField
              className={classes.textField}
              error={hasError('firstName')}
              fullWidth
              helperText={
                hasError('firstName') ? formState.errors.firstName[0] : null
              }
              label="First name"
              name="firstName"
              onChange={handleChange}
              type="text"
              value={formState.values.firstName || ''}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              error={hasError('lastName')}
              fullWidth
              helperText={
                hasError('lastName') ? formState.errors.lastName[0] : null
              }
              label="Last name"
              name="lastName"
              onChange={handleChange}
              type="text"
              value={formState.values.lastName || ''}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              error={hasError('email')}
              fullWidth
              helperText={
                hasError('email') ? formState.errors.email[0] : null
              }
              label="Email address"
              name="email"
              onChange={handleChange}
              type="text"
              value={formState.values.email || ''}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              error={hasError('password')}
              fullWidth
              helperText={
                hasError('password') ? formState.errors.password[0] : null
              }
              label="Password"
              name="password"
              onChange={handleChange}
              type="password"
              value={formState.values.password || ''}
              variant="outlined"
            />
            <div className={classes.policy}>
              <Checkbox
                checked={formState.values.policy || false}
                className={classes.policyCheckbox}
                color="primary"
                name="policy"
                onChange={handleChange}
              />
              <Typography
                className={classes.policyText}
                color="textSecondary"
                variant="body1"
              >
                I have read the{' '}
                <Link
                  color="primary"
                  component={RouterLink}
                  to="#"
                  underline="always"
                  variant="h6"
                >
                  Terms and Conditions
                    </Link>
              </Typography>
            </div>
            {hasError('policy') && (
              <FormHelperText error>
                {formState.errors.policy[0]}
              </FormHelperText>
            )}
            <Button
              className={classes.signUpButton}
              color="primary"
              disabled={!formState.isValid}
              fullWidth
              size="large"
              type="submit"
              variant="outlined"
            >
              Sign up now
                </Button>
            <Typography
              color="textSecondary"
              variant="body1"
            >
              Have an account?{' '}
              <Link
                component={RouterLink}
                to="/sign-in"
                variant="h6"
              >
                Sign in
                  </Link>
            </Typography>
          </form>
        </Box>
      </div>
    </div>
  );
};

SignUp.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignUp);
