import {
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Fab,
  Grid,
  Icon,
  IconButton,
  LinearProgress,
  Link,
  ListItemIcon,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  TablePagination,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import { Alert, Skeleton } from '@material-ui/lab';
import axios from 'axios';
import clsx from 'clsx';
import { authHeaderJSON, history, host, ws } from 'helpers';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { format_date as getDate, real_date, title as ucWords } from 'utils';
import errores from 'utils/error';
import { actions } from '_redux';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2)
    }
  },
  listItemIconRoot: {
    minWidth: '30px'
  },
  date: {
    whiteSpace: 'noWrap'
  },
  error: {
    backgroundColor: theme.palette.error.main
  },
  success: {
    backgroundColor: theme.palette.success.main
  },
  inherit: {
    backgroundColor: theme.palette.primary.main
  },
  card: {
    margin: theme.spacing(1)
  },
  file: {
    padding: theme.spacing(1.3),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  pagination: {
    borderBottom: 0
  },
  selectRoot: {
    marginRight: theme.spacing(2)
  },
  linearProgressRoot: {
    height: 2
  },
  iconButton: {
    fontSize: 15,
    margin: 5,
    width: 'auto'
  }
}));

export default function({ match }) {
  const classes = useStyles();
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.up('sm'));
  const dispatch = useDispatch();
  const access = useSelector(state => state.user.id);
  const user = useSelector(state => state.user);

  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [rows, setRows] = useState(5);
  const [page, setPage] = useState(0);
  const [module, setModule] = useState({});
  const [experiments, setExperiments] = useState([]);
  const [all, setAll] = useState([]);

  const getClass = progress => {
    if (progress.length > 0) {
      switch (progress[progress.length - 1].state) {
        case 'success':
          return classes.success;
        case 'error':
          return classes.error;
        default:
          return classes.inherit;
      }
    }
  };

  const algorithms = () => {
    dispatch(actions.startLoading());
    history.push(user.role === 'developer' ? '/module' : '/subscriptions');
    dispatch(actions.finishLoading());
  };

  const show = id => () => {
    dispatch(actions.startLoading());
    history.push(`/module/experiment/${id}`);
    dispatch(actions.finishLoading());
  };

  const showModule = () => {
    dispatch(actions.startLoading());
    history.push(`/module/${match.params.id}`);
    dispatch(actions.finishLoading());
  };

  const connect = (id, index) => {
    const webSocket = new WebSocket(`${ws}/ws/execute/${access}/${id}`);
    webSocket.onmessage = e => {
      const data = JSON.parse(e.data);
      addMessage(index, data);
    };
    return webSocket;
  };

  const addMessage = (index, value) => {
    let finished = false;
    value.forEach(element => {
      if (element.state === 'success') finished = true;
    });

    setExperiments(experiments => {
      let temp = [...experiments];
      if (finished) {
        closeIfExits(temp, index);
      }
      temp[index] = finished
        ? {
            ...temp[index],
            states: [...temp[index].states, ...value],
            state: 'executed'
          }
        : { ...temp[index], states: [...temp[index].states, ...value] };
      return temp;
    });
  };

  const closeIfExits = (list_, index) => {
    if (list_[index].ws) list_[index].ws.close();
  };

  const deleteItem = index => {
    setAll(all => {
      let temp = [...all];
      temp.some((item, key) => {
        if (item.id === experiments[index].id) {
          temp.splice(key, 1);
          return true;
        } else return false;
      });
      return temp;
    });
  };

  const deleting = () => {
    axios
      .delete(
        `${host}/accounts/experiment/delete/${experiments[dialog].id}`,
        authHeaderJSON()
      )
      .then(function(res) {
        setDialog(false);
        deleteItem(dialog);
        setPage(0);
      })
      .catch(function(err) {
        console.log(err);
        setDialog(false);
      });
  };

  const clone = index => () => {
    dispatch(actions.startLoading());
    axios
      .post(
        `${host}/accounts/experiment/clone/${experiments[index].id}`,
        {},
        authHeaderJSON()
      )
      .then(function(res) {
        history.push(`/module/run/${match.params.id}`);
        dispatch(actions.finishLoading());
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  const triedDelete = index => () => {
    handleClose(index)();
    setDialog(index);
  };

  const cancelDelete = () => {
    setDialog(false);
  };

  const newTest = () => {
    dispatch(actions.startLoading());
    history.push(`/module/run/${match.params.id}`);
    dispatch(actions.finishLoading());
  };

  const handleExperiments = (index, name, value) => {
    let aux = [...experiments];
    aux[index] = { ...aux[index], [name]: value };
    setExperiments(aux);
  };

  const handleClick = index => event => {
    handleExperiments(index, 'anchor', event.currentTarget);
  };

  const handleClose = index => () => {
    handleExperiments(index, 'anchor', null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setExperiments(
      changeExperiments(all.slice(rows * newPage, (newPage + 1) * rows))
    );
  };

  const handleChangeRowsPerPage = event => {
    const new_rows = event.target.value;
    setRows(new_rows);
    setPage(0);
    setExperiments(changeExperiments(all.slice(0, new_rows)));
  };

  const changeExperiments = list => {
    experiments.forEach(exp => {
      if (exp.ws) exp.ws.close();
    });

    return list.map((item, index) =>
      item.state === 'executing'
        ? { ...item, ws: connect(item.id, index), states: [], anchor: null }
        : { ...item, states: item.records, anchor: null }
    );
  };

  useEffect(() => {
    axios
      .get(
        `${host}/accounts/subscriptions/${match.params.id}`,
        authHeaderJSON()
      )
      .then(function(res) {
        setAll([...res.data.test]);
        setModule(res.data.docker);
        setLoading(false);
      })
      .catch(function(err) {
        errores(err);
        console.error(err.response);
      });
    return () => {
      experiments.forEach(({ ws }) => {
        if (ws) ws.close();
      });
    };
  }, []);

  useEffect(() => {
    setExperiments(experiments => {
      experiments.forEach(exp => {
        if (exp.ws) exp.ws.close();
      });

      const data = [...all]
        .splice(0, rows)
        .map((item, index) =>
          item.state === 'executing'
            ? { ...item, ws: connect(item.id, index), states: [], anchor: null }
            : { ...item, states: item.records, anchor: null }
        );
      return data;
    });
  }, [all]);

  return (
    <div className={classes.root}>
      {loading ? (
        <>
          <Grid container className="mt-3" style={{ maxWidth: '100%' }}>
            {[1, 2, 3, 4, 5, 6].map(item => (
              <Grid item lg={6} md={6} sm={6} xs={12} key={item}>
                <Card className="m-2">
                  <CardContent>
                    <Grid
                      container
                      direction="column"
                      justify="space-between"
                      alignItems="stretch"
                      spacing={3}>
                      <Grid item>
                        <Grid
                          container
                          direction="row"
                          justify="space-between"
                          alignItems="flex-start">
                          <Grid item>
                            <Skeleton
                              animation="wave"
                              variant="text"
                              height={10}
                              width={200}
                            />
                            <Skeleton
                              animation="wave"
                              variant="text"
                              height={10}
                              width={150}
                            />
                          </Grid>
                          <Grid item>
                            <Skeleton
                              animation="wave"
                              variant="text"
                              height={10}
                              width={40}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <>
          <Grid container justify="center" direction="row">
            <Grid item xs={12}>
              <Breadcrumbs aria-label="breadcrumb" maxItems={sm ? 8 : 2}>
                <Link color="inherit" onClick={algorithms}>
                  {user.role === 'developer' ? 'Algorithms' : 'Subscriptions'}
                </Link>
                <Link color="inherit" onClick={showModule}>
                  {ucWords(module.name)}
                </Link>
                <Typography color="textSecondary">Test</Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Grid container spacing={2} className="mt-3">
            {experiments.length > 0 ? (
              experiments.map((item, index) => (
                <Grid item xl={4} lg={6} md={6} sm={12} xs={12} key={item.id}>
                  <LinearProgress
                    color="primary"
                    variant="determinate"
                    value={
                      item.states.length > 0
                        ? parseInt(item.states[item.states.length - 1].progress)
                        : 0
                    }
                    classes={{
                      barColorPrimary: getClass(item.states),
                      root: classes.linearProgressRoot
                    }}
                  />
                  <Paper className={classes.file} variant="outlined">
                    <div className={classes.content} style={{ minWidth: 0 }}>
                      <div
                        className={clsx(classes.content, 'actions')}
                        style={{ display: isMobile ? 'flex' : 'none' }}>
                        {sm ? (
                          <>
                            <Tooltip className="mr-1" title="Show test">
                              <IconButton size="small" onClick={show(item.id)}>
                                <Icon
                                  fontSize="small"
                                  className={clsx(
                                    classes.iconButton,
                                    'fal fa-eye'
                                  )}
                                />
                              </IconButton>
                            </Tooltip>
                            {module.state !== 'active' ? (
                              <IconButton size="small" disabled={true}>
                                <Icon
                                  fontSize="small"
                                  className={clsx(
                                    classes.iconButton,
                                    'fal fa-clone'
                                  )}
                                />
                              </IconButton>
                            ) : (
                              <Tooltip title="Clone test with same data">
                                <IconButton size="small" onClick={clone(index)}>
                                  <Icon
                                    fontSize="small"
                                    className={clsx(
                                      classes.iconButton,
                                      'fal fa-clone'
                                    )}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                            {item.state === 'executed' ? (
                              <>
                                <Tooltip className="mr-1" title="Delete test">
                                  <IconButton
                                    size="small"
                                    onClick={triedDelete(index)}>
                                    <Icon
                                      fontSize="small"
                                      className={clsx(
                                        classes.iconButton,
                                        'fal fa-trash-alt text-danger'
                                      )}
                                    />
                                  </IconButton>
                                </Tooltip>
                              </>
                            ) : null}
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
                              <MenuItem onClick={show(item.id)}>
                                <ListItemIcon
                                  classes={{ root: classes.listItemIconRoot }}>
                                  <Icon
                                    fontSize="small"
                                    className={clsx(
                                      classes.iconButton,
                                      'fal fa-eye'
                                    )}
                                  />
                                </ListItemIcon>
                                <Typography variant="inherit">
                                  Show test
                                </Typography>
                              </MenuItem>
                              {module.state !== 'active' ? null : (
                                <MenuItem onClick={clone(index)}>
                                  <ListItemIcon
                                    classes={{
                                      root: classes.listItemIconRoot
                                    }}>
                                    <Icon
                                      fontSize="small"
                                      className={clsx(
                                        classes.iconButton,
                                        'fal fa-clone'
                                      )}
                                    />
                                  </ListItemIcon>
                                  <Typography variant="inherit">
                                    Clone test with same data
                                  </Typography>
                                </MenuItem>
                              )}
                              {item.state === 'executed' ? (
                                <MenuItem onClick={triedDelete(index)}>
                                  <ListItemIcon
                                    classes={{
                                      root: classes.listItemIconRoot
                                    }}>
                                    <Icon
                                      fontSize="small"
                                      className={clsx(
                                        classes.iconButton,
                                        'fal fa-trash-alt text-danger'
                                      )}
                                    />
                                  </ListItemIcon>
                                  <Typography variant="inherit">
                                    Delete test
                                  </Typography>
                                </MenuItem>
                              ) : null}
                            </Menu>
                          </>
                        )}
                      </div>
                      <Tooltip
                        className="ml-1"
                        title={
                          item.states.length > 0
                            ? item.states[item.states.length - 1].description
                            : 'Starting process...'
                        }
                        style={{ marginTop: 6, marginBottom: 7 }}>
                        <Typography
                          noWrap
                          align="left"
                          variant="body2"
                          className="mr-2">
                          {item.states.length > 0
                            ? item.states[item.states.length - 1].description
                            : 'Starting process...'}
                        </Typography>
                      </Tooltip>
                    </div>

                    <Tooltip title={real_date(item.updated_at)}>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        className={classes.date}>
                        {getDate(item.updated_at)}
                      </Typography>
                    </Tooltip>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Grid container justify="center" direction="row">
                <Grid item xs={12} sm={10} md={8} xl={6}>
                  <Alert
                    severity="info"
                    variant="outlined"
                    className={clsx('mt-3', classes.alerts)}>
                    You don't have subscriptions yet
                  </Alert>
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid
            container
            className="mt-3"
            spacing={3}
            direction="row"
            justify="flex-end"
            alignItems="center">
            <Grid item>
              <TablePagination
                component="div"
                count={all.length}
                page={page}
                rowsPerPage={rows}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                rowsPerPageOptions={[5]}
                classes={{
                  root: classes.pagination,
                  selectRoot: classes.selectRoot
                }}
              />
            </Grid>
            <Grid item>
              {module.state !== 'active' ? (
                <Fab
                  disabled={true}
                  size="small"
                  color="primary"
                  aria-label="Test algorith">
                  <Icon fontSize="small" className="fal fa-vial text-white" />
                </Fab>
              ) : (
                <Tooltip title="Test algorith">
                  <Fab
                    disabled={module.state !== 'active'}
                    size="small"
                    color="primary"
                    aria-label="Test algorith"
                    onClick={newTest}>
                    <Icon fontSize="small" className="fal fa-vial text-white" />
                  </Fab>
                </Tooltip>
              )}
            </Grid>
          </Grid>
          <Dialog
            open={dialog !== false}
            keepMounted
            onClose={cancelDelete}
            maxWidth="xs"
            fullWidth>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                ¿Do want delete this test?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={cancelDelete}>Cancel</Button>
              <Button onClick={deleting}>Confirm</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
}
