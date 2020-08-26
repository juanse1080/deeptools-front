import React, { useState, useEffect } from 'react'

import clsx from 'clsx'

import { Alert, Skeleton, } from '@material-ui/lab'

import { Card, Link, CardContent, IconButton, Typography, makeStyles, Grid, Paper, InputBase, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, LinearProgress, Icon, Tooltip, useMediaQuery, useTheme, Menu, MenuItem, ListItemIcon, Breadcrumbs } from '@material-ui/core'
import { Search, Edit, Delete, Visibility } from '@material-ui/icons'

import { isMobile } from 'react-device-detect'

import { host, authHeaderJSON, history, ws } from 'helpers'

import { title as ucWords, format_date as getDate, error } from 'utils'

import { useDispatch } from "react-redux";
import { actions } from '_redux';

import axios from "axios"

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(3),
    }
  },  
}))

export default function List(props) {

  const classes = useStyles()
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.up('sm'))
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    axios.get(`${host}/module`, authHeaderJSON()).then(function (res) {      
      setLoading(false)
    }).catch(function (err) {
      error(err)
    })
  }, [])

  return <>
    <div className={classes.root}>
      {
        loading ?
          null : null
      }
    </div>
  </>
}
