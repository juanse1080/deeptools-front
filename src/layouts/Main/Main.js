import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery, LinearProgress } from '@material-ui/core';
import { useSelector } from "react-redux";

import { Sidebar, Topbar, Footer } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 64,
    height: '100%',
  },
  topbar: {
    width: 'calc(100% - 240px)',
    [theme.breakpoints.down("md")]: {
      width: '100%'
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: '100%'
  }
}));

const Main = props => {
  const { children } = props;
  const loading = useSelector(state => state.loading)

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  });

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}
    >
      {
        loading ? <LinearProgress color="primary" style={{height:'3px'}}/> : null
      }
      <Topbar onSidebarOpen={handleSidebarOpen} className={classes.topbar} />
      {children}
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
      />
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node
};

export default Main;
