import { RouteWithLayout } from 'components';
import { Main as MainLayout } from 'layouts';
import React from 'react';
import { Switch } from 'react-router-dom';
import Create from './Create';
import Experiment from './Experiment';
import List from './List';
import Run from './Run';
import Running from './Running';
import Show from './Show';

const Routes = () => {
  return (
    <Switch>
      <RouteWithLayout
        component={Create}
        exact
        layout={MainLayout}
        path="/module/create"
      />
      <RouteWithLayout
        component={Running}
        exact
        layout={MainLayout}
        path="/module/experiment"
      />
      <RouteWithLayout
        component={Experiment}
        exact
        layout={MainLayout}
        path="/module/experiment/:id"
      />
      <RouteWithLayout
        component={Run}
        exact
        layout={MainLayout}
        path="/module/run/:id"
      />
      <RouteWithLayout
        component={Run}
        exact
        layout={MainLayout}
        path="/module/experiment/:id"
      />
      <RouteWithLayout
        component={Show}
        exact
        layout={MainLayout}
        path="/module/:id"
      />
      <RouteWithLayout
        component={List}
        exact
        layout={MainLayout}
        path="/module"
      />
    </Switch>
  );
};

export default Routes;
