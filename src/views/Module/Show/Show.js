import React, { useState, useEffect, useRef } from 'react'

import { Skeleton } from '@material-ui/lab'
import { makeStyles, Grid } from '@material-ui/core'

import axios from 'axios'

import { host, authHeaderJSON, history, ws } from 'helpers'

import { Build, Detail } from './components'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(3),
      backgroundColor: theme.palette.white
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
  }

  useEffect(() => {
    axios.get(`${host}/module/build/${match.params.id}`, authHeaderJSON()).then(
      function (res) {
        console.log(res.data)
        if (res.data.build) {
          build_image(match.params.id)
        }
        const graphs = res.data.elements_type.filter(item => item.kind === 'graph')
        let elements = {}
        res.data.elements_type.forEach(element => {
          elements[element.kind] = element
        })
        elements["graph"] = graphs
        setModule({ ...res.data, elements: elements })
        setBuild(res.data.build)
        setLoading(false)
      }
    ).catch(
      function (err) {
        console.log(err.response.data)
      }
    )
  }, [match.params.id])

  return <>
    <div className={classes.root}>
      {
        loading ? <>
          <Grid container justify="space-around" spacing={3}>
            <Grid item>
              <Skeleton animation="wave" className="mb-2" variant="circle" width={40} height={40} />
              <Skeleton animation="wave" variant="text" height={10} width={40} />
            </Grid>
            <Grid item>
              <Skeleton animation="wave" className="mb-2" variant="circle" width={40} height={40} />
              <Skeleton animation="wave" variant="text" height={10} width={40} />
            </Grid>
            <Grid item>
              <Skeleton animation="wave" className="mb-2" variant="circle" width={40} height={40} />
              <Skeleton animation="wave" variant="text" height={10} width={40} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton className={classes.fullHeight} animation="wave" variant="text" />
            </Grid>
          </Grid>
        </> : build ? <>
          <Build progress={progress} />
        </> : <>
              <Detail module={module} />
            </>
      }
    </div>
  </>
}