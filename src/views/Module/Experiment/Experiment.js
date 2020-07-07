import React, { useState, useEffect, useRef } from 'react'

import { Skeleton } from '@material-ui/lab'
import { makeStyles, Grid, CircularProgress, Backdrop } from '@material-ui/core'

import axios from 'axios'

import { host, authHeaderJSON, history, ws } from 'helpers'

import errores from 'utils/error'

import { Build } from '../Show/components'

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

  const [execute, setExecute] = useState(false)
  const [experiment, setExperiment] = useState({})
  const [progress, setProgress] = useState([])

  const connect = (id) => {
    const webSocket = new WebSocket(`${ws}/ws/execute/${id}`)
    webSocket.onopen = () => {
      console.log("show: CONNECT")
    }
    webSocket.onclose = () => {
      console.log("show: CLOSE")
    }
    webSocket.onmessage = e => {
      addDescription(JSON.parse(e.data))
    }
    return webSocket
  }

  const addDescription = (state) => {
    console.log("Data:", state)
    setProgress([...state])
    if (state[state.length - 1].state === 'success')
      setExecute(false)
  }

  useEffect(() => {
    axios.get(`${host}/module/experiment/${match.params.id}`, authHeaderJSON()).then(
      function (res) {
        console.log(res.data)
        setExperiment({ ...res.data, ws: connect(res.data.id) })
        setExecute(res.data.state === 'executing')
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
        </> : null
      }
    </div>
  </>
}