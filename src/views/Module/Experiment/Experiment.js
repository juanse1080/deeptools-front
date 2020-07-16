import React, { useState, useEffect, useRef } from 'react'

import { Skeleton } from '@material-ui/lab'
import { makeStyles, Grid, CircularProgress, Backdrop } from '@material-ui/core'

import axios from 'axios'

import { host, authHeaderJSON, history, ws } from 'helpers'

import errores from 'utils/error'

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
  const [loading, setLoading] = useState(true)
  const [module, setModule] = useState({})

  const [execute, setExecute] = useState(false)
  const [experiment, setExperiment] = useState({})
  const [progress, setProgress] = useState([])

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

  const getData = () => {
    axios.get(`${host}/module/experiment/${match.params.id}`, authHeaderJSON()).then(
      function (res) {
        console.log(res.data)
        setExperiment({ ...res.data })
        setTimeout(() => setExecute(res.data.state === 'executing' ? true : false), 1000)
      }
    ).catch(
      function (err) {
        errores(err)
        console.error(err.response)
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
        }
        setExecute(res.data.state === 'executing' ? true : false)
        setModule({ ...res.data.docker, experiments: res.data.experiments, index: res.data.experiments.indexOf(match.params.id) + 1 })
        setLoading(false)
      }
    ).catch(
      function (err) {
        errores(err)
        console.error(err.response)
      }
    )
  }, [match.params.id])

  return <>
    <div className={classes.root}>
      {
        loading ? <>
          <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </> : execute ? <>
          <Build progress={progress} />
        </> : <ShowExperiment value={experiment.elements} docker={module} id={match.params.id} index={3} />
      }
    </div>
  </>
}