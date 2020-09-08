import React, { useState } from 'react'
import { makeStyles, Icon, Chip, Tab, Tabs, Tooltip, Dialog, IconButton, Slide, useMediaQuery, Grid, Button, useTheme, Breadcrumbs, Link, Typography, DialogActions, DialogContent, DialogContentText, TextField, DialogTitle, Avatar } from '@material-ui/core'
import { Face, Close } from '@material-ui/icons'
import { Autocomplete } from '@material-ui/lab'

import clsx from 'clsx'

import { useDispatch, useSelector } from "react-redux";
import { actions } from '_redux';

import { Protocol, Structure, ModelDetail, ShowDescription, ShowExample, ShowUsers } from './components'

import { title, format_date } from 'utils'
import { NegationIcon } from 'components'

import axios from 'axios'

import { host, authHeaderJSON, history, ws } from 'helpers'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    }
  },
  image: {
    width: '100%',
    height: '30vh',
    textAlign: 'left',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    position: 'relative',
    cursor: 'pointer',
    '& h5': {
      fontSize: '1.5rem',
      fontWeight: 400,
      color: '#fff',
      position: 'absolute',
      bottom: 10,
      left: 20,
    }
  },
  outlinedChip: {
    border: '1px solid rgb(255 255 255)'
  },
  users: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  tabsRoot: {
    textTransform: 'none',
  },
  viewPreview: {
    width: "auto",
    height: "auto",
    maxWidth: "100%",
    maxHeight: "calc( 100vh - 69px )",
  },
  rootDialog: {
    lineHeight: 0,
  },
  paperScrollBody: {
    overflowY: "hidden",
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    color: theme.palette.grey[500],
  },
}))

const default_ = { name: '', id: null, index: null }

export default function Detail({ module, handle }) {
  const classes = useStyles()
  const theme = useTheme()
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const sm = useMediaQuery(theme.breakpoints.up('sm'))

  const [step, setStep] = useState(0)
  const [dialog, setDialog] = useState({ delete: false, create: false })
  const [deleting, setDeleting] = useState(default_)
  const [image, setImage] = useState(false)

  const handleStep = (e, newStep) => {
    setStep(newStep)
  }

  const tryDeleting = index => () => {
    const tempUser = module.users[index]
    setDeleting({ name: title(`${tempUser.first_name} ${tempUser.last_name}`), id: tempUser.id, index: index })
    setDialog(dialog => ({ ...dialog, delete: true }))
  }

  const addUser = () => {
    setDialog(dialog => ({ ...dialog, create: true }))
  }

  const cancelAdd = () => {
    setDialog(dialog => ({ ...dialog, create: false }))
  }

  const cancelDelete = () => {
    setDialog(dialog => ({ ...dialog, delete: false }))
    setDeleting(default_)
  }

  const addedUser = (e, value) => {
    axios.put(`${host}/module/subscribers/${module.image_name}`, { id: value.id }, authHeaderJSON()).then(
      function (res) {
        let currentUsers = [...module['no_subscribers']]
        let index
        currentUsers.some((element, key) => {
          if (element.id === value.id) {
            index = key
            return true
          }
        })
        handle('users', [...module.users, module['no_subscribers'][index]])
        handle('no_subscribers', (() => {
          currentUsers.splice(index, 1)
          return currentUsers
        })())
        setDialog(dialog => ({ ...dialog, delete: false }))
        setDeleting(default_)
        cancelAdd()
      }
    ).catch(
      function (err) {
        console.log(err)
        setDialog(dialog => ({ ...dialog, delete: false }))
        setDeleting(default_)
      }
    )
  }

  const deleted = () => {
    axios.put(`${host}/module/subscribers/${module.image_name}`, { id: deleting.id }, authHeaderJSON()).then(
      function (res) {
        console.log(module.users[deleting.index], [...module['no_subscribers'], module.users[deleting.index]])
        handle('no_subscribers', [...module['no_subscribers'], module.users[deleting.index]])
        handle('users', (() => {
          let currentUsers = [...module.users]
          currentUsers.splice(deleting.index, 1)
          return currentUsers
        })())
        setDialog(dialog => ({ ...dialog, delete: false }))
        setDeleting(default_)
      }
    ).catch(
      function (err) {
        console.log(err)
        setDialog(dialog => ({ ...dialog, delete: false }))
        setDeleting(default_)
      }
    )
  }

  const newTest = () => {
    dispatch(actions.startLoading())
    history.push(`/module/run/${module.image_name}`)
    dispatch(actions.finishLoading())
  }

  const viewOwner = id => () => {
    dispatch(actions.startLoading())
    history.push(`/account/${id}`)
    dispatch(actions.finishLoading())
  }

  const algorithms = () => {
    dispatch(actions.startLoading())
    history.push(user.role === 'developer' || module.subscribers.includes(user.id) ? '/module' : '/subscriptions')
    dispatch(actions.finishLoading())
  }

  const allTest = () => {
    dispatch(actions.startLoading())
    history.push(`/subscriptions/${module.image_name}`)
    dispatch(actions.finishLoading())
  }

  const toggleSubscriber = () => {
    axios.put(`${host}/module/subscriptions/${module.image_name}`, {}, authHeaderJSON()).then(
      function (res) {
        console.log(res.data)
        if (res.data === "add") {
          handle('subscribers', [...module.subscribers, user.id])
        } else if (res.data === "remove") {
          handle('subscribers', module.subscribers.filter(item => item !== user.id))
        }
      }
    ).catch(
      function (err) {
        console.log(err)
      }
    )
  }

  const handleCloseView = () => { setImage(false) }
  const handleShowView = () => { setImage(true) }

  const steps = (module.owner || module.role === 'admin') ? [
    {
      label: 'Description',
      content: <ShowDescription module={module} viewOwner={viewOwner} />
    },
    {
      label: 'Protocol',
      content: <Protocol value={module.protocol} />
    },
    {
      label: 'Example',
      content: <ShowExample module={module} />
    },
    {
      label: 'Representation',
      content: <Structure elements={module.elements} />
    },
    {
      label: 'Model detail',
      content: <ModelDetail value={module} />
    },
    {
      label: 'Users',
      content: <ShowUsers value={module} onDeleting={tryDeleting} onCreating={addUser} />
    },
  ] : [
      {
        label: 'Description',
        content: <ShowDescription module={module} viewOwner={viewOwner} />
      },
      {
        label: 'Protocol',
        content: <Protocol value={module.protocol} />
      },
      {
        label: 'Example',
        content: <ShowExample module={module} />
      },
    ]

  return <div>
    <div className={classes.image} onClick={handleShowView} style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${host}${module.background})` }}>
      <Grid container justify="center" direction="row" style={{ position: 'absolute', top: 10, left: 10, width: 'auto' }}>
        <Grid item xs={12}>
          <Breadcrumbs aria-label="breadcrumb" maxItems={sm ? 8 : 2}>
            <Link color="inherit" className="text-white" onClick={algorithms}>
              {
                user.role === 'developer' || !module.subscribers.includes(user.id) ? 'Algorithms' : 'Subscriptions'
              }
            </Link>
            <Typography color="textSecondary" className="text-white" >{title(module.name)}</Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <h5>{title(module.name)}</h5>
      <Tooltip placement="left" className={clsx("", classes.users)} title={module.subscribers.length !== 1 ? `${module.subscribers.length} users` : "One user"}>
        <Chip variant="outlined" icon={<Icon fontSize="small" className={clsx("fal fa-user-circle")} />} label={module.subscribers.length} size="small" classes={{ outlined: classes.outlinedChip }} />
      </Tooltip>
    </div>
    <Tabs value={step} onChange={handleStep} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto" indicatorColor="primary" aria-label="scrollable auto tabs example">
      {
        steps.map((tab, index) => <Tab key={index} classes={{ root: classes.tabsRoot }} label={tab.label} id={`scrollable-auto-tab-${index}`}
          aria-controls={`scrollable-auto-tabpanel-${index}`} />)
      }
    </Tabs>

    <div className={classes.root}>
      {steps[step].content}
      <Grid container className="mt-3" spacing={3} direction="row" justify="flex-end" >
        {
          sm ? <Grid item>
            {
              module.subscribers.includes(user.id) || module.owner ? <>
                {
                  module.state !== 'active' ?
                    <Button variant="outlined" disabled size="small" color="default" startIcon={<Icon fontSize="small" className="fal fa-vial" />} className="mr-2"> New </Button> : <Tooltip title="Test algorith">
                      <Button variant="outlined" onClick={newTest} size="small" color="default" startIcon={<Icon fontSize="small" className="fal fa-vial" />} className="mr-2"> New </Button>
                    </Tooltip>
                }
                <Tooltip title="All test">
                  <Button variant="outlined" onClick={allTest} size="small" color="default" startIcon={<Icon fontSize="small" className="fal fa-clipboard-list" />} className="mr-2"> All </Button>
                </Tooltip>
                {
                  module.owner ? null : <Tooltip title="Unsubscribe">
                    <Button variant="outlined" onClick={toggleSubscriber} size="small" color="default" className="mr-2" >Unsubscribe</Button>
                  </Tooltip>
                }
              </> : module.owner ? null : <Tooltip title="Subscribe">
                <Button variant="outlined" onClick={toggleSubscriber} size="small" color="primary" className="mr-2">Subscribe</Button>
              </Tooltip>
            }
          </Grid> : <Grid item>
              {
                module.subscribers.includes(user.id) || module.owner ? <>
                  {
                    module.state !== 'active' ? null :
                      <Tooltip title="Test algorith">
                        <IconButton onClick={newTest} color="default" className="mr-2">
                          <Icon fontSize="small" className="fal fa-vial" />
                        </IconButton>
                      </Tooltip>
                  }
                  <Tooltip title="All test">
                    <IconButton onClick={allTest} color="default" className="mr-2">
                      <Icon fontSize="small" className="fal fa-clipboard-list" />
                    </IconButton>
                  </Tooltip>
                  {
                    module.owner ? null : <Tooltip title="Unsubscribe">
                      <IconButton onClick={toggleSubscriber} color="default" className="mr-2">
                        <Icon fontSize="small" className="fal fa-anchor" color="primary" />
                      </IconButton>
                    </Tooltip>
                  }
                </> : module.owner ? null : <Tooltip title="Subscribe">
                  <IconButton onClick={toggleSubscriber} color="primary" className="mr-2">
                    <Icon fontSize="small" className="fal fa-anchor" />
                  </IconButton>
                </Tooltip>
              }
            </Grid>
        }
      </Grid>
    </div >
    <Dialog
      classes={{ root: classes.rootDialog, paperScrollBody: classes.paperScrollBody }}
      scroll="body"
      onClose={handleCloseView}
      aria-labelledby="customized-dialog-title"
      open={image}
      TransitionComponent={Transition}
    >
      <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseView}>
        <Close />
      </IconButton>
      <img className={classes.viewPreview} src={`${host}${module.background}`} alt="Imagen preview" />
    </Dialog>
    <Dialog open={dialog.delete} keepMounted onClose={cancelDelete} maxWidth="sm" fullWidth>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {`¿Do want to delete the user ${deleting.name}?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelDelete} variant="outlined">Cancel</Button>
        <Button onClick={deleted} variant="outlined">Confirm</Button>
      </DialogActions>
    </Dialog>
    <Dialog open={dialog.create} keepMounted onClose={cancelAdd} maxWidth="sm" fullWidth>
      <DialogTitle id="alert-dialog-slide-title">Add users</DialogTitle>
      <DialogContent>
        <Autocomplete fullWidth size="small"
          options={module['no_subscribers']}
          onChange={addedUser}
          value={null}
          getOptionLabel={(option) =>
            `${option.first_name} ${option.last_name}`
          }
          renderInput={
            (params) => <TextField {...params} label="Images" variant="outlined" />
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelAdd} variant="outlined">Cancel</Button>
      </DialogActions>
    </Dialog>
  </div>
}
