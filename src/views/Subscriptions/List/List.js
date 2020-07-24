import React, { useState, useEffect } from 'react'

import clsx from 'clsx'

import { Alert, Skeleton, } from '@material-ui/lab'

import { Link, IconButton, Typography, makeStyles, Grid, Paper, InputBase, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Icon, Tooltip, ExpansionPanelSummary, ExpansionPanelDetails, ExpansionPanel, Breadcrumbs, useMediaQuery, useTheme, Menu, MenuItem, ListItemIcon, Fab } from '@material-ui/core'
import { Search, ExpandMore, ExpandLess } from '@material-ui/icons'

import { isMobile } from 'react-device-detect'
import { useDispatch } from "react-redux"
import axios from "axios"

import { host, authHeaderJSON, history } from 'helpers'

import { title as ucWords, error } from 'utils'


import { actions } from '_redux'



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(3),
      // backgroundColor: theme.palette.white
    }
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  colorPreview: {
    fontSize: '0.8rem'
  },
  alerts: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  main: {
    display: 'flex',
    justifyContent: 'center',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
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
  },
  iconButton: {
    fontSize: 15,
    margin: 5
  },
  cardContent: {
    '&:last-child': {
      paddingBottom: '14px'
    }
  },
  rootTitleDialog: {
    flex: '0 0 auto',
    margin: 0,
    padding: '24px 24px',
  },
  expansionPanelContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  expansionPanelRoot: {
    cursor: 'default !important',
    '&:hover': {
      cursor: 'default !important',
    }
  },
  expansionPanelDetails: {
    position: 'relative',
  },
  lessDetails: {
    position: 'absolute',
    right: 10,
    bottom: 10
  },
  listItemIconRoot: {
    minWidth: '30px'
  },
  heading: {
    display: 'block',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.pxToRem(15),
    minWidth: 0,
  },
  iconsHeading: {
    fontSize: theme.typography.pxToRem(15),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'end',
    alignItems: 'center',
    marginLeft: theme.spacing(1)
  },
  fullWidth: {
    width: '100%',
    '&:hover div.actions': {
      display: 'block !important',
      [theme.breakpoints.up('sm')]: {
        minWidth: '123px',
      }
    },
    '&:focus div.actions': {
      display: 'block !important',
      [theme.breakpoints.up('sm')]: {
        minWidth: '123px',
      }
    },
    '&:active div.actions': {
      display: 'block !important',
      [theme.breakpoints.up('sm')]: {
        minWidth: '123px',
      }
    },
  }
}))

const default_ = { name: '', owner: '' }

export default function List(props) {

  const classes = useStyles()
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.up('sm'))
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [modules, setModules] = useState([])
  const [filter, setFilter] = useState([])

  const [dialog, setDialog] = useState(false)
  const [deleting, setDeleting] = useState(default_)

  const changeExpanded = panel => () => {
    handleClose(panel)()
    setExpanded(expanded => expanded !== panel ? panel : false)
  }

  const handleDialog = (value = !dialog) => () => {
    setDialog(value)
  }

  const handleModule = (index, name, value) => {
    let aux = [...filter]
    aux[index] = { ...aux[index], [name]: value }
    setModules(modules.map(item => item.id === aux[index].id ? { ...item, [name]: value } : item))
    setFilter(aux)
  }

  const triedDelete = (index) => () => {
    setDeleting({ ...filter[index], index: index })
    handleDialog(true)()
  }

  const cancelDelete = () => {
    handleDialog(false)()
  }

  const deleteModule = () => {
    handleDialog(false)()
    handleModule(deleting.index, 'loading', true)
    axios.delete(`${host}/module/delete/${deleting.image_name}`, authHeaderJSON()).then(
      function (res) {
        handleModule(deleting.index, 'loading', false)
        setModules(modules => modules.filter(item => item.image_name !== deleting.image_name))
        setFilter(filter => filter.filter(item => item.image_name !== deleting.image_name))
        setDeleting(default_)
      }
    ).catch(
      function (err) {
        console.error(err)
        handleModule(deleting.index, 'loading', false)
        setDeleting(default_)
      }
    )
  }

  const show = (id) => () => {
    dispatch(actions.startLoading())
    history.push(`/module/${id}`)
    dispatch(actions.finishLoading())
  }

  const run = (id) => () => {
    dispatch(actions.startLoading())
    history.push(`/module/run/${id}`)
    dispatch(actions.finishLoading())
  }

  const showTest = id => () => {
    dispatch(actions.startLoading())
    history.push(`/subscriptions/${id}`)
    dispatch(actions.finishLoading())
  }

  const handleClick = index => event => {
    handleModule(index, 'anchor', event.currentTarget)
  }

  const handleClose = index => () => {
    handleModule(index, 'anchor', null)
  }

  // Filtrar contenedores
  const filterModules = (e) => {
    const val = e.target.value
    if (val) {
      const query = modules.filter(module => module.name.toLowerCase().indexOf(val.toLowerCase()) > -1 || module.image.toLowerCase().indexOf(val.toLowerCase()) > -1 || `${module.user.first_name} ${module.user.last_name}`.toLowerCase().indexOf(val.toLowerCase()) > -1)
      console.log(query)
      setFilter(query)
    } else {
      setFilter(modules)
    }
  }

  useEffect(() => {
    axios.get(`${host}/accounts/subscriptions`, authHeaderJSON()).then(function (res) {
      setModules(res.data.map(item => ({ ...item, anchor: null })))
      setFilter(res.data.map(item => ({ ...item, anchor: null })))
      setLoading(false)
    }).catch(function (err) {
      error(err)
    })
  }, [])

  return <>
    <div className={classes.root}>
      {
        loading ? <>
          <Grid container className="mt-3" justify="center" direction="row">
            <Grid item xs={12} sm={10} md={8} xl={6}>
              <div className={clsx(classes.main, "m-2")}>
                <Skeleton className={classes.disableScale} animation="wave" width="100%" height={50} variant="text" />
              </div>
            </Grid>
          </Grid>
          <>
            <Grid container className="mt-3" style={{ maxWidth: '100%' }}>
              {
                [1, 2, 3, 4, 5, 6].map(item =>
                  <ExpansionPanel key={item} expanded={false} className={classes.fullWidth}>
                    <ExpansionPanelSummary
                      classes={{ content: classes.expansionPanelContent, root: classes.expansionPanelRoot }}
                      aria-controls="panel1bh-content"
                    >
                      <div className={classes.title}>
                        <Typography className={classes.heading}>
                          <Skeleton animation="wave" variant="text" height={20} width={200} />
                        </Typography>

                        <Typography variant="caption" >
                          <Skeleton animation="wave" variant="text" height={10} width={80} />
                        </Typography>
                      </div>

                      <div className={classes.iconsHeading}>
                        <Skeleton animation="wave" variant="circle" width={16} height={16} />
                        <Skeleton animation="wave" variant="circle" width={16} height={16} />
                        <Skeleton animation="wave" variant="circle" width={16} height={16} />
                        <Skeleton animation="wave" variant="circle" width={16} height={16} />
                      </div>

                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails classes={{ root: classes.expansionPanelDetails }}>
                      <Typography>
                        {item.description || "Description not supplied"}
                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                )
              }
            </Grid>
          </>
        </> : <>
            <Grid container justify="center" direction="row">
              <Grid item xs={12}>
                <Breadcrumbs aria-label="breadcrumb" maxItems={sm ? 8 : 2}>
                  <Typography color="textSecondary">Algorithms</Typography>
                </Breadcrumbs>
              </Grid>
            </Grid>
            <Grid container className="mt-3" justify="center" direction="row">
              <Grid item xs={12} sm={10} md={8} xl={6}>
                <Paper className={classes.alerts}>
                  <IconButton size="small" color="primary" className={classes.iconButton} aria-label="search">
                    <Search />
                  </IconButton>
                  <InputBase
                    onChange={filterModules}
                    className={classes.input}
                    placeholder="Find modules"
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Paper>
              </Grid>
            </Grid>
            {
              modules.length === 0 ? (
                <Grid container className="mt-3" justify="center" direction="row">
                  <Grid item xs={12} sm={10} md={8} xl={6}>
                    <Alert severity="info" variant="outlined" className={clsx("mt-3", classes.alerts)}>
                      There are no records
                    </Alert>
                  </Grid>
                </Grid>
              ) : (
                  <>
                    {
                      filter.length === 0 ? (
                        <Grid container className="mt-3" justify="center" direction="row">
                          <Grid item xs={12} sm={10} md={8} xl={6}>
                            <Alert severity="info" variant="outlined" className={clsx("mt-3", classes.alerts)}>
                              No concurrences were found
                            </Alert>
                          </Grid>
                        </Grid>
                      ) : null
                    }
                    <Grid container className="mt-3" style={{ maxWidth: '100%' }}>
                      {
                        filter.map((item, index) =>
                          <ExpansionPanel key={item.id} expanded={expanded === index} className={classes.fullWidth}>

                            <ExpansionPanelSummary
                              classes={{ content: classes.expansionPanelContent, root: classes.expansionPanelRoot }}
                            >

                              <div className={classes.title}>
                                <Typography noWrap>
                                  <Link onClick={show(item.image_name)}>
                                    {ucWords(item.name)}
                                  </Link>
                                </Typography>

                                <Typography variant="caption" style={{ whiteSpace: 'noWrap' }}>
                                  <Link onClick={show(item.image_name)} component="button">{ucWords(`${item.user.first_name} ${item.user.last_name}`)}</Link>
                                </Typography>
                              </div>

                              <div style={{ display: isMobile ? 'flex' : 'none' }} className="actions">
                                {
                                  sm ? <>
                                    <Tooltip title={expanded !== index ? "More details" : "Less details"}>
                                      <IconButton onClick={changeExpanded(index)} size="small">
                                        {
                                          expanded !== index ? <ExpandMore /> : <ExpandLess />
                                        }
                                      </IconButton>
                                    </Tooltip>
                                    {
                                      item.state === 'active' ? <Tooltip title="Test algorith">
                                        <IconButton size="small" onClick={run(item.image_name)}>
                                          <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-vial text-success")} />
                                        </IconButton>
                                      </Tooltip> : <Tooltip title="This algorith is not active">
                                          <IconButton size="small" disableFocusRipple disableRipple>
                                            <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-vial")} />
                                          </IconButton>
                                        </Tooltip>
                                    }
                                    <Tooltip title="All test">
                                      <IconButton size="small" onClick={showTest(item.image_name)}>
                                        <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-clipboard-list text-info")} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Unsubscribe">
                                      <IconButton size="small">
                                        <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-anchor text-danger")} />
                                      </IconButton>
                                    </Tooltip>
                                  </> : <>
                                      <IconButton size="small" onClick={handleClick(index)}>
                                        <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-ellipsis-v")} />
                                      </IconButton>
                                      <Menu anchorEl={item.anchor} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(item.anchor)} onClose={handleClose(index)}>
                                        <MenuItem onClick={changeExpanded(index)}>
                                          <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                                            {
                                              expanded !== index ? <ExpandMore /> : <ExpandLess />
                                            }
                                          </ListItemIcon>
                                          <Typography variant="inherit">{expanded !== index ? "More details" : "Less details"}</Typography>
                                        </MenuItem>
                                        {
                                          item.state === 'active' ?
                                            <MenuItem onClick={run(item.image_name)}>
                                              <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                                                <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-vial text-success")} />
                                              </ListItemIcon>
                                              <Typography variant="inherit">Test algorith</Typography>
                                            </MenuItem> : null
                                        }
                                        <MenuItem onClick={showTest(item.image_name)}>
                                          <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                                            <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-clipboard-list text-info")} />
                                          </ListItemIcon>
                                          <Typography variant="inherit">All test</Typography>
                                        </MenuItem>
                                        <MenuItem>
                                          <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                                            <Icon fontSize="small" className={clsx(classes.iconButton, "fas fa-anchor text-danger")} />
                                          </ListItemIcon>
                                          <Typography variant="inherit">Unsubscribe</Typography>
                                        </MenuItem>
                                      </Menu>
                                    </>
                                }
                              </div>

                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails classes={{ root: classes.expansionPanelDetails }}>
                              <Typography>
                                {item.description || "Description not supplied"}
                              </Typography>
                              <IconButton size="small" className={classes.lessDetails} onClick={changeExpanded(index)}>
                                <ExpandLess />
                              </IconButton>
                            </ExpansionPanelDetails>
                          </ExpansionPanel>
                        )
                      }
                    </Grid>
                    <Dialog open={dialog} keepMounted onClose={cancelDelete} aria-labelledby="alert-dialog-slide-title" aria-describedby="alert-dialog-slide-description">
                      <DialogTitle id="alert-dialog-slide-title" classes={{ root: classes.rootTitleDialog }}>{`Module ${deleting.name}`}</DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                          {`¿Do want delete background "${deleting.name}"?`}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={cancelDelete} color="primary">Cancel</Button>
                        <Button onClick={deleteModule} color="primary">Confirm</Button>
                      </DialogActions>
                    </Dialog>
                  </>
                )
            }
          </>

      }
    </div>
  </>
}
