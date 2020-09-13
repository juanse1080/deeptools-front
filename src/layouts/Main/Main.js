import { Container, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Topbar } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 64,
    height: '100%'
  },
  topbar: {
    width: '100%',
    [theme.breakpoints.down('md')]: {
      width: '100%'
    }
  },
  container: {
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
      paddingRight: 0
    }
  },
  content: {
    height: '100%'
  }
}));

const Main = props => {
  const { children, fluid } = props;
  const loading = useSelector(state => state.loading);

  const classes = useStyles();

  return (
    <div
      className={clsx({
        [classes.root]: true
      })}>
      {loading ? (
        <LinearProgress color="secondary" style={{ height: '3px' }} />
      ) : null}
      <Topbar className={classes.topbar} />
      {fluid ? (
        children
      ) : (
        <Container maxWidth="lg" className={classes.container}>
          {children}
        </Container>
      )}
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node
};

export default Main;
