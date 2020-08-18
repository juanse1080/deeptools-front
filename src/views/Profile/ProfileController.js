import React from 'react';
import { Switch } from 'react-router-dom';

import { RouteWithLayout, RoutePublicLayout } from 'components';
import { Main as MainLayout } from 'layouts';

import Show from './Show';

const Routes = () => {
  return (
    <Switch>
      <RouteWithLayout component={Show} exact layout={MainLayout} path="/account" />
      <RouteWithLayout component={Show} exact layout={MainLayout} path="/account/:id" />
    </Switch>
  );
};

export default Routes;
