import React, { useState } from 'react'
import { makeStyles, Icon, Chip, Tab, Tabs, Tooltip, Dialog, IconButton, Slide, useMediaQuery, Grid, Button, useTheme } from '@material-ui/core'
import { Face, Close } from '@material-ui/icons'

import clsx from 'clsx'

import { useDispatch, useSelector } from "react-redux";
import { actions } from '_redux';

import { Protocol, Structure, ModelDetail, ShowDescription } from './components'

import { title, format_date } from 'utils'

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
    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://developer.ibm.com/developer/articles/cc-machine-learning-deep-learning-architectures/nl/es/images/figure06.png)",
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
  users: {
    position: 'absolute',
    right: 10,
    top: 20,
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

export default function Detail({ module }) {
  const classes = useStyles()
  const theme = useTheme()
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const sm = useMediaQuery(theme.breakpoints.up('sm'))

  const [step, setStep] = useState(0)
  const [image, setImage] = useState(false)

  const handleStep = (e, newStep) => {
    setStep(newStep)
  }

  const newTest = () => {
    dispatch(actions.startLoading())
    history.push(`/module/run/${module.image_name}`)
    dispatch(actions.finishLoading())
  }

  const allTest = () => {
    dispatch(actions.startLoading())
    history.push(`/subscriptions/${module.image_name}`)
    dispatch(actions.finishLoading())
  }

  const handleCloseView = () => { setImage(false) }
  const handleShowView = () => { setImage(true) }

  const steps = (module.owner || module.role === 'admin') ? [
    {
      label: 'Description',
      content: <ShowDescription module={module} />
    },
    {
      label: 'Protocol',
      content: <Protocol value={module.protocol} />
    },
    {
      label: 'Representation',
      content: <Structure elements={module.elements} />
    },
    {
      label: 'Model detail',
      content: <ModelDetail value={module} />
    },
  ] : [
      {
        label: 'Description',
        content: <ShowDescription module={module} />
      },
      {
        label: 'Protocol',
        content: <Protocol value={module.protocol} />
      }
    ]

  return <div>
    <div className={classes.image} onClick={handleShowView}>
      <h5>{title(module.name)}</h5>
      <Tooltip placement="left" className={classes.users} title={module.users > 1 ? `${module.users} users` : "One user"}>
        <Chip icon={<Face />} label={module.subscribers.length} size="small" />
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
              module.subscribers.includes(user.id) ? <>
                {
                  module.state !== 'active' ?
                    <Button disabled size="small" variant="contained" color="default" startIcon={<Icon fontSize="small" className="fas fa-vial" />} className="mr-2"> New </Button> : <Tooltip title="Test algorith">
                      <Button onClick={newTest} size="small" variant="contained" color="default" startIcon={<Icon fontSize="small" className="fas fa-vial text-success" />} className="mr-2"> New </Button>
                    </Tooltip>
                }
                <Tooltip title="All test">
                  <Button onClick={allTest} size="small" variant="contained" color="default" startIcon={<Icon fontSize="small" className="fas fa-clipboard-list text-info" />} className="mr-2"> All </Button>
                </Tooltip>
                <Tooltip title="Unsubscribe">
                  <Button onClick={allTest} size="small" variant="contained" color="default" className="mr-2 bg-danger text-white">Unsubscribe</Button>
                </Tooltip>
              </> : <Tooltip title="Subscribe">
                  <Button onClick={allTest} size="small" variant="contained" color="primary" className="mr-2">Subscribe</Button>
                </Tooltip>
            }
          </Grid> : <Grid item>
              {
                module.subscribers.includes(user.id) ? <>
                  {
                    module.state !== 'active' ? null :
                      <Tooltip title="Test algorith">
                        <IconButton onClick={newTest} variant="contained" color="default" className="mr-2">
                          <Icon fontSize="small" className="fas fa-vial text-success" />
                        </IconButton>
                      </Tooltip>
                  }
                  <Tooltip title="All test">
                    <IconButton onClick={allTest} variant="contained" color="default" className="mr-2">
                      <Icon fontSize="small" className="fas fa-clipboard-list text-info" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Unsubscribe">
                    <IconButton onClick={allTest} variant="contained" color="default" className="mr-2">
                      <Icon fontSize="small" className="fas fa-anchor text-danger" color="primary" />
                    </IconButton>
                  </Tooltip>
                </> : <Tooltip title="Subscribe">
                    <IconButton onClick={allTest} variant="contained" color="primary" className="mr-2">
                      <Icon fontSize="small" className="fas fa-anchor" />
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
      <img className={classes.viewPreview} src="https://developer.ibm.com/developer/articles/cc-machine-learning-deep-learning-architectures/nl/es/images/figure06.png" alt="Imagen preview" />
    </Dialog>
  </div>
}
