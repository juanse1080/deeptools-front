import React, { useState, useEffect } from 'react'

import clsx from 'clsx'

import { Alert, Skeleton } from '@material-ui/lab'

import { IconButton, Typography, makeStyles, Grid, Paper, InputBase, Icon, Breadcrumbs, useMediaQuery, useTheme, Link, Tooltip } from '@material-ui/core'
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
  main: {
    display: 'flex',
    justifyContent: 'center',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  disableScale: {
    transform: 'scale(1, 1) !important'
  },
  iconButton: {
    fontSize: 15,
    margin: 5
  },
  anchoIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: theme.palette.white,
    fontSize: '0.9rem'

  },
  paper: {
    // transition: 'transform .3s ease-in-out',
    // '&:hover': {
    //   transform: 'translateY(-5px)',
    // }
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
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: theme.shape.borderRadius,
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

}))

const default_ = { name: '', owner: '' }

export default function List(props) {

  const classes = useStyles()
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.up('sm'))
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const [loading, setLoading] = useState(true)
  const [modules, setModules] = useState([])
  const [filter, setFilter] = useState([])
  const [word, setWord] = useState('')

  const show = (id) => () => {
    dispatch(actions.startLoading())
    history.push(`/module/${id}`)
    dispatch(actions.finishLoading())
  }

  const showUser = (id) => () => {
    dispatch(actions.startLoading())
    history.push(`/account/${id}`)
    dispatch(actions.finishLoading())
  }

  // Filtrar contenedores
  const filterModules = (e) => {
    const val = e.target.value
    setWord(val)
    if (val) {
      const query = modules.filter(module => module.name.toLowerCase().indexOf(val.toLowerCase()) > -1 || module.image.toLowerCase().indexOf(val.toLowerCase()) > -1 || `${module.user.first_name} ${module.user.last_name}`.toLowerCase().indexOf(val.toLowerCase()) > -1)
      console.log(query)
      setFilter(query)
    } else {
      setFilter(modules)
    }
  }

  useEffect(() => {
    axios.get(`${host}/accounts/algorithms`, authHeaderJSON()).then(function (res) {
      console.log(res.data, props)
      setModules(res.data.map(item => ({ ...item, subscriber: item.subscribers.includes(user.id), anchor: null })).sort((current, next) => next.subscriber - current.subscriber))
      setFilter(res.data.map(item => ({ ...item, subscriber: item.subscribers.includes(user.id), anchor: null })).sort((current, next) => next.subscriber - current.subscriber))
      if (props.match.params.filter) {
        filterModules({ target: { value: props.match.params.filter } })
      }
      setLoading(false)
    }).catch(function (err) {
      error(err)
    })
  }, [])

  useEffect(() => {
    if (props.match.params.filter) {
      filterModules({ target: { value: props.match.params.filter } })
    }
  }, [props.match.params.filter])


  return <>
    <div className={classes.root}>
      {
        loading ? <>
          <Grid container className="mt-3" justify="center" direction="row">
            <Grid item xs={12} sm={10} md={8} xl={6}>
              <div className={clsx(classes.main, "m-2")}>
                <Skeleton className={classes.disableScale} animation="wave" width="100%" height={50} variant="text" />
              </div>
            </Grid>
          </Grid>
          <>
            <Grid container className="mt-3" style={{ maxWidth: '100%' }}>
              {
                [1, 2, 3, 4, 5, 6].map(item =>
                  <div key={item} />
                )
              }
            </Grid>
          </>
        </> : <>
            <Grid container justify="center" direction="row">
              <Grid item xs={12}>
                <Breadcrumbs aria-label="breadcrumb" maxItems={sm ? 8 : 2}>
                  <Typography color="textSecondary">Algorithms</Typography>
                </Breadcrumbs>
              </Grid>
            </Grid>
            <Grid container className="mt-3" justify="center" direction="row">
              <Grid item xs={12} sm={10} md={8} xl={6}>
                <Paper className={classes.alerts} variant="outlined">
                  <IconButton size="small" color="primary" className={classes.iconButton} aria-label="search">
                    <Icon fontSize="small" className="fal fa-search" />
                  </IconButton>
                  <InputBase
                    onChange={filterModules}
                    className={classes.input}
                    value={word}
                    placeholder="Find algorithms"
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Paper>
              </Grid>
            </Grid>
            {
              modules.length === 0 ? (
                <Grid container className="mt-3" justify="center" direction="row">
                  <Grid item xs={12} sm={10} md={8} xl={6}>
                    <Alert severity="info" variant="outlined" className={clsx("mt-3", classes.alerts)}>
                      There are no records
                    </Alert>
                  </Grid>
                </Grid>
              ) : (
                  <>
                    {
                      filter.length === 0 ? (
                        <Grid container className="mt-3" justify="center" direction="row">
                          <Grid item xs={12} sm={10} md={8} xl={6}>
                            <Alert severity="info" variant="outlined" className={clsx("mt-3", classes.alerts)}>
                              No concurrences were found
                            </Alert>
                          </Grid>
                        </Grid>
                      ) : null
                    }
                    <Grid container className="mt-3" style={{ maxWidth: '100%' }}>
                      {
                        filter.map((item, index) =>
                          <Grid item xs={12} sm={12} md={6} lg={6} xl={4} key={index} className="p-2">
                            <Paper className={classes.paper} variant="outlined">
                              <Grid container>
                                <Grid item xs={5} sm={5} md={4} lg={4} xl={4}>
                                  <div className={classes.background} style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${host}${item.background})` }}>
                                    {
                                      item.subscribers.includes(user.id) ? <Tooltip title="you are subscribed"><Icon fontSize="small" className={clsx(classes.anchoIcon, "fal fa-anchor")} /></Tooltip> : null
                                    }
                                  </div>
                                </Grid>
                                <Grid item xs={7} sm={7} md={8} lg={8} l={8}>
                                  <div className={classes.paperContent}>

                                    <div className={classes.header}>
                                      <div className={classes.firstRow}>
                                        <Typography noWrap>
                                          <Link onClick={show(item.image_name)}>{ucWords(item.name)}</Link>
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary" style={{ whiteSpace: 'nowrap' }} className="ml-1">
                                          {getDate(item.created_at)}
                                        </Typography>
                                      </div>
                                      <Typography variant="caption" noWrap >
                                        <Link onClick={showUser(item.user.id)}>{ucWords(`${item.user.first_name} ${item.user.last_name}`)}</Link>

                                        <span className="ml-1 mr-1">&#183;</span>
                                        {item.image !== '1' ? `${item.image} users` : "One user"}
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
                  </>
                )
            }
          </>

      }
    </div>
  </>
}
