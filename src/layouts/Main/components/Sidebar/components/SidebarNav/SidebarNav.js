/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem, Button, colors, Typography, Link } from '@material-ui/core'
import { TreeItem, TreeView } from '@material-ui/lab'

import { useSelector } from 'react-redux'

import { history } from 'helpers'

const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    color: 'rgba(255,255,255,.6)',
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium,
    '&:hover': {
      color: theme.palette.white,
    }
  },
  icon: {
    color: 'inherit',
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px 0px',
    color: 'rgba(255,255,255,.6)',
  },
  labelText: {
    marginLeft: theme.spacing(1),
    fontWeight: 'inherit',
    flexGrow: 1,
  },
  content: {
    display: 'inherit',
    cursor: 'pointer',
    width: '100%'
  },
  label: {
    color: 'rgba(255,255,255,.6)',
    '&:hover': {
      color: theme.palette.white,
      backgroundColor: 'inherit'
    }
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));

const SidebarNav = props => {
  const { pages, className, ...rest } = props;

  const classes = useStyles();
  const state = useSelector(state => state)

  const renderTree = (nodes) => (
    <TreeItem classes={{ content: classes.content, label: classes.label }} key={nodes.id} nodeId={nodes.id} label={
      <Link color="inherit" className={classes.labelRoot} underline="none" onClick={() => { if (nodes.href) history.push(nodes.href) }}>
        {nodes.icon ? nodes.icon : null}
        <Typography variant="subtitle1" className={classes.labelText} color="inherit">
          {nodes.title}
        </Typography>
      </Link>
    }>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
  )

  // return <List {...rest} className={clsx(classes.root, className)}>
  //   {
  //     pages.map(page =>
  //       state.user ?
  //         page.roles.includes(state.user.role) ? <ListItem
  //           className={classes.item}
  //           disableGutters
  //           key={page.title}
  //         >
  //           <Button
  //             className={classes.button}
  //             component={CustomRouterLink}
  //             to={page.href}
  //           >
  //             <div className={classes.icon}>{page.icon}</div>
  //             {page.title}
  //           </Button>
  //         </ListItem> : null
  //         : null
  //     )
  //   }
  // </List>

  return (
    <TreeView
      className={classes.root}
      defaultExpanded={['root']}
    >
      {
        pages.map(page => state.user ? page.roles.includes(state.user.role) ? renderTree(page) : null : null)
      }
    </TreeView>
  );
}

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
};

export default SidebarNav;
