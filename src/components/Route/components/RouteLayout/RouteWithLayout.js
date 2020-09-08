import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import Footer from '../Footer';
import { useDispatch } from "react-redux";
import { actions } from '_redux'

import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    // paddingTop: 64,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
  },
  content: {
    height: '100%'
  }
}));


const RouteWithLayout = ({ layout: Layout, component: Component, fluid, ...rest }) => {

  const classes = useStyles()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actions.authCheckState())
  })

  return (
    <Route
      {...rest}
      render={matchProps => (
        <Layout fluid={fluid}>
          <div className={classes.root}>
            <Component {...matchProps} />
            <Footer />
          </div>
        </Layout>
      )}
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RouteWithLayout;
