import React, { useState, useEffect } from 'react'

import clsx from 'clsx'

import { Alert, Skeleton } from '@material-ui/lab'

import { IconButton, Typography, makeStyles, Grid, Paper, InputBase, Icon, Breadcrumbs, useMediaQuery, useTheme, Card, CardMedia, Link } from '@material-ui/core'
import { Search } from '@material-ui/icons'

import { useDispatch, useSelector } from "react-redux"
import axios from "axios"

import { host, authHeaderJSON, history } from 'helpers'

import { title as ucWords, error, format_date as getDate } from 'utils'

import { actions } from '_redux'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    }
  },
  alerts: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  disableScale: {
    transform: 'scale(1, 1) !important'
  },
  anchoIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: theme.palette.white,
    fontSize: '0.9rem'
  },
  paper: {
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  firstRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paperContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: theme.spacing(1.5),
    height: '100%',
  },
  background: {
    backgroundSize: 'cover',
    borderTopLeftRadius:theme.shape.borderRadius,
    borderBottomLeftRadius:theme.shape.borderRadius,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    paddingTop: '68.25%',
    height: 0,
    position: 'relative',
    minHeight: '100%'
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
    backgroundSize: 'contain',
    position: 'relative',
    zIndex: 1,
  },
  avatar: {
    backgroundColor: 'red',
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  content: {
    display: 'flex',
    alignItems: 'start',
    justifyContent: 'space-between'
  },
  mediaProfile: {
    height: 0,
    paddingTop: '100%', // 16:9
  },
  name: {
    textAlign: 'center',
    marginTop: '1rem!important',
    [theme.breakpoints.down('xs')]: {
      textAlign: 'left',
      marginLeft: '1rem!important',
    }
  },
}))

const default_ = { name: '', algorithms: '' }

export default function List(props) {
  const classes = useStyles()
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.up('sm'))
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const [loading, setLoading] = useState(true)
  const [module, setModule] = useState({})

  const show = (id) => () => {
    dispatch(actions.startLoading())
    history.push(`/module/${id}`)
    dispatch(actions.finishLoading())
  }

  const showUser = id => () => {
    dispatch(actions.startLoading())
    history.push(`/account/${id}`)
    dispatch(actions.finishLoading())
  }

  useEffect(() => {
    axios.get(`${host}/accounts/profile/${props.match.params.id ? props.match.params.id : user.id}`, authHeaderJSON()).then(function (res) {
      console.log({ ...res.data })
      setModule({ ...res.data })
      setLoading(false)
    }).catch(function (err) {
      error(err)
    })
  }, [props.match.params])

  return <>
    <div className={classes.root}>
      {
        loading ? <>
          <>
            <Grid container spacing={3}>
              <Grid item lg={3} md={4} sm={5} xs={12}>
              </Grid>
              <Grid item lg={9} md={8} sm={7} xs={12}>
                <Grid container className="mt-3" spacing={3}>
                  {
                    [1, 2, 3, 4, 5, 6].map(item =>
                      <Grid item xs={12} key={item}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={12} md={6}>
                            <Skeleton key={item} className={classes.disableScale} animation="wave" width="100%" height={50} variant="text" />
                          </Grid>
                          <Grid item xs={12} sm={12} md={6}>
                            <Skeleton key={item} className={classes.disableScale} animation="wave" width="100%" height={50} variant="text" />
                          </Grid>
                        </Grid>
                      </Grid>
                    )
                  }
                </Grid>
              </Grid>
            </Grid>

          </>
        </> : <>
            <Grid container justify="center" direction="row">
              <Grid item xs={12}>
                {
                  props.match.params.id ? <>
                    <Breadcrumbs aria-label="breadcrumb" maxItems={sm ? 8 : 2}>
                      <Typography color="textSecondary">Accounts</Typography>
                      <Typography color="textSecondary">{props.match.params.id}</Typography>
                    </Breadcrumbs>
                  </> : <Breadcrumbs aria-label="breadcrumb" maxItems={sm ? 8 : 2}>
                      <Typography color="textSecondary">Profile</Typography>
                    </Breadcrumbs>
                }
              </Grid>
            </Grid>
            <Grid container className="mt-3">
              <Grid item lg={3} md={3} sm={4} xs={12} className="pr-3 pb-3">
                <Grid container>
                  <Grid item xs={4} sm={12}>
                    <Card className="rounded-pill" variant="outlined" >
                      <CardMedia className={classes.mediaProfile} image={`${host}${module.photo}`} title={module.first_name} />
                    </Card>
                  </Grid>
                  <Grid item xs={8} sm={12}>
                    <Typography className={classes.name} variant="h4" component="h5">{ucWords(`${module.first_name} ${module.last_name}`)}</Typography>
                    <Typography className={classes.name} variant="caption" component="h5">
                      {
                        module.role === 'developer' ? module.owner !== 1 ? `${module.owner} algorithms` : 'One algorithm' : module.subscriptions !== 1 ? `${module.subscriptions} subscriptions` : 'One subscription'
                      }
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={9} md={9} sm={8} xs={12}>
                <Typography color="textSecondary" variant="h6" component="h6" className="mb-2">
                  {
                    module.role === 'developer' ? "Algorithms developed" : "Subscriptions"
                  }
                </Typography>
                {
                  module.algorithms.length === 0 ? (
                    <Grid container className="mt-3" justify="center" direction="row">
                      <Grid item xs={12} sm={10} md={8} xl={6}>
                        <Alert severity="info" variant="outlined" className={clsx("mt-3", classes.alerts)}>
                          This user does not have active algorithms
                        </Alert>
                      </Grid>
                    </Grid>
                  ) : null
                }
                <Grid container style={{ maxWidth: '100%' }}>
                  {
                    module.algorithms.map((item, index) =>
                      <Grid item xs={12} sm={12} md={6} key={index} className="p-2">
                        <Paper className={classes.paper} onClick={show(item.image_name)}  variant="outlined">
                          <Grid container>
                            <Grid item xs={5} sm={5} md={4} lg={4} xl={4}>
                              <div className={classes.background} style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${host}${item.background})` }}>
                              </div>
                            </Grid>
                            <Grid item xs={7} sm={7} md={8} lg={8} l={8}>
                              <div className={classes.paperContent}>

                                <div className={classes.header}>
                                  <div className={classes.firstRow}>
                                    <Typography noWrap>
                                      <Link onClick={show(item.image_name)}>{ucWords(item.name)}</Link>
                                    </Typography>
                                  </div>
                                  <Typography variant="caption" noWrap >
                                    {
                                      module.role === 'developer' ? <>
                                        {item.image !== '1' ? `${item.image} users` : "One user"}
                                      </> : <>
                                          <Link onClick={showUser(item.user.id)}>{ucWords(`${item.user.first_name} ${item.user.last_name}`)}</Link>
                                          <span className="ml-1 mr-1">&#183;</span>
                                          {item.image !== '1' ? `${item.image} users` : "One user"}
                                        </>
                                    }
                                  </Typography>
                                </div>


                                <Typography noWrap variant="caption" color="textSecondary">
                                  {item.description}
                                </Typography>
                              </div>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    )
                  }
                </Grid>
              </Grid>
            </Grid>
          </>
      }
    </div>
  </>
}
