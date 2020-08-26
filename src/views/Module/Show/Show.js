import React, { useState, useEffect, useRef } from 'react'

import { Skeleton } from '@material-ui/lab'
import { makeStyles, Grid, Backdrop, CircularProgress } from '@material-ui/core'

import axios from 'axios'

import { useDispatch, useSelector } from 'react-redux'

import { host, authHeaderJSON, history, ws } from 'helpers'

import errores from 'utils/error'

import { Build, Detail } from './components'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(3),
      // backgroundColor: theme.palette.white
    }
  },
  fullHeight: {
    paddingTop: "100%",
    transform: 'scale(1, 1) !important'
  },
}))

export default function ({ match, ...others }) {
  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const access = useSelector(state => state.user.id)
  const role = useSelector(state => state.user.role)


  const ref = useRef(null)
  const [build, setBuild] = useState(false)
  const [module, setModule] = useState({})
  const [progress, setProgress] = useState([])

  const connect = (id) => {
    ref.current = new WebSocket(`${ws}/ws/build/${id}`)
    ref.current.onopen = () => {
      console.log("show: CONNECT")
    }
    ref.current.onclose = () => {
      console.log("show: CLOSE")
      // connect(id)
    }
    ref.current.onmessage = e => {
      addDescription(e.data)
    }
  }

  const build_image = (id) => {
    connect(id)
    waitForSocketConnection(() => { })
  }

  const handleUser = (name, value) => {
    setModule({ ...module, [name]: value })
  }

  const waitForSocketConnection = (callback) => {
    setTimeout(
      function () {
        // Check if websocket state is OPEN
        if (ref.current.readyState === 1) {
          callback()
          return
        } else {
          console.log("show: wait for connection...")
          // waitForSocketConnection(callback)
        }
      }, 100) // wait 100 milisecond for the connection...
  }

  const addDescription = (state) => {
    const data = JSON.parse(state)
    console.log("Data:", data)
    setProgress([...data])
    if (data[data.length - 1].state === 'success')
      setBuild(false)
  }

  useEffect(() => {
    axios.get(`${host}/module/${match.params.id}`, authHeaderJSON()).then(
      function (res) {
        if (res.data.state === 'building') {
          build_image(match.params.id)
        }
        const graphs = res.data.elements_type.filter(item => item.kind === 'graph')
        let elements = {}
        res.data.elements_type.forEach(element => {
          elements[element.kind] = element
        })
        elements["graph"] = graphs
        setModule({ ...res.data, elements: elements, role, owner: access === res.data.user.id })
        console.log({...res.data, elements: elements, role, owner: access === res.data.user.id })
        setBuild(res.data.state === 'building')
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
    {
      !build && !loading ? <Detail module={module} handle={handleUser} /> : null
    }
    <div className={classes.root}>
      {
        loading ? <>
          <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </> : build ? <>
          <Build progress={progress} />
        </> : null
      }
    </div>
  </>
}