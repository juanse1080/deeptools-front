import React, { useEffect, createRef, useState } from 'react'
import { Grid, makeStyles, Card, CardContent, LinearProgress, Typography, Link } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import axios from 'axios'

import { host, authHeaderJSON, history, ws } from 'helpers'
import { title as ucWords, format_date as getDate } from 'utils'
import errores from 'utils/error'



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
}))

export default function () {
  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const [experiments, setExperiments] = useState([])

  const connect = (id, index) => {
    const webSocket = new WebSocket(`${ws}/ws/execute/${id}`)
    webSocket.onopen = () => {
      console.log("show: CONNECT")
    }
    webSocket.onclose = () => {
      console.log("show: CLOSE")
      // connect(id)
    }
    webSocket.onmessage = e => {
      const data = JSON.parse(e.data)
      addMessage(index, data)
    }

    return webSocket
  }

  const addMessage = (index, value) => {
    setExperiments(experiments => {
      let temp = [...experiments]
      temp[index] = { ...temp[index], states: value }
      return temp
    })
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
                  <LinearProgress variant="determinate" value={item.states.length > 0 ? item.states[item.states.length - 1].progress : 0} />
                  <CardContent classes={{ root: classes.cardContent }}>
                    <Grid container direction="column" justify="space-between">
                      <Grid item>
                        <Grid container direction="row" justify="space-between" alignItems="flex-start">
                          <Grid item>
                            <Typography component="h5" variant="h5">
                              <Link component="button">{ucWords(item.docker.name)}</Link>
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {getDate(item.timestamp)}
                            </Typography>
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
    }
  </div>
}
