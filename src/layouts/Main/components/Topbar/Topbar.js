import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton, MenuList, Menu, Divider, LinearProgress } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToApp from '@material-ui/icons/ExitToApp';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Avatar from '@material-ui/core/Avatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';

import { useDispatch } from 'react-redux'
import { actions } from '_redux'

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
  },
  flexGrow: {
    flexGrow: 1
  },
  Button: {
    color: '#d1d3e2',
  },
  drawerIcon: {
    color: theme.palette.primary.main
  },
  profileButton: {
    marginLeft: theme.spacing(1)
  },
  listItemIconRoot: {
    minWidth: '30px'
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  // menuList: {
  //   paddingTop: 0,
  //   paddingBottom: 0,
  // }
}));

const Topbar = props => {
  const { className, onSidebarOpen, window, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications] = useState([]);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    handleClose()
  }

  return <Slide appear={false} direction="down" in={!trigger}>
    <AppBar {...rest} color="inherit" className={clsx(classes.root, className)}>
      <Toolbar className={clsx(classes.flexGrow, "shadow")}>
        <Hidden lgUp>
          <IconButton size="small" color="inherit" className={classes.drawerIcon} onClick={onSidebarOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
        <div className={classes.flexGrow} />
        <IconButton>
          <Badge badgeContent={7} max={9} variant="dot" color='secondary' children={<NotificationsIcon className={classes.Button} />} />
        </IconButton>

        <IconButton className={classes.profileButton} onClick={handleMenu}>
          <Avatar alt="Remy Sharp" src="/images/avatars/avatar_1.png" />
        </IconButton>
        <Menu
          classes={{ list: classes.menuList }}
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Profile</Typography>
          </MenuItem>
          {/* <Divider className={classes.divider} /> */}
          <MenuItem onClick={() => dispatch(actions.logout())}>
            <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
              <ExitToApp fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Logout</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  </Slide>
}

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
