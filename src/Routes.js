import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Switch, useLocation } from 'react-router-dom';
import { RouteCrud, RoutePublicLayout, RouteWithLayout } from './components';
import { Main as MainLayout } from './layouts';
import {
  Account as AccountView,
  Algorithms,
  Dashboard as DashboardView,
  Icons as IconsView,
  Module,
  NotFound as NotFoundView,
  Notifications,
  ProductList as ProductListView,
  Profile,
  Settings as SettingsView,
  SignIn as SignInView,
  SignUp as SignUpView,
  Subscriptions,
  Typography as TypographyView,
  UserList as UserListView
} from './views';

const Routes = () => {
  const user = useSelector(state => state.user);
  let location = useLocation();
  return (
    <Switch>
      <RoutePublicLayout component={SignUpView} exact path="/sign-up" />
      <RoutePublicLayout component={SignInView} exact path="/sign-in" />
      <RoutePublicLayout component={NotFoundView} exact path="/not-found" />
      <RouteCrud
        component={Module}
        exact
        layout={MainLayout}
        path="/module/:action?/:id?"
      />
      <RouteCrud
        component={Subscriptions}
        exact
        layout={MainLayout}
        path="/subscriptions/:action?/:id?"
      />
      {user ? (
        user.role === 'user' ? (
          <RouteWithLayout
            component={Algorithms}
            exact
            layout={MainLayout}
            path="/algorithms/:filter?"
          />
        ) : null
      ) : null}
      {user ? (
        user.role === 'developer' && location.pathname === '/algorithms' ? (
          <Redirect to="/module" />
        ) : null
      ) : null}
      <RouteWithLayout
        component={Notifications}
        exact
        layout={MainLayout}
        path="/notifications"
      />
      <RouteCrud
        component={Profile}
        exact
        layout={MainLayout}
        path="/account/:action?/:id?"
      />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />
      <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        path="/users"
      />
      <RouteWithLayout
        component={ProductListView}
        exact
        layout={MainLayout}
        path="/products"
      />
      <RouteWithLayout
        component={TypographyView}
        exact
        layout={MainLayout}
        path="/typography"
      />
      <RouteWithLayout
        component={IconsView}
        exact
        layout={MainLayout}
        path="/icons"
      />
      <RouteWithLayout
        component={AccountView}
        exact
        layout={MainLayout}
        path="/account-"
      />
      <RouteWithLayout
        component={SettingsView}
        exact
        layout={MainLayout}
        path="/settings"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
