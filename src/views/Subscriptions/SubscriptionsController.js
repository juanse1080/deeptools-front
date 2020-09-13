import { RouteWithLayout } from 'components';
import { Main as MainLayout } from 'layouts';
import React from 'react';
import { Switch } from 'react-router-dom';
import List from './List';
import Test from './Test';

const Routes = () => {
  return (
    <Switch>
      <RouteWithLayout
        component={Test}
        exact
        layout={MainLayout}
        path="/subscriptions/:id"
      />
      <RouteWithLayout
        component={List}
        exact
        layout={MainLayout}
        path="/subscriptions"
      />
    </Switch>
  );
};

export default Routes;
