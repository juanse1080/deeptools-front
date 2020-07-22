import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import { Drawer, Icon } from '@material-ui/core'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PeopleIcon from '@material-ui/icons/People'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket'
import TextFieldsIcon from '@material-ui/icons/TextFields'
import ImageIcon from '@material-ui/icons/Image'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import SettingsIcon from '@material-ui/icons/Settings'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import AddCircleIcon from '@material-ui/icons/AddCircle'

import { useSelector } from 'react-redux'

import { SidebarNav } from './components'

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
  },
  root: {
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(1, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  },
}))

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props
  const classes = useStyles()

  const pages = [
    {
      id: '1',
      title: 'Module',
      roles: ['admin', 'developer'],
      icon: <Icon fontSize="small" className="fab fa-docker" />,
      children: [
        {
          id: '2',
          title: 'List',
          href: '/module',
          roles: ['admin', 'developer'],
          icon: <Icon fontSize="small" className="fas fa-clipboard-list" />
        },
        {
          id: '3',
          title: 'Create',
          href: '/module/create',
          roles: ['admin', 'developer'],
          icon: <Icon fontSize="small" className="fas fa-plus-circle" />
        },
        {
          id: '4',
          title: 'Trash',
          href: '/module/trash',
          roles: ['admin', 'developer'],
          icon: <Icon fontSize="small" className="fas fa-trash" />
        },
      ]
    },
    {
      id: '5',
      title: 'Subscriptions',
      href: '/subscriptions',
      roles: ['user'],
      icon: <Icon fontSize="small" className="fas fa-anchor" />,
    },
    {
      id: '6',
      title: 'Running',
      href: '/module/experiment',
      roles: ['admin', 'developer', 'user'],
      icon: <Icon fontSize="small" className="fas fa-running" />
    },
  ]




  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        {/* <Profile /> */}
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
