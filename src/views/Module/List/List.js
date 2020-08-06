import React, { useState, useEffect } from 'react'

import clsx from 'clsx'

import { Alert, Skeleton, } from '@material-ui/lab'

import { Card, Link, CardContent, IconButton, Typography, makeStyles, Grid, Paper, InputBase, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, LinearProgress, Icon, Tooltip, useMediaQuery, useTheme, Menu, MenuItem, ListItemIcon, Breadcrumbs } from '@material-ui/core'
import { Search, Edit, Delete, Visibility } from '@material-ui/icons'

import { isMobile } from 'react-device-detect'

import { host, authHeaderJSON, history, ws } from 'helpers'

import { title as ucWords, format_date as getDate, error } from 'utils'

import { useDispatch } from "react-redux";
import { actions } from '_redux';

import axios from "axios"

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(3),
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
  owner: {
    fontSize: 11,
  },
  iconButton: {
    fontSize: 15,
    margin: 5
  },
  rootTitleDialog: {
    flex: '0 0 auto',
    margin: 0,
    padding: '24px 24px',
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alignItemsStart: {
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1.5)
  },
  alignItemsEnd: {
    alignItems: 'center',
    height: 31,
  },
  title: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    marginRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column'
  },
  paper: {
    // margin: theme.spacing(0, 1, 2, 1),
    padding: theme.spacing(2),
    '&:hover div.actions': {
      display: 'flex !important'
    },
    '&:focus div.actions': {
      display: 'flex !important'
    },
    '&:active div.actions': {
      display: 'flex !important'
    },
  },
  listItemIconRoot: {
    minWidth: '30px'
  },
  linearProgressRoot: {
    height: 2,
  },
  fatherTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    justifyContent: 'start'
  }
}))

const default_ = { name: '', owner: '' }

export default function List(props) {

  const classes = useStyles()
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.up('sm'))
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  const [dialog, setDialog] = useState(false)
  const [deleting, setDeleting] = useState(default_)
  const [modules, setModules] = useState([])
  const [filter, setFilter] = useState([])

  const handleDialog = (value = !dialog) => () => {
    setDialog(value)
  }

  const handleModule = (index, name, value) => {
    let aux = [...filter]
    aux[index] = { ...aux[index], [name]: value }
    setModules(modules.map(item => item.id === aux[index].id ? { ...item, [name]: value } : item))
    setFilter(aux)
  }

  const triedDelete = index => () => {
    setDeleting({ ...filter[index], index: index })
    handleDialog(true)()
  }

  const cancelDelete = () => {
    handleDialog(false)()
  }

  const deleteModule = () => {
    handleDialog(false)()
    handleModule(deleting.index, 'loading', true)
    axios.delete(`${host}/module/delete/${deleting.image_name}`, authHeaderJSON()).then(
      function (res) {
        handleModule(deleting.index, 'loading', false)
        setModules(modules => modules.filter(item => item.image_name !== deleting.image_name))
        setFilter(filter => filter.filter(item => item.image_name !== deleting.image_name))
        setDeleting(default_)
      }
    ).catch(
      function (err) {
        console.error(err)
        handleModule(deleting.index, 'loading', false)
        setDeleting(default_)
      }
    )
  }

  const show = id => () => {
    dispatch(actions.startLoading())
    history.push(`/module/${id}`)
    dispatch(actions.finishLoading())
  }

  const run = id => () => {
    dispatch(actions.startLoading())
    history.push(`/module/run/${id}`)
    dispatch(actions.finishLoading())
  }

  const start = (index, id) => () => {
    handleModule(index, 'loading', true)
    axios.put(`${host}/module/start/${id}`, {}, authHeaderJSON()).then(
      function (res) {
        handleModule(index, 'loading', false)
        handleModule(index, 'state', 'active')
      }
    ).catch(
      function (err) {
        console.error(err)
        handleModule(index, 'loading', false)
      }
    )
  }

  const stop = (index, id) => () => {
    handleModule(index, 'loading', true)
    axios.put(`${host}/module/stop/${id}`, {}, authHeaderJSON()).then(
      function (res) {
        handleModule(index, 'loading', false)
        handleModule(index, 'state', 'stopped')
      }
    ).catch(
      function (err) {
        console.error(err)
        handleModule(index, 'loading', false)
      }
    )
  }

  // Filtrar contenedores
  const filterModules = e => {
    const val = e.target.value
    if (val) {
      const query = modules.filter(module => module.name.toLowerCase().indexOf(val.toLowerCase()) > -1 || module.image.toLowerCase().indexOf(val.toLowerCase()) > -1 || `${module.user.first_name} ${module.user.last_name}`.toLowerCase().indexOf(val.toLowerCase()) > -1)
      console.log(query)
      setFilter(query)
    } else {
      setFilter(modules)
    }
  }


  const handleModuleFilter = (index, name, value) => {
    let aux = [...filter]
    aux[index] = { ...aux[index], [name]: value }
    setFilter(aux)
  }

  const handleClick = index => event => {
    handleModuleFilter(index, 'anchor', event.currentTarget)
  }

  const handleClose = index => () => {
    handleModuleFilter(index, 'anchor', null)
  }

  useEffect(() => {
    axios.get(`${host}/module`, authHeaderJSON()).then(function (res) {
      console.log(res.data)
      const data = res.data.map(item => ({ ...item, anchor: null }))
      setModules(data)
      setFilter(data)
      setLoading(false)
    }).catch(function (err) {
      error(err)
    })
  }, [])

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
                  <Grid item lg={6} md={6} sm={6} xs={12} key={item}>
                    <Card className="m-2">
                      <CardContent>
                        <Grid container direction="column" justify="space-between" alignItems="stretch" spacing={3}>
                          <Grid item>
                            <Grid container direction="row" justify="space-between" alignItems="flex-start">
                              <Grid item>
                                <Skeleton animation="wave" variant="text" height={10} width={200} />
                                <Skeleton animation="wave" variant="text" height={10} width={150} />
                              </Grid>
                              <Grid item>
                                <Skeleton animation="wave" variant="text" height={10} width={40} />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item>
                            <Grid container direction="row" justify="space-between" alignItems="flex-start">
                              <Grid item>
                                <Skeleton animation="wave" variant="text" height={10} width={80} />
                              </Grid>
                              <Grid item>
                                <Grid container spacing={1}>
                                  <Grid item>
                                    <Skeleton animation="wave" variant="circle" width={16} height={16} />
                                  </Grid>
                                  <Grid item>
                                    <Skeleton animation="wave" variant="circle" width={16} height={16} />
                                  </Grid>
                                  <Grid item>
                                    <Skeleton animation="wave" variant="circle" width={16} height={16} />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              }
            </Grid>
          </>
        </> : <>
            <Grid container justify="center" direction="row">
              <Grid item xs={12} className="mb-2">
                <Breadcrumbs aria-label="breadcrumb">
                  <Typography color="textSecondary">Algorithms</Typography>
                </Breadcrumbs>
              </Grid>
              <Grid item xs={12} sm={10} md={8} xl={6}>
                <Paper className={classes.alerts}>
                  <IconButton size="small" color="primary" className={classes.iconButton} aria-label="search">
                    <Search />
                  </IconButton>
                  <InputBase
                    onChange={filterModules}
                    className={classes.input}
                    placeholder="Find modules"
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
                    <Grid container className="mt-3" spacing={1}>
                      {
                        filter.map((item, index) =>
                          <Grid item lg={6} md={6} sm={6} xs={12} key={item.id} >
                            {item.loading ? <LinearProgress classes={{ root: classes.linearProgressRoot }} /> : null}
                            <Paper className={classes.paper} >
                              <div className={clsx(classes.details, classes.alignItemsStart)}>
                                <div className={classes.fatherTitle}>
                                  <Tooltip title={item.state} className="mr-2">
                                    <Icon fontSize="default" className={clsx(`fas ${item.state === 'active' ? 'fa-check-circle text-success' : 'fa-exclamation-circle text-secondary'}`)} />
                                  </Tooltip>
                                  <div className={classes.title}>
                                    <Typography noWrap>
                                      <Link onClick={show(item.image_name)}>{ucWords(item.name)}</Link>
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                      {item.image}
                                    </Typography>
                                  </div>
                                </div>

                                <span className={classes.owner}>
                                  <Typography noWrap variant="caption" color="textSecondary">
                                    {getDate(item.created_at)}
                                  </Typography>
                                </span>
                              </div>
                              <div className={clsx(classes.details, classes.alignItemsEnd)}>
                                <Typography noWrap variant="caption" >
                                  {ucWords(`${item.user.first_name} ${item.user.last_name}`)}
                                </Typography>
                                <div style={{ display: isMobile ? 'flex' : 'none' }} className="actions">
                                  {
                                    sm ? <>
                                      {
                                        item.state === 'active' ? <>
                                          <Tooltip title="Test">
                                            <IconButton size="small" onClick={run(item.image_name)} className="mr-2">
                                              <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-vial text-success")} />
                                            </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Stop">
                                            <IconButton size="small" onClick={stop(index, item.image_name)} className="mr-2">
                                              <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-stop-circle text-secondary")} />
                                            </IconButton>
                                          </Tooltip>
                                        </> : null
                                      }
                                      {
                                        item.state === 'stopped' ? <>
                                          <Tooltip title="Start">
                                            <IconButton size="small" onClick={start(index, item.image_name)} className="mr-2">
                                              <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-play-circle text-primary")} />
                                            </IconButton>
                                          </Tooltip>
                                        </> : null
                                      }
                                      {
                                        item.state === 'builded' ? <>
                                          <Tooltip title="Active">
                                            <IconButton size="small" onClick={run(item.image_name)} className="mr-2">
                                              <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-rocket text-success")} />
                                            </IconButton>
                                          </Tooltip>
                                        </> : null
                                      }
                                      <Tooltip title="Delete">
                                        <IconButton size="small" onClick={triedDelete(index)}>
                                          <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-trash text-danger")} />
                                        </IconButton>
                                      </Tooltip>
                                    </> : <>
                                        <IconButton size="small" onClick={handleClick(index)}>
                                          <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-ellipsis-v")} />
                                        </IconButton>
                                        <Menu anchorEl={item.anchor} anchorOrigin={{ vertical: 'top', horizontal: 'right', }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(item.anchor)} onClose={handleClose(index)}>
                                          {
                                            item.state === 'active' ? <div>
                                              <MenuItem onClick={run(item.image_name)}>
                                                <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                                                  <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-vial text-success")} />
                                                </ListItemIcon>
                                                <Typography variant="inherit">Test</Typography>
                                              </MenuItem>
                                              <MenuItem onClick={stop(index, item.image_name)}>
                                                <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                                                  <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-stop-circle text-secondary")} />
                                                </ListItemIcon>
                                                <Typography variant="inherit">Stop</Typography>
                                              </MenuItem>
                                            </div> : null
                                          }
                                          {
                                            item.state === 'stopped' ? <MenuItem onClick={start(index, item.image_name)}>
                                              <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                                                <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-play-circle text-primary")} />
                                              </ListItemIcon>
                                              <Typography variant="inherit">Start</Typography>
                                            </MenuItem> : null
                                          }
                                          {
                                            item.state === 'builded' ? <>
                                              <MenuItem onClick={run(item.image_name)}>
                                                <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                                                  <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-rocket text-success")} />
                                                </ListItemIcon>
                                                <Typography variant="inherit">Active</Typography>
                                              </MenuItem>
                                            </> : null
                                          }
                                          <MenuItem onClick={triedDelete(index)}>
                                            <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                                              <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-trash text-danger")} />
                                            </ListItemIcon>
                                            <Typography variant="inherit">Delete</Typography>
                                          </MenuItem>
                                        </Menu>
                                      </>
                                  }
                                </div>
                              </div>
                            </Paper>
                          </Grid>
                        )
                      }
                    </Grid>
                    <Dialog open={dialog} keepMounted onClose={cancelDelete} aria-labelledby="alert-dialog-slide-title" aria-describedby="alert-dialog-slide-description">
                      <DialogTitle id="alert-dialog-slide-title" classes={{ root: classes.rootTitleDialog }}>{`Module ${deleting.name}`}</DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                          {`¿Do want delete background "${deleting.name}"?`}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={cancelDelete} color="primary">Cancel</Button>
                        <Button onClick={deleteModule} color="primary">Confirm</Button>
                      </DialogActions>
                    </Dialog>
                  </>
                )
            }
          </>

      }
    </div>
  </>
}
