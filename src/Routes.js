import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout, RoutePublicLayout, RouteCrud } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Dashboard as DashboardView, ProductList as ProductListView, UserList as UserListView, Typography as TypographyView, Icons as IconsView, Account as AccountView, Settings as SettingsView, SignUp as SignUpView, SignIn as SignInView, NotFound as NotFoundView, Module, Subscriptions, Algorithms
} from './views';

const Routes = () => {
  return (
    <Switch>
      <RoutePublicLayout component={SignUpView} exact path="/sign-up" />
      <RoutePublicLayout component={SignInView} exact path="/sign-in" />
      <RoutePublicLayout component={NotFoundView} exact path="/not-found" />
      <RouteCrud component={Module} exact layout={MainLayout} path="/module/:action?/:id?" />
      <RouteCrud component={Subscriptions} exact layout={MainLayout} path="/subscriptions/:action?/:id?" />
      <RouteWithLayout component={Algorithms} exact layout={MainLayout} path="/algorithms" />
      <RouteWithLayout component={DashboardView} exact layout={MainLayout} path="/dashboard" />
      <RouteWithLayout component={UserListView} exact layout={MainLayout} path="/users" />
      <RouteWithLayout component={ProductListView} exact layout={MainLayout} path="/products" />
      <RouteWithLayout component={TypographyView} exact layout={MainLayout} path="/typography" />
      <RouteWithLayout component={IconsView} exact layout={MainLayout} path="/icons" />
      <RouteWithLayout component={AccountView} exact layout={MainLayout} path="/account" />
      <RouteWithLayout component={SettingsView} exact layout={MainLayout} path="/settings" />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
