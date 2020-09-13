import {
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Icon,
  IconButton,
  Link,
  ListItemIcon,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import { Alert, Skeleton } from '@material-ui/lab';
import axios from 'axios';
import clsx from 'clsx';
import { authHeaderJSON, history, host } from 'helpers';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch } from 'react-redux';
import { error, title as ucWords } from 'utils';
import { actions } from '_redux';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2)
    }
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  colorPreview: {
    fontSize: '0.8rem'
  },
  alerts: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  main: {
    display: 'flex',
    justifyContent: 'center'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  fullHeight: {
    paddingTop: '100%',
    transform: 'scale(1, 1) !important'
  },
  disableScale: {
    transform: 'scale(1, 1) !important'
  },
  owner: {
    fontSize: 11
  },
  iconButton: {
    fontSize: 15,
    margin: 5
  },
  cardContent: {
    '&:last-child': {
      paddingBottom: '14px'
    }
  },
  rootTitleDialog: {
    flex: '0 0 auto',
    margin: 0,
    padding: '24px 24px'
  },
  expansionPanelContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center'
  },
  expansionPanelRoot: {
    cursor: 'default !important',
    '&:hover': {
      cursor: 'default !important'
    }
  },
  expansionPanelDetails: {
    position: 'relative'
  },
  lessDetails: {
    position: 'absolute',
    right: 10,
    bottom: 10
  },
  listItemIconRoot: {
    minWidth: '30px'
  },
  heading: {
    display: 'block',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: theme.typography.pxToRem(15),
    minWidth: 0
  },
  iconsHeading: {
    fontSize: theme.typography.pxToRem(15),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'end',
    alignItems: 'center',
    marginLeft: theme.spacing(1)
  },
  paper: {
    '&:hover div.actions': {
      display: 'flex !important'
    },
    '&:focus div.actions': {
      display: 'flex !important'
    },
    '&:active div.actions': {
      display: 'flex !important'
    }
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  alignItemsEnd: {
    alignItems: 'center',
    height: 31
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  firstRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  paperContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: theme.spacing(1.5),
    height: '100%'
  },
  background: {
    backgroundSize: 'cover',
    borderBottomLeftRadius: theme.shape.borderRadius,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    paddingTop: '68.25%',
    height: 0,
    position: 'relative',
    minHeight: '100%'
  }
}));

const default_ = { name: '', owner: '' };

export default function List(props) {
  const classes = useStyles();
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.up('sm'));
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [filter, setFilter] = useState([]);

  const [dialog, setDialog] = useState(false);
  const [deleting, setDeleting] = useState(default_);

  const getIcon = state => {
    switch (state) {
      case 'active':
        return (
          <Icon
            fontSize="default"
            className="fal fa-check-circle text-success"
          />
        );
      case 'stopped':
        return (
          <Icon
            fontSize="default"
            className="fal fa-play-circle text-secondary"
          />
        );
      case 'builded':
        return (
          <Icon
            fontSize="default"
            className=" mt-1 fal fa-rocket text-secondary"
          />
        );
      default:
        return (
          <Icon
            fontSize="default"
            className="fal fa-play-circle text-secondary"
          />
        );
    }
  };

  const handleDialog = (value = !dialog) => () => {
    setDialog(value);
  };

  const handleModule = (index, name, value) => {
    let aux = [...filter];
    aux[index] = { ...aux[index], [name]: value };
    setModules(
      modules.map(item =>
        item.id === aux[index].id ? { ...item, [name]: value } : item
      )
    );
    setFilter(aux);
  };

  const cancelDelete = () => {
    handleDialog(false)();
  };

  const deleteModule = () => {
    handleDialog(false)();
    handleModule(deleting.index, 'loading', true);
    axios
      .delete(`${host}/module/delete/${deleting.image_name}`, authHeaderJSON())
      .then(function(res) {
        handleModule(deleting.index, 'loading', false);
        setModules(modules =>
          modules.filter(item => item.image_name !== deleting.image_name)
        );
        setFilter(filter =>
          filter.filter(item => item.image_name !== deleting.image_name)
        );
        setDeleting(default_);
      })
      .catch(function(err) {
        console.error(err);
        handleModule(deleting.index, 'loading', false);
        setDeleting(default_);
      });
  };

  const show = id => () => {
    dispatch(actions.startLoading());
    history.push(`/module/${id}`);
    dispatch(actions.finishLoading());
  };

  const showUser = id => () => {
    dispatch(actions.startLoading());
    history.push(`/account/${id}`);
    dispatch(actions.finishLoading());
  };

  const run = id => () => {
    dispatch(actions.startLoading());
    history.push(`/module/run/${id}`);
    dispatch(actions.finishLoading());
  };

  const showTest = id => () => {
    dispatch(actions.startLoading());
    history.push(`/subscriptions/${id}`);
    dispatch(actions.finishLoading());
  };

  const handleClick = index => event => {
    handleModule(index, 'anchor', event.currentTarget);
  };

  const handleClose = index => () => {
    handleModule(index, 'anchor', null);
  };

  useEffect(() => {
    axios
      .get(`${host}/accounts/subscriptions`, authHeaderJSON())
      .then(function(res) {
        setModules(res.data.map(item => ({ ...item, anchor: null })));
        setFilter(res.data.map(item => ({ ...item, anchor: null })));
        setLoading(false);
      })
      .catch(function(err) {
        error(err);
      });
  }, []);

  return (
    <>
      <div className={classes.root}>
        {loading ? (
          <>
            <Grid container className="mt-3" justify="center" direction="row">
              <Grid item xs={12} sm={10} md={8} xl={6}>
                <div className={clsx(classes.main, 'm-2')}>
                  <Skeleton
                    className={classes.disableScale}
                    animation="wave"
                    width="100%"
                    height={50}
                    variant="text"
                  />
                </div>
              </Grid>
            </Grid>
            <>
              <Grid container className="mt-3" style={{ maxWidth: '100%' }}>
                {[1, 2, 3, 4, 5, 6].map(item => (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    lg={4}
                    key={item}
                    className="p-2">
                    <ExpansionPanel
                      expanded={false}
                      className={classes.fullWidth}>
                      <ExpansionPanelSummary
                        classes={{
                          content: classes.expansionPanelContent,
                          root: classes.expansionPanelRoot
                        }}
                        aria-controls="panel1bh-content">
                        <div className={classes.title}>
                          <Typography className={classes.heading}>
                            <Skeleton
                              animation="wave"
                              variant="text"
                              height={20}
                              width={200}
                            />
                          </Typography>

                          <Typography variant="caption">
                            <Skeleton
                              animation="wave"
                              variant="text"
                              height={10}
                              width={80}
                            />
                          </Typography>
                        </div>

                        <div className={classes.iconsHeading}>
                          <Skeleton
                            animation="wave"
                            variant="circle"
                            width={16}
                            height={16}
                          />
                          <Skeleton
                            animation="wave"
                            variant="circle"
                            width={16}
                            height={16}
                          />
                          <Skeleton
                            animation="wave"
                            variant="circle"
                            width={16}
                            height={16}
                          />
                          <Skeleton
                            animation="wave"
                            variant="circle"
                            width={16}
                            height={16}
                          />
                        </div>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails
                        classes={{ root: classes.expansionPanelDetails }}>
                        <Typography>
                          {item.description || 'Description not supplied'}
                        </Typography>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  </Grid>
                ))}
              </Grid>
            </>
          </>
        ) : (
          <>
            <Grid container justify="center" direction="row">
              <Grid item xs={12}>
                <Breadcrumbs aria-label="breadcrumb" maxItems={sm ? 8 : 2}>
                  <Typography color="textSecondary">Subscriptions</Typography>
                </Breadcrumbs>
              </Grid>
            </Grid>
            {modules.length === 0 ? (
              <Grid container className="mt-3" justify="center" direction="row">
                <Grid item xs={12} sm={10} md={8} xl={6}>
                  <Alert
                    severity="info"
                    variant="outlined"
                    className={clsx('mt-3', classes.alerts)}>
                    There are no records
                  </Alert>
                </Grid>
              </Grid>
            ) : (
              <>
                {filter.length === 0 ? (
                  <Grid
                    container
                    className="mt-3"
                    justify="center"
                    direction="row">
                    <Grid item xs={12} sm={10} md={8} xl={6}>
                      <Alert
                        severity="info"
                        variant="outlined"
                        className={clsx('mt-3', classes.alerts)}>
                        No concurrences were found
                      </Alert>
                    </Grid>
                  </Grid>
                ) : null}
                <Grid container className="mt-3" style={{ maxWidth: '100%' }}>
                  {filter.map((item, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      xl={4}
                      key={index}
                      className="p-2">
                      <Paper className={classes.paper} variant="outlined">
                        <Grid container>
                          <Grid item xs={5} sm={5} md={4} lg={4} xl={4}>
                            <div
                              className={classes.background}
                              style={{
                                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${host}${item.background})`
                              }}
                            />
                          </Grid>
                          <Grid item xs={7} sm={7} md={8} lg={8} l={8}>
                            <div className={classes.paperContent}>
                              <div className={classes.firstRow}>
                                <Tooltip
                                  title={
                                    item.state === 'stopped'
                                      ? 'This algorithm is under maintenance'
                                      : 'You can use it'
                                  }
                                  className="mr-2 mt-1">
                                  {getIcon(item.state)}
                                </Tooltip>
                                <div className={classes.header}>
                                  <Typography noWrap>
                                    <Link onClick={show(item.image_name)}>
                                      {ucWords(item.name)}
                                    </Link>
                                  </Typography>
                                  <Typography variant="caption" noWrap>
                                    <Link onClick={showUser(item.user.id)}>
                                      {ucWords(
                                        `${item.user.first_name} ${item.user.last_name}`
                                      )}
                                    </Link>
                                  </Typography>
                                </div>
                              </div>

                              <div
                                className={clsx(
                                  classes.details,
                                  classes.alignItemsEnd
                                )}>
                                <Typography
                                  noWrap
                                  variant="caption"
                                  color="textSecondary">
                                  {item.description}
                                </Typography>
                                <div
                                  style={{
                                    display: isMobile ? 'flex' : 'none'
                                  }}
                                  className="actions">
                                  {sm ? (
                                    <>
                                      {item.state === 'active' ? (
                                        <Tooltip title="Test algorith">
                                          <IconButton
                                            size="small"
                                            onClick={run(item.image_name)}>
                                            <Icon
                                              fontSize="small"
                                              className={clsx(
                                                classes.iconButton,
                                                'fal fa-vial'
                                              )}
                                            />
                                          </IconButton>
                                        </Tooltip>
                                      ) : null}
                                      <Tooltip title="All test">
                                        <IconButton
                                          size="small"
                                          onClick={showTest(item.image_name)}>
                                          <Icon
                                            fontSize="small"
                                            className={clsx(
                                              classes.iconButton,
                                              'fal fa-clipboard-list'
                                            )}
                                          />
                                        </IconButton>
                                      </Tooltip>
                                    </>
                                  ) : (
                                    <>
                                      <IconButton
                                        size="small"
                                        onClick={handleClick(index)}>
                                        <Icon
                                          fontSize="small"
                                          className={clsx(
                                            classes.iconButton,
                                            'fal fa-ellipsis-v'
                                          )}
                                        />
                                      </IconButton>
                                      <Menu
                                        anchorEl={item.anchor}
                                        anchorOrigin={{
                                          vertical: 'top',
                                          horizontal: 'right'
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                          vertical: 'top',
                                          horizontal: 'right'
                                        }}
                                        open={Boolean(item.anchor)}
                                        onClose={handleClose(index)}>
                                        {item.state === 'active' ? (
                                          <MenuItem
                                            onClick={run(item.image_name)}>
                                            <ListItemIcon
                                              classes={{
                                                root: classes.listItemIconRoot
                                              }}>
                                              <Icon
                                                fontSize="small"
                                                className={clsx(
                                                  classes.iconButton,
                                                  'fal fa-vial'
                                                )}
                                              />
                                            </ListItemIcon>
                                            <Typography variant="inherit">
                                              Test algorith
                                            </Typography>
                                          </MenuItem>
                                        ) : null}
                                        <MenuItem
                                          onClick={showTest(item.image_name)}>
                                          <ListItemIcon
                                            classes={{
                                              root: classes.listItemIconRoot
                                            }}>
                                            <Icon
                                              fontSize="small"
                                              className={clsx(
                                                classes.iconButton,
                                                'fal fa-clipboard-list'
                                              )}
                                            />
                                          </ListItemIcon>
                                          <Typography variant="inherit">
                                            All test
                                          </Typography>
                                        </MenuItem>
                                      </Menu>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                <Dialog
                  open={dialog}
                  keepMounted
                  onClose={cancelDelete}
                  aria-labelledby="alert-dialog-slide-title"
                  aria-describedby="alert-dialog-slide-description">
                  <DialogTitle
                    id="alert-dialog-slide-title"
                    classes={{
                      root: classes.rootTitleDialog
                    }}>{`Module ${deleting.name}`}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                      {`¿Do want delete background "${deleting.name}"?`}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={cancelDelete}>Cancel</Button>
                    <Button onClick={deleteModule}>Confirm</Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
