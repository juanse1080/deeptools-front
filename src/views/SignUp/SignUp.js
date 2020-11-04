import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import validate from 'validate.js';
import { actions } from '_redux';
import logo from 'assets/img/color.svg';

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
    },
    equality: {
      attribute: 'otherPassword',
      message: 'Passwords do not match',
      comparator: function(v1, v2) {
        return JSON.stringify(v1) === JSON.stringify(v2);
      }
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
    margin: theme.spacing(0, 0, 1, 0)
  },
  fontFamily: {
    fontFamily: '"Raleway", sans-serif'
  }
}));

const SignUp = props => {
  const dispatch = useDispatch();
  const error = useSelector(state => state.error);
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

  useEffect(() => {
    setFormState(formState => {
      const form = {
        ...formState,
        errors: error || {},
        isValid: error ? false : true
      };
      console.log(form);
      return form;
    });
  }, [error]);

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

  const handleSignUp = event => {
    event.preventDefault();
    if (!formState.isValid) return;
    console.log(
      'firstName:',
      formState.values.firstName,
      'lastName:',
      formState.values.lastName,
      'role:',
      formState.values.role,
      'email:',
      formState.values.email,
      'password:',
      formState.values.password,
      'otherPassword:',
      formState.values.otherPassword
    );
    dispatch(actions.startLoading());
    dispatch(
      actions.authSignup(
        formState.values.firstName,
        formState.values.lastName,
        formState.values.role,
        formState.values.email,
        formState.values.password,
        formState.values.otherPassword
      )
    );
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Box className={classes.paper}>
          <form className={classes.form} onSubmit={handleSignUp}>
            <div className={classes.containerIcon}>
              <img alt="Logo" src={logo} className={classes.img} />
            </div>
            <Typography
              classes={{ root: classes.fontFamily }}
              className={classes.title}
              variant="h2"
              align="center"
              color="primary">
              Create Account
            </Typography>
            <TextField
              size="small"
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
              size="small"
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
            <FormControl
              fullWidth
              variant="outlined"
              size="small"
              className={classes.textField}>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                name="role"
                label="Role"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formState.values.role || 'user'}
                onChange={handleChange}>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="developer">Developer</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              className={classes.textField}
              error={hasError('email')}
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
            <TextField
              size="small"
              className={classes.textField}
              error={hasError('password')}
              fullWidth
              helperText={
                hasError('password') ? formState.errors.password[0] : null
              }
              label="Confirm password"
              name="otherPassword"
              onChange={handleChange}
              type="password"
              value={formState.values.otherPassword || ''}
              variant="outlined"
            />
            <Grid
              container
              justify="space-between"
              alignItems="center"
              direction="row-reverse">
              <Grid item>
                <Button
                  color="primary"
                  disabled={!formState.isValid}
                  size="small"
                  type="submit"
                  variant="contained">
                  Create account
                </Button>
              </Grid>
              <Grid item>
                <Typography color="textSecondary" variant="body1">
                  <Link component={RouterLink} to="/sign-in" variant="h6">
                    Sign in
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

SignUp.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignUp);
