import React, { useEffect } from 'react';
import { Switch, Redirect, useRouteMatch } from 'react-router-dom';

import { RouteWithLayout, RoutePublicLayout } from 'components';
import { Main as MainLayout, Minimal as MinimalLayout } from 'layouts';

import Create from './Create';
import Show from './Show';
import List from './List';

const Routes = (props) => {

  useEffect(() => {
    console.log(props)
  }, [])

  return (
    <Switch>
      <RouteWithLayout component={Create} exact layout={MainLayout} path="/module/create" />
      <RouteWithLayout component={Show} exact layout={MainLayout} path="/module/:id" />
      <RouteWithLayout component={List} exact layout={MainLayout} path="/module" />
    </Switch>
  );
};

export default Routes;
