import {
  Breadcrumbs,
  Card,
  CardContent,
  Grid,
  Icon,
  IconButton,
  LinearProgress,
  makeStyles,
  MobileStepper,
  Paper,
  Tooltip,
  Typography
} from '@material-ui/core';
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import { Alert, Skeleton } from '@material-ui/lab';
import axios from 'axios';
import clsx from 'clsx';
import { authHeaderJSON, history, host, ws } from 'helpers';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';
import { format_date as getDate, title as ucWords } from 'utils';
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
  alerts: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  owner: {
    fontSize: 11
  },
  cardContent: {
    position: 'relative',
    '&:last-child': {
      paddingBottom: '14px'
    }
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
  stepper: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    padding: 0
  },
  dots: {
    alignItems: 'center'
  },
  dot: {
    width: 6,
    height: 6
  },
  activeDot: {
    backgroundColor: 'inherit',
    width: 8,
    height: 8
  },
  group: {
    position: 'relative',
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
  file: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    '&:hover': {
      borderColor: '#b0b0b0'
    }
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%'
  },
  linearProgressRoot: {
    height: 2
  },
  iconButton: {
    fontSize: 15,
    margin: 5
  },
  date: {
    whiteSpace: 'noWrap'
  },
  floatButton: {
    position: 'absolute',
    borderRadius: '50%',
    zIndex: 1,
    bottom: 'calc(50% - 13px)',
    transition: 'all .3s ease-in-out',
    '&:hover': {
      borderColor: '#b0b0b0'
    }
  }
}));

export default function() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const access = useSelector(state => state.user.id);

  const [loading, setLoading] = useState(true);
  const [experiments, setExperiments] = useState([]);

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

  const connect = (id, group, index) => {
    const webSocket = new WebSocket(`${ws}/ws/execute/${access}/${id}`);
    webSocket.onmessage = e => {
      const data = JSON.parse(e.data);
      addMessage(group, index, data);
    };
    return webSocket;
  };

  const addMessage = (group, index, value) => {
    setExperiments(experiments => {
      let groups = [...experiments];
      let exp = groups[group].items;
      exp[index] = { ...exp[index], states: [...exp[index].states, ...value] };
      groups[group] = { ...groups[group], items: exp };
      return groups;
    });
  };

  const showTest = id => () => {
    dispatch(actions.startLoading());
    history.push(`/subscriptions/${id}`);
    dispatch(actions.finishLoading());
  };

  const show = id => () => {
    dispatch(actions.startLoading());
    history.push(`/module/experiment/${id}`);
    dispatch(actions.finishLoading());
  };

  const handleExperiments = (index, value) => () => {
    setExperiments(experiments => {
      let groups = [...experiments];
      groups[index] = { ...groups[index], index: value };
      return groups;
    });
  };

  const changeIndex = key => index => {
    setExperiments(experiments => {
      let groups = [...experiments];
      groups[key] = { ...groups[key], index: index };
      return groups;
    });
  };

  useEffect(() => {
    axios
      .get(`${host}/accounts/running`, authHeaderJSON())
      .then(function(res) {
        setExperiments(
          res.data.map((item, key) => ({
            index: 0,
            items: item.map((exp, index) => ({
              ...exp,
              ws: connect(exp.id, key, index),
              states: []
            }))
          }))
        );
        setLoading(false);
      })
      .catch(function(err) {
        errores(err);
        console.error(err.response);
      });
  }, []);

  return (
    <div className={classes.root}>
      {loading ? (
        <>
          <Grid container className="mt-3" style={{ maxWidth: '100%' }}>
            {['1_', '2_', '3_', '4_', '5_', '6_'].map(item => (
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
        <Grid container style={{ maxWidth: '100%' }}>
          <Grid item xs={12} className="mb-2">
            <Breadcrumbs aria-label="breadcrumb">
              <Typography color="textSecondary">Running</Typography>
            </Breadcrumbs>
          </Grid>
          {experiments.length > 0 ? (
            experiments.map((item, index) => (
              <Grid
                item
                lg={6}
                md={6}
                sm={6}
                xs={12}
                key={index}
                className={classes.group}>
                {item.index === 0 ? null : (
                  <Paper
                    variant="outlined"
                    style={{ display: isMobile ? 'flex' : 'none', left: 2 }}
                    className={clsx('actions', classes.floatButton)}>
                    <IconButton
                      size="small"
                      onClick={handleExperiments(index, item.index - 1)}
                      disabled={item.index === 0}>
                      <ArrowBack fontSize="small" />
                    </IconButton>
                  </Paper>
                )}

                <SwipeableViews
                  index={item.index}
                  onChangeIndex={changeIndex(index)}>
                  {item.items.map(exp => (
                    <div key={exp.id} className="mb-2 m-3">
                      <LinearProgress
                        color="primary"
                        variant="determinate"
                        value={
                          exp.states.length > 0
                            ? parseInt(
                                exp.states[exp.states.length - 1].progress
                              )
                            : 0
                        }
                        classes={{
                          barColorPrimary: getClass(exp.states),
                          root: classes.linearProgressRoot
                        }}
                      />
                      <Paper className={classes.file} variant="outlined">
                        <div className={classes.content}>
                          <Typography noWrap className="mr-2">
                            {ucWords(exp.docker.name)}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            style={{ whiteSpace: 'nowrap' }}>
                            {getDate(exp.created_at)}
                          </Typography>
                        </div>
                        <div className={classes.content}>
                          <Tooltip
                            title={
                              exp.states.length > 0
                                ? exp.states[exp.states.length - 1].description
                                : 'Starting process...'
                            }
                            style={{ marginTop: 6, marginBottom: 7 }}>
                            <Typography
                              noWrap
                              align="left"
                              variant="body2"
                              className="mr-2">
                              {exp.states.length > 0
                                ? exp.states[exp.states.length - 1].description
                                : 'Starting process...'}
                            </Typography>
                          </Tooltip>
                          <div
                            className={clsx('actions')}
                            style={{ display: isMobile ? 'flex' : 'none' }}>
                            <Tooltip className="mr-1" title="Show test">
                              <IconButton size="small" onClick={show(exp.id)}>
                                <Icon
                                  fontSize="small"
                                  className={clsx(
                                    classes.iconButton,
                                    'fal fa-eye'
                                  )}
                                />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="All test">
                              <IconButton
                                size="small"
                                onClick={showTest(exp.docker.image_name)}>
                                <Icon
                                  fontSize="small"
                                  className={clsx(
                                    classes.iconButton,
                                    'fal fa-clipboard-list'
                                  )}
                                />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </div>
                      </Paper>
                    </div>
                  ))}
                </SwipeableViews>
                {item.index === item.items.length - 1 ? null : (
                  <Paper
                    variant="outlined"
                    style={{ display: isMobile ? 'flex' : 'none', right: 2 }}
                    className={clsx('actions', classes.floatButton)}>
                    <IconButton
                      size="small"
                      onClick={handleExperiments(index, item.index + 1)}
                      disabled={item.index === item.items.length - 1}>
                      <ArrowForward fontSize="small" />
                    </IconButton>
                  </Paper>
                )}
                {item.items.length > 1 ? (
                  <MobileStepper
                    classes={{
                      root: classes.stepper,
                      dot: classes.dot,
                      dots: classes.dots
                    }}
                    variant="dots"
                    steps={item.items.length}
                    position="static"
                    activeStep={item.index}
                  />
                ) : null}
              </Grid>
            ))
          ) : (
            <Grid container className="mt-3" justify="center" direction="row">
              <Grid item xs={12} sm={10} md={8} xl={6}>
                <Alert
                  severity="info"
                  variant="outlined"
                  className={clsx(classes.alerts)}>
                  You have no processes running
                </Alert>
              </Grid>
            </Grid>
          )}
        </Grid>
      )}
    </div>
  );
}
