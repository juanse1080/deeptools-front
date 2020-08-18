import React from 'react'
import { Avatar, Tooltip, IconButton, Typography } from '@material-ui/core'

import { host, history } from 'helpers'
import { title } from 'utils'

import { useDispatch } from "react-redux"
import { actions } from '_redux'




export default function Users({ value }) {
  const dispatch = useDispatch()

  const show = (id) => () => {
    dispatch(actions.startLoading())
    history.push(`/account/${id}`)
    dispatch(actions.finishLoading())
  }

  return <>
    {
      value.users.length > 0 ? value.users.map(user =>
        <IconButton key={user.id} onClick={show(user.id)} size="small">
          <Tooltip title={title(`${user.first_name} ${user.last_name}`)} placement="bottom">
            <Avatar alt={user.first_name} src={`${host}${user.photo}`} />
          </Tooltip>
        </IconButton>
      ) : <Typography variant="body2">Your algorithms currently has no subscribers</Typography>
    }
  </>
}