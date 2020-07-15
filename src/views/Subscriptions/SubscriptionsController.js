import React from 'react';
import { Switch } from 'react-router-dom';

import { RouteWithLayout, RoutePublicLayout } from 'components';
import { Main as MainLayout } from 'layouts';

import List from './List';

const Routes = () => {

  return (
    <Switch>
      <RouteWithLayout component={List} exact layout={MainLayout} path="/subscriptions" />
    </Switch>
  );
};

export default Routes;
