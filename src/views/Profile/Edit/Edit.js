import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Link,
  makeStyles,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import axios from 'axios';
import { InputFileImage } from 'components';
import { authHeaderForm, authHeaderJSON, history, host } from 'helpers';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { error } from 'utils';
import validate from 'validate.js';
import { actions } from '_redux';

const schema = {
  first_name: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  last_name: {
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
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2)
    }
  },
  alerts: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  disableScale: {
    transform: 'scale(1, 1) !important'
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
  }
}));

export default function Edit(props) {
  const classes = useStyles();
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.up('sm'));
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  const showProfile = () => {
    dispatch(actions.startLoading());
    history.push(`/account`);
    dispatch(actions.finishLoading());
  };

  const Upload = event => {
    event.preventDefault();

    if (!Object.keys(formState.touched).length > 0 || !formState.isValid)
      return;

    dispatch(actions.startLoading());
    let data_ = {
      first_name: formState.values.first_name,
      last_name: formState.values.last_name,
      email: formState.values.email
    };
    if (formState.touched.photo) data_.photo = formState.values.photo;

    if (formState.touched.email) data_.email = formState.values.email;

    const form = new FormData();
    Object.keys(data_).forEach(attr => {
      form.append(attr, data_[attr]);
      console.log(attr, data_[attr]);
    });

    axios
      .put(`${host}/accounts/profile/edit`, form, authHeaderForm())
      .then(res => {
        setFormState(formState => ({
          ...formState,
          values: { ...formState.values, ...res.data }
        }));
        dispatch(actions.updateUser(res.data));
        dispatch(actions.finishLoading());
      })
      .catch(err => {
        dispatch(actions.finishLoading());
        console.log(err.response.data);
        setFormState(form => ({ ...form, errors: err.response.data }));
      });
  };

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

  const handlePhoto = (_, file) => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        photo: file
      },
      touched: {
        ...formState.touched,
        photo: true
      }
    }));
  };

  const hasError = field => (formState.errors[field] ? true : false);

  useEffect(() => {
    axios
      .get(`${host}/accounts/profile/`, authHeaderJSON())
      .then(function(res) {
        setFormState({ ...formState, values: { ...res.data } });
        setLoading(false);
      })
      .catch(function(err) {
        error(err);
      });
  }, [props.match.params]);

  useEffect(() => {
    const errors = validate(formState.values, schema);
    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  return (
    <>
      <div className={classes.root}>
        {loading ? (
          <>
            <>
              <Grid container spacing={3}>
                <Grid item lg={3} md={4} sm={5} xs={12}></Grid>
                <Grid item lg={9} md={8} sm={7} xs={12}>
                  <Grid container className="mt-3" spacing={3}>
                    {[1, 2, 3, 4, 5, 6].map(item => (
                      <Grid item xs={12} key={item}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={12} md={6}>
                            <Skeleton
                              key={item}
                              className={classes.disableScale}
                              animation="wave"
                              width="100%"
                              height={50}
                              variant="text"
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={6}>
                            <Skeleton
                              key={item}
                              className={classes.disableScale}
                              animation="wave"
                              width="100%"
                              height={50}
                              variant="text"
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </>
          </>
        ) : (
          <>
            <Grid container justify="center" direction="row">
              <Grid item xs={12}>
                {props.match.params.id ? (
                  <>
                    <Breadcrumbs aria-label="breadcrumb" maxItems={sm ? 8 : 2}>
                      <Typography color="textSecondary">Accounts</Typography>
                      <Typography color="textSecondary">
                        {props.match.params.id}
                      </Typography>
                    </Breadcrumbs>
                  </>
                ) : (
                  <Breadcrumbs aria-label="breadcrumb" maxItems={sm ? 8 : 2}>
                    <Link color="inherit" onClick={showProfile}>
                      Profile
                    </Link>
                    <Typography color="textSecondary">Edit</Typography>
                  </Breadcrumbs>
                )}
              </Grid>
            </Grid>
            <div className={classes.content}>
              <Box className={classes.paper}>
                <Grid container justify="center" direction="row">
                  <Grid item xl={6} lg={5} md={6} sm={7} xs={8}>
                    <InputFileImage
                      id="photo"
                      loaded
                      preview={`${host}${formState.values.photo}`}
                      onChange={handlePhoto}
                    />
                  </Grid>
                </Grid>
                <form className={classes.form} onSubmit={Upload}>
                  <TextField
                    size="small"
                    className={classes.textField}
                    error={hasError('first_name')}
                    fullWidth
                    helperText={
                      hasError('first_name')
                        ? formState.errors.first_name[0]
                        : null
                    }
                    label="First name"
                    name="first_name"
                    onChange={handleChange}
                    type="text"
                    value={formState.values.first_name || ''}
                    variant="outlined"
                  />
                  <TextField
                    size="small"
                    className={classes.textField}
                    error={hasError('last_name')}
                    fullWidth
                    helperText={
                      hasError('last_name')
                        ? formState.errors.last_name[0]
                        : null
                    }
                    label="Last name"
                    name="last_name"
                    onChange={handleChange}
                    type="text"
                    value={formState.values.last_name || ''}
                    variant="outlined"
                  />
                  <TextField
                    size="small"
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
                  <Grid
                    container
                    justify="space-between"
                    alignItems="center"
                    direction="row-reverse">
                    <Grid item>
                      <Button
                        color="primary"
                        disabled={
                          !Object.keys(formState.touched).length > 0 ||
                          !formState.isValid
                        }
                        size="small"
                        type="submit"
                        variant="contained">
                        Update profile
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </div>
          </>
        )}
      </div>
    </>
  );
}
