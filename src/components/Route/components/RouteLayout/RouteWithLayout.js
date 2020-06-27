import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import Footer from '../Footer';
import { useDispatch, useSelector } from "react-redux";
import { actions } from '_redux'


const RouteWithLayout = props => {
  const { layout: Layout, component: Component, ...rest } = props;

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actions.authCheckState())
  })

  return (
    <Route
      {...rest}
      render={matchProps => (
        <Layout>
          <Component {...matchProps}>

          </Component>
          <Footer />
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
