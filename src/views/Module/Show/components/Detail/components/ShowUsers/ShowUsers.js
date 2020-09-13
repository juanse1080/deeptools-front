import {
  Avatar,
  Fab,
  Grid,
  Icon,
  makeStyles,
  Paper,
  Tooltip,
  Typography
} from '@material-ui/core';
import { history, host } from 'helpers';
import React from 'react';
import { useDispatch } from 'react-redux';
import { title } from 'utils';
import { actions } from '_redux';

const useStyles = makeStyles(theme => ({
  large: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    border: '1px solid #d0d0d0'
  },
  hoverUser: {
    width: 'max-content',
    position: 'relative',
    '&:hover div.actions': {
      display: 'flex !important'
    },
    '&:hover > div.avatar': {
      borderColor: '#6b6b6b'
    }
  },
  icon: {
    right: 'calc(25% - 15px)',
    position: 'absolute',
    zIndex: 2,
    borderRadius: '50%',
    display: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  }
}));

export default function Users({ value, onDeleting, onCreating }) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const show = id => () => {
    dispatch(actions.startLoading());
    history.push(`/account/${id}`);
    dispatch(actions.finishLoading());
  };

  return (
    <>
      {value.users.length > 0 ? (
        value.users.map((user, index) => (
          <div key={user.id} className={classes.hoverUser}>
            <Tooltip title="Delete user" placement="bottom">
              <Paper
                className={classes.icon + ' actions'}
                style={{ top: 'calc(25% - 15px)' }}>
                <Icon
                  fontSize="small"
                  className="fal fa-times-circle"
                  onClick={onDeleting(index)}
                />
              </Paper>
            </Tooltip>
            <Tooltip
              title={title(`${user.first_name} ${user.last_name}`)}
              placement="bottom">
              <Avatar
                alt={user.first_name}
                src={`${host}${user.photo}`}
                className={classes.large + ' avatar'}
              />
            </Tooltip>
            <Tooltip title="Show user" placement="bottom">
              <Paper
                className={classes.icon + ' actions'}
                style={{ bottom: 'calc(25% - 15px)' }}>
                <Icon
                  fontSize="small"
                  className="fal fa-user-circle"
                  onClick={show(user.id)}
                />
              </Paper>
            </Tooltip>
          </div>
        ))
      ) : (
        <Typography variant="body2">
          Your algorithms currently has no subscribers
        </Typography>
      )}
      <Grid container justify="flex-end" className="mt-3">
        <Grid item>
          <Tooltip title="Add user">
            <Fab
              size="small"
              color="primary"
              aria-label="Add user"
              onClick={onCreating}>
              <Icon fontSize="small" className="fal fa-plus text-white" />
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>
    </>
  );
}
