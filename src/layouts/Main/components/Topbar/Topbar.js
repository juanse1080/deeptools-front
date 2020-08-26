import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import clsx from 'clsx';
import PropTypes, { element } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton, MenuList, Menu, Divider, LinearProgress, Link } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToApp from '@material-ui/icons/ExitToApp';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Info from '@material-ui/icons/Info';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Error, Warning, CheckCircle } from '@material-ui/icons';
import Avatar from '@material-ui/core/Avatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import { Alert } from '@material-ui/lab';

import { useDispatch, useSelector } from 'react-redux'
import { actions } from '_redux'
import { format_date, error, PushNotification } from 'utils'
import axios from 'axios'
import { history, ws as ws_host, host, authHeaderJSON } from 'helpers'

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
  menuPaper: {
    maxWidth: 250,
    width: 250
  },
  description: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    display: 'flex',
    flexDirection: 'column'
  },
  disableEffectButton: {
    backgroundColor: 'inherit !important',
    cursor: 'default'
  }
}));



const Topbar = props => {
  const { className, onSidebarOpen, window, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user)

  const trigger = useScrollTrigger({ target: window ? window() : undefined });
  const [anchorEl, setAnchorEl] = useState({ account: null, notifications: null });
  const [ws, setWs] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const getIcon = state => {
    switch (state) {
      case 'success':
        return <CheckCircle fontSize="small" />

      case 'warning':
        return <Warning fontSize="small" />

      case 'error':
        return <Error fontSize="small" />

      default:
        break;
    }
  }

  const handleMenu = key => (event) => {
    setAnchorEl(anchorEl => ({ ...anchorEl, [key]: event.currentTarget }));
  }

  const handleClose = key => () => {
    setAnchorEl(anchorEl => ({ ...anchorEl, [key]: null }));
  }

  const to = (id, index, link) => () => {
    dispatch(actions.startLoading())
    axios.put(`${host}/accounts/notifications/${id}`, {}, authHeaderJSON()).then(
      function (res) {
        handleClose('notifications')()
        history.push(link)
        deleteNotification(index)
        dispatch(actions.finishLoading())
      }
    ).catch(
      function (err) {
        console.log(err)
        handleClose('notifications')()
        dispatch(actions.finishLoading())
      }
    )
  }

  const viewAll = () => {
    dispatch(actions.startLoading())
    history.push('/notifications')
    dispatch(actions.finishLoading())
  }

  const profile = () => {
    dispatch(actions.startLoading())
    history.push('/account')
    dispatch(actions.finishLoading())
  }

  const addNotification = (data) => {
    setNotifications(notifications => ([...data.content, ...notifications]))
    if (data.action === 'append') {
      const item = data.content[0]
      const notification = new PushNotification({
        action: item.link,
        title: item.title,
        body: item.description
      })
      notification.notify()
    }
  }

  const deleteNotification = index => {
    setNotifications(notifications => {
      let aux = [...notifications]
      aux.splice(index, 1)
      return aux
    })
  }

  const editNotification = data => {
    setNotifications(notifications => {
      let aux = [...notifications]
      aux.forEach((element, index) => {
        if (element.id === data.content.id) {
          aux.splice(index, 1)
          return aux
        }
      })
    })
  }

  const connect = () => {
    const webSocket = new WebSocket(`${ws_host}/ws/notifications/${user.id}`)
    webSocket.onmessage = e => {
      const data = JSON.parse(e.data)

      if (data.action === 'append' || data.action === 'fetch') addNotification(data)

      // if (data.action === 'append' || data.action === 'fetch') {
      //   addNotification(data)
      // } else if (data.action === 'delete') {
      //   editNotification(data)
      // }
    }
    return webSocket
  }

  useEffect(() => {
    new PushNotification().checkPermission()
    setWs(connect())
    return () => {
      if (ws) ws.close()
    }
  }, [])

  return <Slide appear={false} direction="down" in={!trigger}>
    <AppBar {...rest} color="primary" className={clsx(classes.root, className)}>
      <Toolbar className={clsx(classes.flexGrow, "shadow")}>
        <Hidden lgUp>
          <IconButton size="small" color="inherit" className={classes.drawerIcon} onClick={onSidebarOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
        <div className={classes.flexGrow} />
        <IconButton onClick={handleMenu('notifications')}>
          <Badge badgeContent={notifications.length} max={9} overlap="circle" color='primary' children={<NotificationsIcon className={classes.Button} />} />
        </IconButton>
        <Menu classes={{ list: classes.menuList, paper: classes.menuPaper }} id="notification-appbar" anchorEl={anchorEl.notifications} anchorOrigin={{ vertical: 'top', horizontal: 'right', }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right', }} open={Boolean(anchorEl.notifications)} onClose={handleClose('notifications')} >
          <MenuItem style={{ cursor: 'default', pointerEvents: 'none', minHeight: 'auto' }}>
            <Typography variant="caption">
              Notifications
              </Typography>
          </MenuItem>
          <Divider className={classes.divider} />
          {
            notifications.length > 0 ? notifications.slice(0, notifications.length > 5 ? 5 : notifications.length).map((item, key) =>
              <MenuItem key={key} onClick={to(item.id, key, item.link)} style={{ minHeight: 'auto' }}>
                <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                  {getIcon(item.kind)}
                </ListItemIcon>

                <div className={classes.description}>
                  <Typography variant="inherit" noWrap>{item.title}</Typography>
                  <Typography variant="caption" noWrap>{format_date(item.created_at)}</Typography>
                </div>
              </MenuItem>
            ) : <MenuItem disabled style={{ minHeight: 'auto' }}>
                <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                  <Info fontSize="small" />
                </ListItemIcon>
                <Typography variant="caption">
                  You have no active notifications
                </Typography>
              </MenuItem>
          }
          <Divider className={classes.divider} />
          <MenuItem style={{ minHeight: 'auto' }} onClick={viewAll}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
              <Typography variant="caption">
                Show all
              </Typography>
            </div>
          </MenuItem>
        </Menu>

        <IconButton className={classes.profileButton} onClick={handleMenu('account')}>
          <Avatar alt="Remy Sharp" src={`${host}${user.photo}`} />
        </IconButton>
        <Menu classes={{ list: classes.menuList }} id="menu-appbar" anchorEl={anchorEl.account} anchorOrigin={{ vertical: 'top', horizontal: 'right', }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right', }} open={Boolean(anchorEl.account)} onClose={handleClose('account')} >
          <MenuItem onClick={profile}>
            <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Profile</Typography>
          </MenuItem>
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
