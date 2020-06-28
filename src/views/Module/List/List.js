import React, { useState, useEffect } from 'react'

import clsx from 'clsx'

import { Alert, Skeleton, } from '@material-ui/lab'

import { Card, CardHeader, Link, CardContent, CardActions, Avatar, IconButton, Typography, makeStyles, Grid, Paper, InputBase, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, LinearProgress } from '@material-ui/core'
import { Search, Edit, Delete, Visibility } from '@material-ui/icons'

import { host, authHeaderJSON, history, ws } from 'helpers'

import { useDispatch } from "react-redux";
import { actions } from '_redux';

import axios from "axios"

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  // expand: {
  //   transform: 'rotate(0deg)',
  //   marginLeft: 'auto',
  //   transition: theme.transitions.create('transform', {
  //     duration: theme.transitions.duration.shortest,
  //   }),
  // },
  // expandOpen: {
  //   transform: 'rotate(180deg)',
  // },
  colorPreview: {
    fontSize: '0.8rem'
  },
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 500,
  },
  main: {
    display: 'flex',
    justifyContent: 'center',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  fullHeight: {
    paddingTop: "100%",
    transform: 'scale(1, 1) !important'
  },
  disableScale: {
    transform: 'scale(1, 1) !important'
  },
  owner: {
    fontSize: 11,
  }
}))

const getDate = (date) => {
  const data = new Date(date)
  const current = new Date()

  const mes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

  const equal = current - data
  const ayer = 24 * 1000 * 3600
  const semana = 24 * 7 * 1000 * 3600

  if (equal === 0) {
    return "Hoy"
  } else if (equal <= ayer) {
    return "Ayer"
  } else if (equal > ayer && equal < semana) {
    const diff = parseInt(equal / (3600 * 1000 * 24))
    if (diff > 1) {
      return `Hace ${diff} dias`
    }
    return `Hace un dia`
  } else if (equal === semana) {
    return "Hace una semana"
  } else if (equal > semana) {
    return `${data.getDate()} de ${mes[data.getMonth()]} ${data.getFullYear()}`
  }
}

const ucWords = (word) => {
  const words = word.split(' ')
  const upper = words.map(item => `${item.substr(0, 1).toUpperCase()}${item.substr(1)}`)
  return upper.join(' ')
}

const default_ = { name: '', owner: '' }

export default function List(props) {

  const classes = useStyles()
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
    let aux = [...modules]
    aux[index] = { ...aux[index], [name]: value }
    setModules(aux)
  }

  const check = (index) => () => {
    handleModule(index, 'loading', true)
    axios.post(`${host}/module/stop/${modules[index].image_name}`, {}, authHeaderJSON()).then(
      function (res) {
        console.log(res.data)
        handleModule(index, 'loading', false)
      }
    ).catch(
      function (err) {
        // console.log(err.response.data)
        console.error(err)
        handleModule(index, 'loading', false)
      }
    )
  }

  const show = (id) => () => {
    dispatch(actions.startLoading())
    history.push(`/module/${id}`)
    dispatch(actions.finishLoading())
  }

  useEffect(() => {
    axios.get(`${host}/module`, authHeaderJSON()).then(function (res) {
      setModules(res.data)
      console.log(res.data)
      setFilter(res.data)
      setLoading(false)
    }).catch(function (err) {
      console.error(err)
    })
  }, [])

  return (
    <>
      {
        loading ? <>
          <div className={classes.main}>
            <Skeleton className="mt-4" animation="wave" width={135} height={41 + 41 * 0.2} variant="text" />
          </div>
          <div className={classes.main}>
            <Skeleton className={classes.disableScale} animation="wave" width={500} height={50} variant="text" />
          </div>
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
                          <Grid item>
                            <Grid container direction="row" justify="space-between" alignItems="flex-start">
                              <Grid item>
                                <Skeleton animation="wave" variant="text" height={10} width={80} />
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
                  // <Grid item lg={6} md={6} sm={6} xs={12} key={service}>
                  //   <Card className="m-2">
                  //     <CardHeader
                  //       avatar={
                  //         <Skeleton animation="wave" variant="circle" width={32} height={32} />
                  //       }
                  //       title={
                  //         <Skeleton animation="wave" height={10} />
                  //       }
                  //       subheader={
                  //         <Skeleton animation="wave" height={10} width="40%" />
                  //       }
                  //     />
                  //     <Skeleton animation="wave" variant="rect" className={classes.media} />
                  //     <CardContent>
                  //       <Skeleton animation="wave" height={10} variant="text" />
                  //       <Skeleton animation="wave" height={10} variant="text" />
                  //       <Skeleton animation="wave" height={10} variant="text" width="40%" />
                  //     </CardContent>
                  //     <CardActions disableSpacing>
                  //       <IconButton aria-label="Ver">
                  //         <Visibility />
                  //       </IconButton>
                  //       <IconButton aria-label="Editar">
                  //         <Edit />
                  //       </IconButton>
                  //       <IconButton aria-label="Eliminar">
                  //         <Delete />
                  //       </IconButton>
                  //     </CardActions>
                  //   </Card>
                  // </Grid>
                )
              }
            </Grid>
          </>
        </> : <>
            <div className={classes.main}>
              <Paper className={classes.root}>
                <IconButton color="primary" className={classes.iconButton} aria-label="search">
                  <Search />
                </IconButton>
                <InputBase
                  // onChange={filterActivities}
                  className={classes.input}
                  placeholder="Buscar Actividades"
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Paper>
            </div>
            {
              modules.length === 0 ? (
                <div className={classes.main}>
                  <Alert severity="info" variant="outlined" className={clsx("mt-3", classes.root)}>
                    No existen registros
                </Alert>
                </div>
              ) : (
                  <>
                    {
                      filter.length === 0 ? (
                        <div className={classes.main}>
                          <Alert severity="info" variant="outlined" className={clsx("mt-3", classes.root)}>
                            No se encontraron concurrencias
                        </Alert>
                        </div>
                      ) : null
                    }
                    <Grid container className="mt-3" style={{ maxWidth: '100%' }}>
                      {
                        modules.map((item, index) =>
                          <Grid item lg={6} md={6} sm={6} xs={12} key={item.id}>
                            <Card className="m-2">
                              {item.loading ? <LinearProgress /> : null}
                              <CardContent>
                                <Grid container direction="column" justify="space-between" alignItems="stretch">
                                  <Grid item>
                                    <Grid container direction="row" justify="space-between" alignItems="flex-start">
                                      <Grid item>
                                        <Typography component="h5" variant="h5">
                                          <Link component="button" onClick={show(item.image_name)}>{ucWords(item.name)}</Link>
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                          {item.image}
                                        </Typography>
                                      </Grid>
                                      <Grid item>
                                        <i className="ml-2 fas fa-vial text-success" />
                                        <i className="ml-2 fas fa-stop-circle text-secondary" />
                                        <i className="ml-2 fas fa-trash text-danger" />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                  <Grid item>
                                    <Grid container direction="row" justify="space-between" alignItems="flex-start">
                                      <Grid item>
                                        <span className={classes.owner}>
                                          {ucWords(`${item.user.first_name} ${item.user.last_name}`)}
                                        </span>
                                      </Grid>
                                      <Grid item>
                                        <span className={classes.owner}>
                                          {getDate(item.timestamp)}
                                        </span>
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
                    <Dialog open={dialog} keepMounted onClose={handleDialog(false)} aria-labelledby="alert-dialog-slide-title" aria-describedby="alert-dialog-slide-description">
                      <DialogTitle id="alert-dialog-slide-title">{`Actividad ${deleting.id}`}</DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                          {`¿Desea eliminar la actividad "${deleting.title}"?`}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleDialog(false)} color="primary">Cancelar</Button>
                        <Button onClick={handleDialog(false)} color="primary">Eliminar</Button>
                      </DialogActions>
                    </Dialog>
                  </>
                )
            }
          </>

      }
    </>
  )
}
