import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography
} from '@material-ui/core';
import bivlab from 'assets/img/bivlab.svg';
import uis from 'assets/img/uis.png';

import { LinearProgress } from '@material-ui/core'

import { useSelector } from 'react-redux';

const useStyles = makeStyles(() => ({
  root: {
    // paddingTop: 64,
    height: '100vh'
  },
  content: {
    height: 'calc(100% - 100px)'
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '10px 20px'
  }
}));

const Minimal = props => {
  const { children } = props;

  const loading = useSelector(state => state.loading)

  const classes = useStyles();

  return (
    <div className={classes.root}>

      {
        loading ? <LinearProgress
          color="secondary"
          style={{ height: '3px' }}
        /> : null
      }
      <main className={classes.content}>
        {children}
        <footer className={classes.footer}>
          <img
            alt="bivl2ab"
            height="80px"
            src={bivlab}
          />
          <img
            alt="uis"
            height="60px"
            src={uis}
          />
        </footer>
      </main>
    </div>
  );
};

Minimal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default Minimal;
