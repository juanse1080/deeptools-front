import React, { useEffect, createRef, useState } from 'react'
import { Grid, makeStyles, Card, CardContent, LinearProgress, Typography, Link, IconButton, Paper, MobileStepper } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { ArrowBack, ArrowForward } from '@material-ui/icons'

import axios from 'axios'
import SwipeableViews from 'react-swipeable-views';

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
    position: 'relative',
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
  },
  stepper: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    padding: 0
  },
  dots: {
    alignItems: 'center'
  },
  dot: {
    width: 6,
    height: 6
  },
  activeDot: {
    backgroundColor: 'inherit',
    width: 8,
    height: 8
  },
  group: {
    position: 'relative',
    '&:hover div.actions': {
      display: 'flex !important'
    },
    '&:focus div.actions': {
      display: 'flex !important'
    },
    '&:active div.actions': {
      display: 'flex !important'
    },
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

  const connect = (id, group, index) => {
    const webSocket = new WebSocket(`${ws}/ws/execute/${id}`)
    webSocket.onmessage = e => {
      const data = JSON.parse(e.data)
      addMessage(group, index, data)
    }
    return webSocket
  }

  const addMessage = (group, index, value) => {
    setExperiments(experiments => {
      let groups = [...experiments]
      let exp = groups[group].items
      exp[index] = { ...exp[index], states: [...exp[index].states, ...value] }
      groups[group] = { ...groups[group], items: exp }
      return groups
    })
  }

  const show = (id) => () => {
    dispatch(actions.startLoading())
    history.push(`/module/experiment/${id}`)
    dispatch(actions.finishLoading())
  }

  const handleExperiments = (index, value) => () => {
    setExperiments(experiments => {
      let groups = [...experiments]
      groups[index] = { ...groups[index], index: value }
      return groups
    })
  }

  useEffect(() => {
    axios.get(`${host}/accounts/running`, authHeaderJSON()).then(
      function (res) {
        setExperiments(res.data.map((item, key) => ({ index: 0, items: item.map((exp, index) => ({ ...exp, ws: connect(exp.id, key, index), states: [] })) })))
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
            ["1_", "2_", "3_", "4_", "5_", "6_"].map(item =>
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
              <Grid item lg={6} md={6} sm={6} xs={12} key={index} className={classes.group}>
                {
                  item.index === 0 ? null :
                    <Paper variant="outlined" style={{ display: 'none', position: 'absolute', left: 2, borderRadius: '50%', zIndex: 1, bottom: 42 }} className="actions">
                      <IconButton size="small" onClick={handleExperiments(index, item.index - 1)} disabled={item.index === 0}>
                        <ArrowBack fontSize="small" />
                      </IconButton>
                    </Paper>
                }

                <SwipeableViews index={item.index}>
                  {
                    item.items.map(exp =>
                      <Card key={exp.id} className="ml-3 mr-3 mb-2">
                        <LinearProgress color="primary" variant="determinate" value={exp.states.length > 0 ? parseInt(exp.states[exp.states.length - 1].progress) : 0} classes={{ barColorPrimary: getClass(exp.states) }} />
                        <CardContent classes={{ root: classes.cardContent }}>
                          <Grid container direction="column" justify="space-between">
                            <Grid item>
                              <Grid container direction="row" justify="space-between" alignItems="flex-start">
                                <Grid item>
                                  <Typography component="h5" variant="h5">
                                    <Link component="button" onClick={show(exp.id)}>{ucWords(exp.docker.name)}</Link>
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant="caption" color="textSecondary">
                                    {getDate(exp.created_at)}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item>
                              <Typography variant="caption" color="textSecondary">
                                {
                                  exp.states.length > 0 ?
                                    exp.states[exp.states.length - 1].description : 'Starting process...'
                                }
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    )
                  }
                </SwipeableViews>
                {
                  item.index === item.items.length - 1 ? null :
                    <Paper variant="outlined" style={{ display: 'none', position: 'absolute', right: 2, borderRadius: '50%', zIndex: 1, bottom: 42 }} className="actions">
                      <IconButton size="small" onClick={handleExperiments(index, item.index + 1)} disabled={item.index === item.items.length - 1}>
                        <ArrowForward fontSize="small" />
                      </IconButton>
                    </Paper>
                }
                {
                  item.items.length > 1 ? <MobileStepper classes={{ root: classes.stepper, dot: classes.dot, dots: classes.dots }} variant="dots" steps={item.items.length} position="static" activeStep={item.index} /> : null
                }
              </Grid>
            )
          }
        </Grid>
    }
  </div>
}
