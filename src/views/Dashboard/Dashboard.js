import {
  Box,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  makeStyles,
  Paper,
  Typography
} from '@material-ui/core';
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import axios from 'axios';
import clsx from 'clsx';
import { authHeaderJSON, history, host, ws } from 'helpers';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { error, format_date as getDate, title as ucWords } from 'utils';
import { actions } from '_redux';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(3)
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
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative'
  },
  father: {
    cursor: 'pointer',
    transition: 'all .3s ease-in-out',
    '&:hover > div': {
      borderColor: '#b0b0b0'
    }
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
    height: 2,
    margin: '0px 1px 0px 1px'
  },
  linearProgressRootSteeps: {
    height: 2,
    margin: '0px 1px 16px 1px',
    [theme.breakpoints.down('sm')]: {
      width: '50%'
    },
    [theme.breakpoints.up('sm')]: {
      width: '50%'
    },
    [theme.breakpoints.up('md')]: {
      width: '33%'
    },
    [theme.breakpoints.up('lg')]: {
      width: '25%'
    }
  },
  iconButton: {
    fontSize: 15,
    margin: 5
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
  },
  stepper: {
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    padding: 0
  },
  paperOutline: {
    border: '1px solid #d0d0d0'
  },
  paper: {},
  headerNews: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  firstRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
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

const Arrow = ({ direction, onClick, classes, ...others }) => {
  return (
    <Paper
      classes={{ outlined: classes.outlined }}
      variant="outlined"
      style={
        direction === 'back'
          ? { left: -10, display: isMobile ? 'flex' : 'none' }
          : { right: -10, display: isMobile ? 'flex' : 'none' }
      }
      className={clsx(classes.root, 'actions')}>
      <IconButton size="small" onClick={onClick} className={classes.button}>
        {direction === 'back' ? (
          <ArrowBack fontSize="small" className={classes.icon} />
        ) : (
          <ArrowForward fontSize="small" className={classes.icon} />
        )}
      </IconButton>
    </Paper>
  );
};

const settings = {
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  initialSlide: 0,
  arrows: true,
  className: 'mt-1 mb-4',
  responsive: [
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 960,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};

export default function List(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState({});
  const [last, setLast] = useState([]);
  const [news, setNews] = useState([]);
  const [messages, setMessages] = useState({});

  const getSettings = kind => {
    switch (kind) {
      case 'news':
        return {
          ...settings,
          nextArrow: (
            <Arrow
              direction="next"
              classes={{
                root: classes.floatButton,
                outlined: classes.paperOutline
              }}
            />
          ),
          prevArrow: (
            <Arrow
              direction="back"
              classes={{
                root: classes.floatButton,
                outlined: classes.paperOutline
              }}
            />
          ),
          slidesToShow: 3
        };

      default:
        return {
          ...settings,
          nextArrow: (
            <Arrow
              direction="next"
              classes={{
                root: classes.floatButton,
                outlined: classes.paperOutline
              }}
            />
          ),
          prevArrow: (
            <Arrow
              direction="back"
              classes={{
                root: classes.floatButton,
                outlined: classes.paperOutline
              }}
            />
          )
        };
    }
  };

  const getClass = progress => {
    if (progress && progress.length > 0) {
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

  const show = id => e => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(actions.startLoading());
    history.push(`/module/experiment/${id}`);
    dispatch(actions.finishLoading());
  };

  const showUser = id => e => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(actions.startLoading());
    history.push(`/account/${id}`);
    dispatch(actions.finishLoading());
  };

  const showModule = id => e => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(actions.startLoading());
    history.push(`/module/${id}`);
    dispatch(actions.finishLoading());
  };

  const allRunning = () => {
    dispatch(actions.startLoading());
    history.push('/module/experiment/');
    dispatch(actions.finishLoading());
  };

  const algorithms = () => {
    dispatch(actions.startLoading());
    history.push('/algorithms/');
    dispatch(actions.finishLoading());
  };

  const myAlgorithms = () => {
    dispatch(actions.startLoading());
    history.push('/module/');
    dispatch(actions.finishLoading());
  };

  const connect = id => {
    const webSocket = new WebSocket(`${ws}/ws/execute/${user.id}/${id}`);
    webSocket.onmessage = e => {
      const data = JSON.parse(e.data);
      addMessage(id, data);
    };
    return webSocket;
  };

  const addMessage = (id, value) => {
    setMessages(messages => {
      let newMessages = { ...messages };
      if (newMessages[id]) newMessages[id] = [...newMessages[id], ...value];
      else newMessages[id] = [...value];
      return newMessages;
    });
  };

  useEffect(() => {
    axios
      .get(`${host}/accounts/dashboard`, authHeaderJSON())
      .then(function(res) {
        console.log(res.data);
        setRunning(_ => {
          let experiments_ = {};
          res.data.running.forEach(element => {
            console.log(element.id);
            experiments_[element.id] = { ...element, ws: connect(element.id) };
          });
          console.log(experiments_);
          return experiments_;
        });
        setLast(_ =>
          res.data.last.map(last_ => ({
            ...last_,
            records: last_.records[last_.records.length - 1].description
          }))
        );
        setNews(_ =>
          res.data.news.sort(
            (current, next) => parseInt(next.image) - parseInt(current.image)
          )
        );
        setLoading(false);
      })
      .catch(function(err) {
        error(err);
      });
    return () => {
      Object.values(running).forEach(exp => {
        if (exp.ws) exp.ws.close();
      });
    };
  }, []);

  return (
    <>
      <div className={classes.root}>
        {loading ? (
          <>
            {[1, 2, 3].map(item => (
              <Box key={item} m={4}>
                <Skeleton width={200} />
                <Grid container spacing={3} className="mt-1">
                  {[1, 2, 3].map(index => (
                    <Grid item key={index + item} xs={12} sm={6} md={6} lg={4}>
                      <Box>
                        <Skeleton variant="rect" width="100%" height={118} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </>
        ) : (
          <>
            {Object.keys(running).length > 0 ? (
              <>
                <Grid
                  container
                  justify="space-between"
                  direction="row"
                  alignItems="flex-end">
                  <Grid item>
                    <Typography color="textSecondary" className="mb-2">
                      Running
                      {/* <Chip variant="outlined" component="span" className="ml-2" size="small" label={`${index.running + 1}/${Object.keys(running).length}`} /> */}
                      <Chip
                        variant="outlined"
                        component="span"
                        className="ml-2"
                        size="small"
                        label={`${Object.keys(running).length}`}
                      />
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Chip
                      variant="outlined"
                      style={{ cursor: 'pointer' }}
                      component="span"
                      className="mb-2"
                      size="small"
                      label="show all"
                      onClick={allRunning}
                    />
                  </Grid>
                </Grid>
                <Slider {...getSettings('running')}>
                  {Object.values(running)
                    .sort((first, next) => next.id - first.id)
                    .map(item => (
                      <div
                        key={item.id}
                        className={clsx(classes.father, 'item')}
                        onClick={show(item.id)}>
                        {console.log(
                          messages[item.id],
                          messages[item.id] ? true : false
                        )}
                        <LinearProgress
                          color="primary"
                          variant="determinate"
                          value={
                            messages[item.id] && messages[item.id].length > 0
                              ? parseInt(
                                  messages[item.id][
                                    messages[item.id].length - 1
                                  ].progress
                                )
                              : 0
                          }
                          classes={{
                            barColorPrimary: getClass(messages[item.id]),
                            root: classes.linearProgressRoot
                          }}
                        />
                        <Paper
                          className={classes.file}
                          variant="outlined"
                          classes={{ outlined: classes.paperOutline }}>
                          <div className={classes.header}>
                            <Typography noWrap className="mr-2">
                              {ucWords(item.docker.name)}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              className={classes.date}>
                              {getDate(item.updated_at)}
                            </Typography>
                          </div>
                          <div
                            className={classes.content}
                            style={{ minWidth: 0 }}>
                            <Typography noWrap align="left" variant="body2">
                              {messages[item.id] && messages[item.id].length > 0
                                ? messages[item.id][
                                    messages[item.id].length - 1
                                  ].description
                                : 'Starting process...'}
                            </Typography>
                          </div>
                        </Paper>
                      </div>
                    ))}
                </Slider>
                {/* <MobileStepper classes={{ root: classes.stepper }} variant="progress" steps={Object.keys(running).length} position="static" activeStep={index.running} LinearProgressProps={{ classes: { root: classes.linearProgressRootSteeps } }} /> */}
              </>
            ) : null}
            {last.length > 0 ? (
              <>
                <Grid
                  container
                  justify="space-between"
                  direction="row"
                  alignItems="flex-end">
                  <Grid item>
                    <Typography color="textSecondary" className="mb-2">
                      Completed
                      {/* <Chip variant="outlined" component="span" className="ml-2" size="small" label={`${index.last + 1}/${last.length}`} /> */}
                      <Chip
                        variant="outlined"
                        component="span"
                        className="ml-2"
                        size="small"
                        label={`${last.length}`}
                      />
                    </Typography>
                  </Grid>
                  <Grid item>
                    {/* <Chip variant="outlined" component="span" className="mb-2" size="small" label="show all" /> */}
                  </Grid>
                </Grid>
                <Slider {...getSettings('last')}>
                  {last.map(item => (
                    <div
                      key={item.id}
                      className={clsx(classes.father, 'item')}
                      onClick={show(item.id)}>
                      <Paper
                        className={classes.file}
                        variant="outlined"
                        classes={{ outlined: classes.paperOutline }}>
                        <div className={classes.header}>
                          <Typography noWrap className="mr-2">
                            {ucWords(item.docker.name)}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            className={classes.date}>
                            {getDate(item.updated_at)}
                          </Typography>
                        </div>
                        <div
                          className={classes.content}
                          style={{ minWidth: 0 }}>
                          <Typography noWrap align="left" variant="body2">
                            {item.records}
                          </Typography>
                        </div>
                      </Paper>
                    </div>
                  ))}
                </Slider>
                {/* <MobileStepper classes={{ root: classes.stepper }} variant="progress" steps={last.length} position="static" activeStep={index.last} LinearProgressProps={{ classes: { root: classes.linearProgressRootSteeps } }} /> */}
              </>
            ) : null}
            {news.length > 0 ? (
              <>
                <Grid
                  container
                  justify="space-between"
                  direction="row"
                  alignItems="flex-end">
                  <Grid item>
                    <Typography color="textSecondary" className="mb-2">
                      {user.role === 'developer'
                        ? 'Your algorithms'
                        : 'New algorithms'}
                      {/* <Chip variant="outlined" component="span" className="ml-2" size="small" label={`${index.news + 1}/${news.length}`} /> */}
                      <Chip
                        variant="outlined"
                        component="span"
                        className="ml-2"
                        size="small"
                        label={`${news.length}`}
                      />
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Chip
                      variant="outlined"
                      component="span"
                      className="mb-2"
                      size="small"
                      label={user.role === 'developer' ? 'View all' : 'Explore'}
                      style={{ cursor: 'pointer' }}
                      onClick={
                        user.role === 'developer' ? myAlgorithms : algorithms
                      }
                    />
                  </Grid>
                </Grid>
                <Slider {...getSettings('news')}>
                  {news.map((item, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper
                        variant="outlined"
                        className={classes.paper}
                        classes={{ outlined: classes.paperOutline }}>
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
                              <div className={classes.headerNews}>
                                <Typography noWrap>
                                  <Link onClick={showModule(item.image_name)}>
                                    {ucWords(item.name)}
                                  </Link>
                                </Typography>
                                <Typography variant="caption" noWrap>
                                  <Link onClick={showUser(item.user.id)}>
                                    {ucWords(
                                      `${item.user.first_name} ${item.user.last_name}`
                                    )}
                                  </Link>
                                  <span className="ml-1 mr-1">&#183;</span>
                                  {item.image !== '1'
                                    ? `${item.image} users`
                                    : 'One user'}
                                </Typography>
                              </div>
                              <Typography
                                noWrap
                                variant="caption"
                                color="textSecondary"
                                className="mt-2">
                                {item.description}
                              </Typography>
                            </div>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  ))}
                </Slider>
                {/* <MobileStepper classes={{ root: classes.stepper }} variant="progress" steps={news.length} position="static" activeStep={index.news} LinearProgressProps={{ classes: { root: classes.linearProgressRootSteeps } }} /> */}
              </>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}
