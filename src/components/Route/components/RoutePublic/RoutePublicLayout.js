import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Minimal } from 'layouts';

const RoutePublicLayout = props => {
  const { component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={matchProps => (
        <Minimal>
          <Component {...matchProps} />
        </Minimal>
      )}
    />
  );
};

RoutePublicLayout.propTypes = {
  component: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RoutePublicLayout;
