import React, { useState, useEffect } from 'react'

// Import other modules
import PropTypes from 'prop-types'
import validate from 'validate.js'
import { Link as RouterLink, withRouter } from 'react-router-dom'

// Import Material UI componetes
import { makeStyles } from '@material-ui/styles'
import { useDispatch, useSelector } from "react-redux";
import { Grid, Button, IconButton, TextField, Link, Typography, Paper, SvgIcon, LinearProgress, Box, } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'
import Fade from '@material-ui/core/Fade'
import { Alert } from '@material-ui/lab'

// import local 
import { host, history } from 'helpers/route'
import { actions } from '_redux';
import { ReactComponente as Icon } from 'assets/icons/icon_dark.svg'

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
}

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
  }
}))

const SignIn = props => {

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(token !== null) history.push('/dashboard');
  })

  const classes = useStyles()
  const dispatch = useDispatch()
  const loading = useSelector(state => state.loading)
  const error = useSelector(state => state.error)

  const [formState, setFormState] = useState({ isValid: false, values: {}, touched: {}, errors: {} })

  useEffect(() => {
    const errors = validate(formState.values, schema)
    setFormState(formState => ({ ...formState, isValid: errors ? false : true, errors: errors || {} }))
  }, [formState.values])

  const handleChange = event => {
    event.persist()
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
    }))
  }

  const handleSignIn = event => {
    event.preventDefault()

    if (!formState.isValid) return
    
    dispatch(actions.authLogin(formState.values.email, formState.values.password))
    document.getElementById('email').focus()
  }

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Box className={classes.paper}>
          <form className={classes.form} onSubmit={handleSignIn}>
            <div className={classes.containerIcon}>
              <img alt="Logo" src="/images/logos/color_without_name.svg" className={classes.img} />
            </div>
            {/* <SvgIcon component={Icon} /> */}
            <Typography className={classes.title} variant="h2" align="center">Sign in</Typography>
            <TextField id="email" className={classes.textField} error={hasError('email') || error ? true : null} fullWidth helperText={hasError('email') ? formState.errors.email[0] : null} label="Email address" name="email" onChange={handleChange} type="text" value={formState.values.email || ''} variant="outlined" />
            <TextField className={classes.textField} error={hasError('password') || error ? true : null} fullWidth label="Password" name="password" onChange={handleChange} type="password" value={formState.values.password || ''} variant="outlined" helperText={hasError('password') ? formState.errors.password[0] : null} />
              {
                error ? <Alert severity="error" className={classes.error}>{error}</Alert> : null
              }
            <Button className={classes.signInButton} color="primary" disabled={!formState.isValid} fullWidth size="large" type="submit" variant="contained"> Sign in now </Button>
            <Typography color="textSecondary" variant="body1">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/sign-up" variant="h6">
                Sign up
                </Link>
            </Typography>
          </form>
        </Box>
      </div>
    </div>
  )
}

SignIn.propTypes = {
  history: PropTypes.object
}

export default SignIn
