import { Button, Typography } from '@material-ui/core';
import { TreeItem, TreeView } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { history } from 'helpers';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
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
      color: theme.palette.white
    }
  },
  icon: {
    color: 'inherit',
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    color: 'rgba(255,255,255,.6)',
    textTransform: 'none',
    width: '100%',
    '&:hover': {
      color: theme.palette.white
    }
  },
  labelText: {
    marginLeft: theme.spacing(1),
    fontWeight: 'inherit',
    flexGrow: 1
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

const SidebarNav = props => {
  const { pages } = props;

  const classes = useStyles();
  const state = useSelector(state => state);

  const renderTree = nodes => (
    <TreeItem
      classes={{ content: classes.content, label: classes.label }}
      key={nodes.id}
      nodeId={nodes.id}
      label={
        <Button
          className={classes.labelRoot}
          onClick={() => {
            if (nodes.href) history.push(nodes.href);
          }}
          startIcon={nodes.icon ? nodes.icon : null}>
          <Typography
            variant="subtitle1"
            align="left"
            className={classes.labelText}
            color="inherit">
            {nodes.title}
          </Typography>
        </Button>
      }>
      {Array.isArray(nodes.children)
        ? nodes.children.map(node => renderTree(node))
        : null}
    </TreeItem>
  );

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
    <TreeView className={classes.root} defaultExpanded={['root']}>
      {pages.map(page =>
        state.user
          ? page.roles.includes(state.user.role)
            ? renderTree(page)
            : null
          : null
      )}
    </TreeView>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
};

export default SidebarNav;
