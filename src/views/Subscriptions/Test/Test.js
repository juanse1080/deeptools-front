import React, { useEffect, useState } from 'react'
import { Grid, Icon, makeStyles, Card, CardContent, LinearProgress, Typography, Link, Breadcrumbs, Paper, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, Button, Fab, useTheme, useMediaQuery, Menu, MenuItem, ListItemIcon } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { Delete, Visibility } from '@material-ui/icons'

import { isMobile } from 'react-device-detect'
import axios from 'axios'
import clsx from 'clsx'

import { host, authHeaderJSON, history, ws } from 'helpers'
import { title as ucWords, format_date as getDate, real_date } from 'utils'
import errores from 'utils/error'

import { useDispatch } from "react-redux"
import { actions } from '_redux'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
      backgroundColor: theme.palette.white
    },
    '&::-webkit-scrollbar': {
      backgroundColor: '#29292e',
      width: 10,
      borderRadius: 12,
    },
    '&::-webkit-scrollbar-track': {
      background: '#7e7e7e',
      borderRadius: 12,
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#e1e1e1',
      borderRadius: 12,
    }
  },
  listItemIconRoot: {
    minWidth: '30px'
  },
  error: {
    backgroundColor: '#f44336'
  },
  success: {
    backgroundColor: '#689f38'
  },
  inherit: {
    backgroundColor: '#3f51b5'
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
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  linearProgressRoot: {
    height: 2
  },
  iconButton: {
    fontSize: 15,
    margin: 5
  },
}))

export default function ({ match }) {
  const classes = useStyles()
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.up('sm'))
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  const [dialog, setDialog] = useState(false)
  const [module, setModule] = useState({})
  const [experiments, setExperiments] = useState([])

  const getClass = (progress) => {
    if (progress.length > 0) {
      switch (progress[progress.length - 1].state) {
        case 'success':
          return classes.success
        case 'error':
          return classes.error
        default:
          return classes.inherit
      }
    }
  }

  const subscriptions = () => {
    dispatch(actions.startLoading())
    history.push(`/subscriptions`)
    dispatch(actions.finishLoading())
  }

  const showTest = () => {
    dispatch(actions.startLoading())
    history.push(`/subscriptions/${match.params.id}`)
    dispatch(actions.finishLoading())
  }

  const show = (id) => () => {
    dispatch(actions.startLoading())
    history.push(`/module/experiment/${id}`)
    dispatch(actions.finishLoading())
  }

  const showModule = () => {
    dispatch(actions.startLoading())
    history.push(`/module/${match.params.id}`)
    dispatch(actions.finishLoading())
  }

  const connect = (id, index) => {
    const webSocket = new WebSocket(`${ws}/ws/execute/${id}`)
    webSocket.onmessage = e => {
      const data = JSON.parse(e.data)
      addMessage(id, data)
    }
    return webSocket
  }

  const addMessage = (index, value) => {
    setExperiments(experiments => {
      let temp = [...experiments]
      let key
      temp.forEach((item, index_) => {
        if (item.id === index) {
          key = index_
          return
        }
      })
      temp[key] = { ...temp[key], states: [...temp[key].states, ...value] }
      return temp
    })
  }

  const deleteItem = index => {
    setExperiments(experiments => {
      let temp = [...experiments]
      temp.splice(index, 1)
      return temp
    })
  }

  const deleting = () => {
    axios.delete(`${host}/accounts/experiment/delete/${experiments[dialog].id}`, authHeaderJSON()).then(
      function (res) {
        setDialog(false)
        deleteItem(dialog)
      }
    ).catch(
      function (err) {
        console.log(err)
        setDialog(false)
      }
    )
  }

  const clone = index => () => {
    axios.post(`${host}/accounts/experiment/clone/${experiments[index].id}`, {}, authHeaderJSON()).then(
      function (res) {
        dispatch(actions.startLoading())
        history.push(`/module/run/${match.params.id}`)
        dispatch(actions.finishLoading())
      }
    ).catch(
      function (err) {
        console.log(err)
      }
    )
  }


  const triedDelete = index => () => {
    handleClose(index)()
    setDialog(index)
  }

  const cancelDelete = () => {
    setDialog(false)
  }

  const newTest = () => {
    dispatch(actions.startLoading())
    history.push(`/module/run/${match.params.id}`)
    dispatch(actions.finishLoading())
  }

  const handleExperiments = (index, name, value) => {
    let aux = [...experiments]
    aux[index] = { ...aux[index], [name]: value }
    setExperiments(aux)
  }

  const handleClick = index => event => {
    handleExperiments(index, 'anchor', event.currentTarget)
  }

  const handleClose = index => () => {
    handleExperiments(index, 'anchor', null)
  }

  useEffect(() => {
    axios.get(`${host}/accounts/subscriptions/${match.params.id}`, authHeaderJSON()).then(
      function (res) {
        console.log(res.data)
        setExperiments(res.data.test.map((item, index) =>
          item.state === 'executing' ?
            { ...item, ws: connect(item.id, index), states: [], anchor: null } :
            { ...item, states: item.records, anchor: null }
        ))
        setModule(res.data.docker)
        setLoading(false)
      }
    ).catch(
      function (err) {
        errores(err)
        console.error(err.response)
      }
    )
  }, [])

  return <div className={classes.root}>
    {
      loading ? <>
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
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )
          }
        </Grid>
      </> : <>
          <Grid container justify="center" direction="row">
            <Grid item xs={12}>
              <Breadcrumbs aria-label="breadcrumb" maxItems={sm ? 8 : 2}>
                <Link color="inherit" component="button" onClick={subscriptions}>Subscriptions</Link>
                <Link color="inherit" component="button" onClick={showModule}>{ucWords(module.name)}</Link>
                <Link color="inherit" component="button" onClick={showTest}>Test</Link>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Grid container className="mt-3" spacing={2}>
            {
              experiments.map((item, index) =>
                <Grid item xl={4} lg={6} md={6} sm={12} xs={12} key={item.id}>
                  <LinearProgress color="primary" variant="determinate" value={item.states.length > 0 ? parseInt(item.states[item.states.length - 1].progress) : 0} classes={{ barColorPrimary: getClass(item.states), root: classes.linearProgressRoot }} />
                  <Paper className={classes.file}>
                    <div className={classes.content}>
                      <div className={clsx(classes.content, "actions")} style={{ display: isMobile ? 'flex' : 'none' }}>
                        {
                          sm ? <>
                            <Tooltip className="mr-1" title="Show test">
                              <IconButton size="small" onClick={show(item.id)}>
                                <Visibility fontSize="small" className="text-info" />
                              </IconButton>
                            </Tooltip>
                            {
                              module.state !== 'active' ? <IconButton size="small" disabled={true} >
                                <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-clone")} />
                              </IconButton> : <Tooltip title="Clone test with same data">
                                  <IconButton size="small" onClick={clone(index)}>
                                    <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-clone")} />
                                  </IconButton>
                                </Tooltip>
                            }
                            {
                              item.state === 'executed' ? <>
                                <Tooltip className="mr-1" title="Delete test">
                                  <IconButton size="small" onClick={triedDelete(index)}>
                                    <Delete fontSize="small" className="text-danger" />
                                  </IconButton>
                                </Tooltip>
                              </> : null
                            }
                          </> : <>
                              <IconButton size="small" onClick={handleClick(index)}>
                                <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-ellipsis-v")} />
                              </IconButton>
                              <Menu anchorEl={item.anchor} anchorOrigin={{ vertical: 'top', horizontal: 'right', }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(item.anchor)} onClose={handleClose(index)}>
                                <MenuItem onClick={show(item.id)}>
                                  <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                                    <Visibility fontSize="small" className="text-info" />
                                  </ListItemIcon>
                                  <Typography variant="inherit">Show test</Typography>
                                </MenuItem>
                                {
                                  module.state !== 'active' ? <MenuItem onClick={clone(index)}>
                                    <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                                      <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-clone")} />
                                    </ListItemIcon>
                                    <Typography variant="inherit">Clone test with same data</Typography>
                                  </MenuItem> : null
                                }
                                {
                                  item.state === 'executed' ?
                                    <MenuItem onClick={triedDelete(index)}>
                                      <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                                        <Delete fontSize="small" className="text-danger" />
                                      </ListItemIcon>
                                      <Typography variant="inherit">Delete test</Typography>
                                    </MenuItem> : null
                                }
                              </Menu>
                            </>
                        }
                      </div>
                      <Tooltip className="ml-1" title={item.states.length > 0 ? item.states[item.states.length - 1].description : 'Starting process...'} style={{ marginTop: 6, marginBottom: 7 }}>
                        <Typography noWrap align="left" variant="body2" className="mr-2">
                          {
                            item.states.length > 0 ?
                              item.states[item.states.length - 1].description : 'Starting process...'
                          }
                        </Typography>
                      </Tooltip>
                    </div>

                    <Tooltip title={real_date(item.created_at)} className={classes.date}>
                      <Typography variant="caption" noWrap color="textSecondary">
                        {getDate(item.created_at)}
                      </Typography>
                    </Tooltip>
                  </Paper>
                </Grid>
              )
            }
          </Grid>
          <Grid container className="mt-3" spacing={3} direction="row" justify="flex-end">
            <Grid item>
              {
                module.state !== 'active' ? <Fab disabled={true} size="small" color="primary" aria-label="Test algorith">
                  <Icon fontSize="small" className="fas fa-vial text-white" />
                </Fab> : <Tooltip title="Test algorith">
                    <Fab disabled={module.state !== 'active'} size="small" color="primary" aria-label="Test algorith" onClick={newTest}>
                      <Icon fontSize="small" className="fas fa-vial text-white" />
                    </Fab>
                  </Tooltip>
              }
            </Grid>
          </Grid>
          <Dialog open={dialog !== false} keepMounted onClose={cancelDelete} maxWidth="xs" fullWidth>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                ¿Do want delete this test?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={cancelDelete} color="primary">Cancel</Button>
              <Button onClick={deleting} color="primary">Confirm</Button>
            </DialogActions>
          </Dialog>
        </>
    }
  </div>
}
