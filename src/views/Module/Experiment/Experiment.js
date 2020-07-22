import React, { useState, useEffect, useRef } from 'react'

import { Pagination } from '@material-ui/lab'
import { makeStyles, Grid, CircularProgress, Backdrop, Link, Breadcrumbs, Tooltip, IconButton, Dialog, DialogContentText, DialogContent, DialogActions, Button, Icon, useTheme, useMediaQuery } from '@material-ui/core'
import { ExpandMore, ExpandLess, Delete } from '@material-ui/icons'

import axios from 'axios'

import { host, authHeaderJSON, history, ws } from 'helpers'
import { useDispatch } from "react-redux";
import { actions } from '_redux';

import errores from 'utils/error'
import { title as ucWords, format_date as getDate } from 'utils'

import { Build } from '../Show/components'
import { ShowExperiment } from './components'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(3),
      backgroundColor: theme.palette.white
    }
  },
  backdrop: {
    position: 'absolute',
    zIndex: theme.zIndex.appBar + 1,
    color: '#fff',
  },
}))

export default function ({ match, ...others }) {
  const classes = useStyles()
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.up('sm'))
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  const [dialog, setDialog] = useState(false)
  const [module, setModule] = useState({})

  const [execute, setExecute] = useState(true)
  const [experiment, setExperiment] = useState({})
  const [progress, setProgress] = useState([])

  const deleting = () => {
    axios.delete(`${host}/accounts/experiment/delete/${match.params.id}`, authHeaderJSON()).then(
      function (res) {
        to(`/subscriptions/${module.image_name}`)()
      }
    ).catch(
      function (err) {
        console.log(err)
        setDialog(false)
      }
    )
  }

  const triedDelete = () => {
    setDialog(true)
  }

  const cancelDelete = () => {
    setDialog(false)
  }

  const newTest = () => {
    dispatch(actions.startLoading())
    history.push(`/module/run/${module.image_name}`)
    dispatch(actions.finishLoading())
  }

  const handleExecute = () => {
    setExecute(execute => !execute)
  }

  const connect = (id) => {
    const webSocket = new WebSocket(`${ws}/ws/execute/${id}`)
    webSocket.onmessage = e => {
      addDescription(JSON.parse(e.data))
    }
    return webSocket
  }

  const addDescription = (state) => {
    setProgress(progress => ([...progress, ...state]))
    if (state.length > 0) {
      if (state[state.length - 1].state === 'success')
        getData()
    }
  }

  const to = (href) => () => {
    dispatch(actions.startLoading())
    if (experiment.ws) {
      experiment.ws.close()
    }
    setExecute(true)
    setLoading(true)
    setModule({})
    setExperiment({})
    setProgress([])
    history.push(href)
    dispatch(actions.finishLoading())
  }

  const clone = () => {
    axios.post(`${host}/accounts/experiment/clone/${match.params.id}`, {}, authHeaderJSON()).then(
      function (res) {
        dispatch(actions.startLoading())
        history.push(`/module/run/${module.image_name}`)
        dispatch(actions.finishLoading())
      }
    ).catch(
      function (err) {
        console.log(err)
      }
    )
  }

  const handlePage = (e, value) => {
    to(`/module/experiment/${module.experiments[value - 1]}`)()
  }

  const getData = () => {
    axios.get(`${host}/module/experiment/${match.params.id}`, authHeaderJSON()).then(
      function (res) {
        console.log(res.data)
        setExperiment({ ...res.data })
        setTimeout(() => setExecute(res.data.state === 'executed' ? false : true), 1000)
      }
    ).catch(
      function (err) {
        console.log(err)
        errores(err)
      }
    )
  }

  useEffect(() => {
    axios.get(`${host}/module/experiment/${match.params.id}`, authHeaderJSON()).then(
      function (res) {
        console.log(res.data)
        if (res.data.state === 'executing') {
          setExperiment({ ...res.data, ws: connect(res.data.id) })
        } else {
          setExperiment({ ...res.data })
          setProgress(res.data.records)
        }
        setExecute(res.data.state === 'executed' ? false : true)
        setModule({ ...res.data.docker, experiments: res.data.experiments, index: res.data.experiments.indexOf(match.params.id) + 1 })
        setLoading(false)
      }
    ).catch(
      function (err) {
        console.log(err, execute)
        errores(err)
      }
    )
    return () => {
      if (experiment.ws) {
        experiment.ws.close()
      }
    }
  }, [match.params.id])

  return <>
    <div className={classes.root}>
      {
        loading ? <>
          <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </> : <>
            <Grid container justify="center" direction="row">
              <Grid item xs={12}>
                <Breadcrumbs aria-label="breadcrumb" maxItems={sm ? 8 : 2}>
                  <Link color="inherit" component="button" onClick={to(`/subscriptions`)}>Subscriptions</Link>
                  <Link color="inherit" component="button" onClick={to(`/module/${module.image_name}`)}>{ucWords(module.name)}</Link>
                  <Link color="inherit" component="button" onClick={to(`/subscriptions/${module.image_name}`)}>Test</Link>
                  <Link color="inherit" component="button" onClick={to(`/module/experiment/${match.params.id}`)}>{module.index}</Link>
                </Breadcrumbs>
              </Grid>
            </Grid>
            {
              execute ? <>
                <Build progress={progress} download={experiment.state === 'executed' ? experiment.file : false} />
              </> : <ShowExperiment to={to} value={experiment.elements} docker={module} id={match.params.id} />
            }
            <Grid container className="mt-3" spacing={3} direction="row" justify="space-around" >
              {
                sm ? <Grid item>
                  {
                    experiment.state === 'executed' ? <>
                      {
                        module.state !== 'active' ?
                          <Button disabled size="small" variant="contained" color="default" startIcon={<Icon fontSize="small" className="fas fa-vial" />} className="mr-2"> New </Button> : <Tooltip title="Test algorith">
                            <Button onClick={newTest} size="small" variant="contained" color="default" startIcon={<Icon fontSize="small" className="fas fa-vial text-success" />} className="mr-2"> New </Button>
                          </Tooltip>
                      }
                      {
                        module.state !== 'active' ?
                          <Button disabled size="small" variant="contained" color="default" startIcon={<Icon fontSize="small" className="fas fa-clone" />} className="mr-2" > Clone </Button> : <Tooltip title="Clone test with same data">
                            <Button onClick={clone} size="small" variant="contained" color="default" startIcon={<Icon fontSize="small" className="fas fa-clone text-secondary" />} className="mr-2" > Clone </Button>
                          </Tooltip>
                      }
                      <Tooltip title={execute ? "Less info" : "More info"}>
                        <Button onClick={handleExecute} size="small" variant="contained" color="default" startIcon={<Icon fontSize="small" className="fas fa-info-circle text-info" />} className="mr-2"> {execute ? "less" : "more"} </Button>
                      </Tooltip>
                      <Tooltip className="mr-1" title="Delete test">
                        <Button onClick={triedDelete} size="small" variant="contained" color="default" startIcon={<Delete className="text-danger" />}>
                          Delete
                        </Button>
                      </Tooltip>
                    </> : null
                  }
                </Grid> : <Grid item>
                    {
                      experiment.state === 'executed' ? <>
                        {
                          module.state !== 'active' ? null :
                            <Tooltip title="Test algorith">
                              <IconButton onClick={newTest} size="small" variant="contained" color="default" className="mr-2">
                                <Icon fontSize="small" className="fas fa-vial text-success" />
                              </IconButton>
                            </Tooltip>
                        }
                        {
                          module.state !== 'active' ?
                            null : <Tooltip title="Clone test with same data">
                              <IconButton onClick={clone} size="small" variant="contained" color="default" className="mr-2" >
                                <Icon fontSize="small" className="fas fa-clone text-secondary" />
                              </IconButton>
                            </Tooltip>
                        }
                        <Tooltip title={execute ? "Less info" : "More info"}>
                          <IconButton onClick={handleExecute} size="small" variant="contained" color="default" className="mr-2">
                            {execute ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip className="mr-1" title="Delete test">
                          <IconButton onClick={triedDelete} size="small" variant="contained" color="default">
                            <Delete className="text-danger" />
                          </IconButton>
                        </Tooltip>
                      </> : null
                    }
                  </Grid>
              }
              <Grid item>
                <Pagination size="small" count={module.experiments.length} page={module.index} color="primary" onChange={handlePage} />
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
  </>
}