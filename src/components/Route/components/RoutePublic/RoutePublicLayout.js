import React, { useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import Footer from '../Footer'
import { Minimal } from 'layouts'

import { useSelector } from 'react-redux'

const RoutePublicLayout = props => {
  const { component: Component, ...rest } = props

  return (
    <Route
      {...rest}
      render={matchProps =>
        <Minimal>
          <Component {...matchProps} />
          {/* <Footer /> */}
        </Minimal >
      }
    />
  )
}

RoutePublicLayout.propTypes = {
  component: PropTypes.any.isRequired,
  path: PropTypes.string
}

export default RoutePublicLayout
