import React from 'react';
import { Switch } from 'react-router-dom';

import { RouteWithLayout, RoutePublicLayout } from 'components';
import { Main as MainLayout } from 'layouts';

import Create from './Create';
import Show from './Show';
import List from './List';
import Run from './Run';

const Routes = () => {
  return (
    <Switch>
      <RouteWithLayout component={Create} exact layout={MainLayout} path="/module/create" />
      <RouteWithLayout component={Run} exact layout={MainLayout} path="/module/run/:id" />
      <RouteWithLayout component={Show} exact layout={MainLayout} path="/module/:id" />
      <RouteWithLayout component={List} exact layout={MainLayout} path="/module" />
    </Switch>
  );
};

export default Routes;
