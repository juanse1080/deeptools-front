import React from 'react'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'

const RouteCRUD = props => {
  const { component: Component, ...rest } = props

  return (
    <Route
      {...rest}
      render={matchProps =>
          <Component {...matchProps} />
      }
    />
  )
}

RouteCRUD.propTypes = {
  component: PropTypes.any.isRequired,
  path: PropTypes.string
}

export default RouteCRUD
