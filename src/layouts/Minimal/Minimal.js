import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

import { LinearProgress } from '@material-ui/core'

import { useSelector } from "react-redux";

const useStyles = makeStyles(() => ({
  root: {
    // paddingTop: 64,
    height: '100%'
  },
  content: {
    height: '100%'
  }
}));

const Minimal = props => {
  const { children } = props;

  const loading = useSelector(state => state.loading)

  const classes = useStyles();

  return (
    <div className={classes.root}>

      {
        loading ? <LinearProgress color="secondary" style={{height:'3px'}}/> : null
      }
      <main className={classes.content}>{children}</main>
    </div>
  );
};

Minimal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default Minimal;
