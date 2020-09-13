import { RouteWithLayout } from 'components';
import { Main as MainLayout } from 'layouts';
import React from 'react';
import { Switch } from 'react-router-dom';
import Edit from './Edit';
import Show from './Show';

const Routes = () => {
  return (
    <Switch>
      <RouteWithLayout
        component={Show}
        exact
        layout={MainLayout}
        path="/account"
      />
      <RouteWithLayout
        component={Edit}
        exact
        layout={MainLayout}
        path="/account/edit"
      />
      <RouteWithLayout
        component={Show}
        exact
        layout={MainLayout}
        path="/account/:id"
      />
    </Switch>
  );
};

export default Routes;
