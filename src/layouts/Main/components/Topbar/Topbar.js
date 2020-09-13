import {
  AppBar,
  Badge,
  Container,
  Divider,
  fade,
  Icon,
  IconButton,
  InputBase,
  Menu,
  Toolbar,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuItem from '@material-ui/core/MenuItem';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { Warning } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import clsx from 'clsx';
import { authHeaderJSON, history, host, ws as ws_host } from 'helpers';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { format_date, PushNotification } from 'utils';
import { actions } from '_redux';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  icon: {
    color: '#fff'
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
    marginBottom: theme.spacing(1)
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
  },
  container: {
    [theme.breakpoints.down('md')]: {
      paddingLeft: 0,
      paddingRight: 0
    }
  },
  inputRoot: {
    color: 'inherit'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    border: '1px solid #fff',
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.15)
    },
    marginLeft: theme.spacing(1),
    width: '100%',
    marginRight: 12,
    [theme.breakpoints.up('sm')]: {
      width: 'auto'
    }
  },
  searchIcon: {
    paddingLeft: theme.spacing(1),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(4px + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '14ch',
      '&:focus': {
        width: '20ch'
      }
    }
  },
  avatarFilter: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  },
  avatarIcon: {
    paddingLeft: 12,
    paddingRight: 0,
    [theme.breakpoints.up('sm')]: {
      paddingRight: 12
    }
  },
  img: {
    height: theme.spacing(5)
  }
}));

const default_ = { word: '', dockers: [], users: [] };

const Topbar = props => {
  const { className, onSidebarOpen, window, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const notMobile = useMediaQuery(theme.breakpoints.up('sm'));
  const md = useMediaQuery(theme.breakpoints.up('md'));
  const user = useSelector(state => state.user);

  const trigger = useScrollTrigger({ target: window ? window() : undefined });
  const [anchorEl, setAnchorEl] = useState({
    account: null,
    notifications: null,
    options: null,
    search: false
  });
  const [ws, setWs] = useState(null);
  const [filter, setFilter] = useState(default_);
  const [notifications, setNotifications] = useState([]);

  const getIcon = state => {
    switch (state) {
      case 'success':
        return (
          <Icon
            fontSize="default"
            className="fal fa-check-circle text-success"
          />
        );

      case 'warning':
        return <Warning fontSize="small" />;

      case 'error':
        return (
          <Icon
            fontSize="default"
            className="fal fa-exclamation-circle text-secondary"
          />
        );

      default:
        break;
    }
  };

  const handleFilter = e => {
    e.persist();
    setFilter(filter => ({ ...filter, word: e.target.value }));

    if (e.target.value.length > 3) {
      handleMenu('search')(e);

      axios
        .put(
          `${host}/accounts/find`,
          { value: e.target.value },
          authHeaderJSON()
        )
        .then(function(res) {
          console.log(res.data);
          setFilter(filter => ({
            ...filter,
            users: res.data.users,
            dockers: res.data.dockers
          }));
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  };

  const handleMenu = key => event => {
    event.persist();
    const newAnchorEl = { ...anchorEl, [key]: event.currentTarget };
    setAnchorEl(newAnchorEl);
  };

  const handleClose = key => () => {
    const newAnchorEl = { ...anchorEl, [key]: null };
    setAnchorEl(newAnchorEl);
  };

  const closeFilter = () => {
    handleClose('search')();
  };

  const to = (id, index, link) => () => {
    dispatch(actions.startLoading());
    axios
      .put(`${host}/accounts/notifications/${id}`, {}, authHeaderJSON())
      .then(function(res) {
        handleClose('notifications')();
        history.push(link);
        deleteNotification(index);
        dispatch(actions.finishLoading());
      })
      .catch(function(err) {
        console.log(err);
        handleClose('notifications')();
        dispatch(actions.finishLoading());
      });
  };

  const viewAll = () => {
    dispatch(actions.startLoading());
    history.push('/notifications');
    dispatch(actions.finishLoading());
  };

  const updateProfile = () => {
    dispatch(actions.startLoading());
    history.push('/account/edit');
    dispatch(actions.finishLoading());
  };

  const profile = () => {
    dispatch(actions.startLoading());
    history.push('/account');
    dispatch(actions.finishLoading());
  };

  const toView = url => () => {
    dispatch(actions.startLoading());
    setFilter(default_);
    history.push(url);
    dispatch(actions.finishLoading());
  };

  const addNotification = data => {
    setNotifications(notifications => [...data.content, ...notifications]);
    if (data.action === 'append') {
      const item = data.content[0];
      const notification = new PushNotification({
        action: item.link,
        title: item.title,
        body: item.description
      });
      notification.notify();
    }
  };

  const deleteNotification = index => {
    setNotifications(notifications => {
      let aux = [...notifications];
      aux.splice(index, 1);
      return aux;
    });
  };

  const connect = () => {
    const webSocket = new WebSocket(`${ws_host}/ws/notifications/${user.id}`);
    webSocket.onmessage = e => {
      const data = JSON.parse(e.data);

      if (data.action === 'append' || data.action === 'fetch')
        addNotification(data);
    };
    return webSocket;
  };

  useEffect(() => {
    new PushNotification().checkPermission();
    setWs(connect());
    return () => {
      if (ws) ws.close();
    };
  }, []);

  useEffect(() => {
    console.log(anchorEl);
  }, [anchorEl]);

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <AppBar
        {...rest}
        color="primary"
        className={clsx(classes.root, className)}>
        <Container maxWidth="lg">
          <Toolbar className={clsx(classes.flexGrow, classes.container)}>
            <RouterLink to="/dashboard">
              <img
                alt="Logo"
                src="/images/logos/logo--white.svg"
                className={classes.img}
              />
            </RouterLink>
            <div className={classes.flexGrow} />
            {notMobile && user.role !== 'developer' ? (
              <>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <Icon fontSize="small" className={clsx('fal fa-search')} />
                  </div>
                  <InputBase
                    placeholder="Search"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput
                    }}
                    value={filter.word}
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={handleFilter}
                    onBlur={handleClose('search')}
                  />
                </div>
                <Menu
                  classes={{ list: classes.menuList, paper: classes.menuPaper }}
                  anchorEl={anchorEl.search}
                  anchorOrigin={{ vertical: 55, horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={
                    Boolean(anchorEl.search) && Boolean(filter.word.length > 3)
                  }
                  onClose={closeFilter}
                  autoFocus={false}
                  disableAutoFocus
                  disableEnforceFocus
                  getContentAnchorEl={null}>
                  {filter.users.map(item => (
                    <MenuItem
                      key={item.id}
                      onClick={toView(`/account/${item.id}`)}>
                      <ListItemIcon
                        classes={{ root: classes.listItemIconRoot }}>
                        <Avatar
                          src={host + item.photo}
                          className={classes.avatarFilter}
                        />
                      </ListItemIcon>
                      <Typography className="ml-2" variant="inherit" noWrap>
                        {item.first_name} {item.last_name}
                      </Typography>
                    </MenuItem>
                  ))}

                  {filter.dockers.map(item => (
                    <MenuItem
                      key={item.image_name}
                      onClick={toView(`/module/${item.image_name}`)}>
                      <ListItemIcon
                        classes={{ root: classes.listItemIconRoot }}>
                        <Avatar
                          src={host + item.background}
                          className={classes.avatarFilter}
                        />
                      </ListItemIcon>
                      <Typography className="ml-2" variant="inherit" noWrap>
                        {item.name}
                      </Typography>
                    </MenuItem>
                  ))}
                  <MenuItem onClick={toView(`/algorithms/${filter.word}`)}>
                    <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                      <Icon
                        fontSize="small"
                        className={clsx('fal fa-search')}
                      />
                    </ListItemIcon>
                    <Typography className="ml-2" variant="inherit" noWrap>
                      Algorithms with: "{filter.word}"
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : null}

            {md ? (
              <>
                <Tooltip title="Dashboard" placement="bottom">
                  <IconButton onClick={toView('/dashboard')}>
                    <Icon
                      fontSize="small"
                      className={clsx('fal fa-tachometer-alt', classes.icon)}
                    />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Algorithms" placement="bottom">
                  <IconButton
                    onClick={toView(
                      user.role === 'user' ? '/algorithms' : '/module'
                    )}>
                    <Icon
                      fontSize="small"
                      className={clsx('fal fa-code', classes.icon)}
                    />
                  </IconButton>
                </Tooltip>

                {user.role === 'developer' ? (
                  <Tooltip title="New algorithm" placement="bottom">
                    <IconButton onClick={toView('/module/create')}>
                      <Icon
                        fontSize="small"
                        className={clsx('fal fa-plus', classes.icon)}
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Subscriptions" placement="bottom">
                    <IconButton onClick={toView('/subscriptions')}>
                      <Icon
                        fontSize="small"
                        className={clsx('fal fa-anchor', classes.icon)}
                      />
                    </IconButton>
                  </Tooltip>
                )}

                <Tooltip title="Running" placement="bottom">
                  <IconButton onClick={toView('/module/experiment')}>
                    <Icon
                      fontSize="small"
                      className={clsx('fal fa-running', classes.icon)}
                    />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="Options" placement="bottom">
                  <IconButton onClick={handleMenu('options')}>
                    <Icon
                      fontSize="small"
                      className={clsx('fal fa-ellipsis-v', classes.icon)}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  classes={{ list: classes.menuList }}
                  anchorEl={anchorEl.options}
                  anchorOrigin={{ vertical: 60, horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  getContentAnchorEl={null}
                  open={Boolean(anchorEl.options)}
                  onClose={handleClose('options')}>
                  <MenuItem onClick={toView('/dashboard')}>
                    <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                      <Icon
                        fontSize="small"
                        className={clsx('fal fa-tachometer-alt')}
                        style={{ marginRight: 10, width: '1.6rem' }}
                      />
                    </ListItemIcon>
                    <Typography variant="inherit">Dashboard</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={toView(
                      user.role === 'user' ? '/algorithms' : '/module'
                    )}>
                    <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                      <Icon
                        fontSize="small"
                        className={clsx('fal fa-code')}
                        style={{ marginRight: 10, width: '1.6rem' }}
                      />
                    </ListItemIcon>
                    <Typography variant="inherit">Algorithms</Typography>
                  </MenuItem>
                  {user.role === 'developer' ? (
                    <MenuItem onClick={toView('/module/create')}>
                      <ListItemIcon
                        classes={{ root: classes.listItemIconRoot }}>
                        <Icon
                          fontSize="small"
                          className={clsx('fal fa-plus')}
                          style={{ marginRight: 10, width: '1.6rem' }}
                        />
                      </ListItemIcon>
                      <Typography variant="inherit">New algorithm</Typography>
                    </MenuItem>
                  ) : (
                    <MenuItem onClick={toView('/subscriptions')}>
                      <ListItemIcon
                        classes={{ root: classes.listItemIconRoot }}>
                        <Icon
                          fontSize="small"
                          className={clsx('fal fa-anchor')}
                          style={{ marginRight: 10, width: '1.6rem' }}
                        />
                      </ListItemIcon>
                      <Typography variant="inherit">Subscriptions</Typography>
                    </MenuItem>
                  )}
                  <MenuItem onClick={toView('/module/experiment')}>
                    <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                      <Icon
                        fontSize="small"
                        className={clsx('fal fa-running')}
                        style={{ marginRight: 10, width: '1.6rem' }}
                      />
                    </ListItemIcon>
                    <Typography variant="inherit">Running</Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
            <IconButton onClick={handleMenu('notifications')}>
              <Badge
                badgeContent={notifications.length}
                max={9}
                overlap="circle"
                color="secondary"
                children={
                  <Icon
                    fontSize="small"
                    className={clsx('fal fa-bell text-white')}
                  />
                }
              />
            </IconButton>
            <Menu
              classes={{ list: classes.menuList, paper: classes.menuPaper }}
              anchorEl={anchorEl.notifications}
              anchorOrigin={{ vertical: 60, horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              getContentAnchorEl={null}
              open={Boolean(anchorEl.notifications)}
              onClose={handleClose('notifications')}>
              <MenuItem
                style={{
                  cursor: 'default',
                  pointerEvents: 'none',
                  minHeight: 'auto'
                }}>
                <Typography variant="caption">Notifications</Typography>
              </MenuItem>
              <Divider className={classes.divider} />
              {notifications.length > 0 ? (
                notifications
                  .slice(0, notifications.length > 5 ? 5 : notifications.length)
                  .map((item, key) => (
                    <MenuItem
                      key={key}
                      onClick={to(item.id, key, item.link)}
                      style={{ minHeight: 'auto' }}>
                      <ListItemIcon
                        classes={{ root: classes.listItemIconRoot }}>
                        {getIcon(item.kind)}
                      </ListItemIcon>

                      <div className={classes.description}>
                        <Typography variant="inherit" noWrap>
                          {item.title}
                        </Typography>
                        <Typography variant="caption" noWrap>
                          {format_date(item.created_at)}
                        </Typography>
                      </div>
                    </MenuItem>
                  ))
              ) : (
                <MenuItem disabled style={{ minHeight: 'auto' }}>
                  <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                    <Icon
                      fontSize="small"
                      className={clsx('fal fa-info-circle')}
                    />
                  </ListItemIcon>
                  <Typography variant="caption">
                    You have no active notifications
                  </Typography>
                </MenuItem>
              )}
              <Divider className={classes.divider} />
              <MenuItem style={{ minHeight: 'auto' }} onClick={viewAll}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    flex: 1
                  }}>
                  <Typography variant="caption">Show all</Typography>
                </div>
              </MenuItem>
            </Menu>

            <IconButton
              onClick={handleMenu('account')}
              className={classes.avatarIcon}>
              <Avatar
                alt={user.first_name}
                src={`${host}${user.photo}`}
                className={classes.avatar}
              />
            </IconButton>
            <Menu
              classes={{ list: classes.menuList }}
              anchorEl={anchorEl.account}
              anchorOrigin={{ vertical: 70, horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              getContentAnchorEl={null}
              open={Boolean(anchorEl.account)}
              onClose={handleClose('account')}>
              <MenuItem onClick={profile}>
                <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                  <Icon
                    fontSize="small"
                    className={clsx('fal fa-user-circle')}
                  />
                </ListItemIcon>
                <Typography variant="inherit">Profile</Typography>
              </MenuItem>
              <MenuItem onClick={updateProfile}>
                <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                  <Icon fontSize="small" className={clsx('fal fa-cog')} />
                </ListItemIcon>
                <Typography variant="inherit">Settings</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(actions.logout())}>
                <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                  <Icon
                    fontSize="small"
                    className={clsx('fal fa-sign-out-alt')}
                  />
                </ListItemIcon>
                <Typography variant="inherit">Logout</Typography>
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>
    </Slide>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
