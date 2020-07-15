import React, { useEffect, createRef, useState } from 'react'
import { Grid, makeStyles, Card, CardContent, LinearProgress, Typography, Link } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import axios from 'axios'

import { host, authHeaderJSON, history, ws } from 'helpers'
import { title as ucWords, format_date as getDate } from 'utils'
import errores from 'utils/error'

import { useDispatch } from "react-redux";
import { actions } from '_redux';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(3),
      backgroundColor: theme.palette.white
    }
  },
  owner: {
    fontSize: 11,
  },
  cardContent: {
    '&:last-child': {
      paddingBottom: '14px'
    }
  },
  error: {
    backgroundColor: '#f44336'
  },
  success: {
    backgroundColor: '#689f38'
  },
  inherit: {
    backgroundColor: '#3f51b5'
  }
}))

export default function () {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

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

  const connect = (id, index) => {
    const webSocket = new WebSocket(`${ws}/ws/execute/${id}`)
    webSocket.onmessage = e => {
      const data = JSON.parse(e.data)
      addMessage(index, data)
    }
    return webSocket
  }

  const addMessage = (index, value) => {
    setExperiments(experiments => {
      let temp = [...experiments]
      temp[index] = { ...temp[index], states: [...temp[index].states, ...value] }
      return temp
    })
  }

  const show = (id) => () => {
    dispatch(actions.startLoading())
    history.push(`/module/experiment/${id}`)
    dispatch(actions.finishLoading())
  }

  useEffect(() => {
    axios.get(`${host}/module/experiment`, authHeaderJSON()).then(
      function (res) {
        setExperiments([...res.data].map((item, index) => ({ ...item, ws: connect(item.id, index), states: [] })))
        console.log(res.data)
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
      </> : <Grid container className="mt-3" style={{ maxWidth: '100%' }}>
          {
            experiments.map((item, index) =>
              <Grid item lg={6} md={6} sm={6} xs={12} key={item.id}>
                <Card className="m-2" >
                  <LinearProgress color="primary" variant="determinate" value={item.states.length > 0 ? parseInt(item.states[item.states.length - 1].progress) : 0} classes={{ barColorPrimary: getClass(item.states) }} />
                  <CardContent classes={{ root: classes.cardContent }}>
                    <Grid container direction="column" justify="space-between">
                      <Grid item>
                        <Grid container direction="row" justify="space-between">
                          <Grid item>
                            <Typography component="h5" variant="h5">
                              <Link component="button" onClick={show(item.id)}>{ucWords(item.docker.name)}</Link>
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="caption" color="textSecondary">
                              {getDate(item.timestamp)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Typography variant="caption" color="textSecondary">
                          {
                            item.states.length > 0 ?
                              item.states[item.states.length - 1].description : 'Starting process...'
                          }
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )
          }
        </Grid>
    }
  </div>
}
