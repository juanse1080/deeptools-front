import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import { Drawer, Icon, Button, Typography } from '@material-ui/core'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PeopleIcon from '@material-ui/icons/People'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket'
import TextFieldsIcon from '@material-ui/icons/TextFields'
import ImageIcon from '@material-ui/icons/Image'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import SettingsIcon from '@material-ui/icons/Settings'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import AddCircleIcon from '@material-ui/icons/AddCircle'

import { SidebarNav } from './components'

import { history } from 'helpers'

import { useDispatch, useSelector } from 'react-redux'
import { actions } from '_redux'

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
  },
  root: {
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2),
    justifyContent: 'space-between'
  },
  divider: {
    margin: theme.spacing(1, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  },
  labelRoot: {
    paddingLeft: 18,
    display: 'flex',
    alignItems: 'center',
    color: 'rgba(255,255,255,.6)',
    textTransform: 'none',
    width: '100%',
    '&:hover': {
      color: theme.palette.white,
    }
  },
  labelText: {
    marginLeft: theme.spacing(1),
    fontWeight: 'inherit',
    flexGrow: 1,
  },
  paperAnchorLeft: {
    borderRight: 0
  }
}))

const pages = [
  {
    id: '0',
    title: 'Algorithms',
    href: '/algorithms',
    roles: ['user'],
    icon: <Icon fontSize="small" className="fal fa-code"  />,
  },
  {
    id: '1',
    title: 'Algorithms',
    roles: ['admin', 'developer'],
    icon: <Icon fontSize="small" className="fal fa-code"  />,
    children: [
      {
        id: '2',
        title: 'List',
        href: '/module',
        roles: ['admin', 'developer'],
        icon: <Icon fontSize="small" className="fal fa-clipboard-list" />
      },
      {
        id: '3',
        title: 'Create',
        href: '/module/create',
        roles: ['admin', 'developer'],
        icon: <Icon fontSize="small" className="fal fa-plus-circle" />
      },
      // {
      //   id: '4',
      //   title: 'Trash',
      //   href: '/module/trash',
      //   roles: ['admin', 'developer'],
      //   icon: <Icon fontSize="small" className="fal fa-trash-alt text-danger" />
      // },
    ]
  },
  {
    id: '5',
    title: 'Subscriptions',
    href: '/subscriptions',
    roles: ['user'],
    icon: <Icon fontSize="small" className="fal fa-anchor"  />,
  },
  {
    id: '6',
    title: 'Running',
    href: '/module/experiment',
    roles: ['admin', 'developer', 'user'],
    icon: <Icon fontSize="small" className="fal fa-running"  />
  },
  {
    id: '7',
    title: 'Profile',
    href: '/account',
    roles: ['user', 'developer', 'admin'],
    icon: <Icon fontSize="small" className="fal fa-user-circle"  />
  },
  {
    id: '8',
    title: 'Notifications',
    href: '/notifications',
    roles: ['user', 'developer', 'admin'],
    icon: <Icon fontSize="small" className="fal fa-bell"  />
  },
]

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props
  const classes = useStyles()
  const dispatch = useDispatch()

  const to = (href) => () => {
    dispatch(actions.startLoading())
    history.push(href)
    dispatch(actions.finishLoading())
  }

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer, paperAnchorLeft: classes.paperAnchorLeft }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <div>
          <RouterLink to="/">
            <img
              alt="Logo"
              // width="200"
              src="/images/logos/logo--white.svg"
            />
          </RouterLink>
          <div className={classes.divider} />
          <SidebarNav
            className={classes.nav}
            pages={pages}
          />
        </div>
        <div>          
          <Button className={classes.labelRoot} onClick={() => dispatch(actions.logout())} startIcon={<Icon fontSize="small" className="fal fa-sign-out-alt" />}>
            <Typography variant="subtitle1" align="left" className={classes.labelText} color="inherit">
              Logout
          </Typography>
          </Button>
        </div>
      </div>
    </Drawer>
  )
}

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
}

export default Sidebar
