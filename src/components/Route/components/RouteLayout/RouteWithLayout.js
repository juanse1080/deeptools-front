import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { actions } from '_redux';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
  },
  content: {
    height: '100%'
  }
}));

const RouteWithLayout = ({
  layout: Layout,
  component: Component,
  fluid,
  ...rest
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.authCheckState());
  });

  return (
    <Route
      {...rest}
      render={matchProps => (
        <Layout fluid={fluid}>
          <div className={classes.root}>
            <Component {...matchProps} />
          </div>
          {/* <Footer /> */}
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
