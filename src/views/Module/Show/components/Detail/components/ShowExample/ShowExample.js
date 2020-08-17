import React, { useState, useEffect } from 'react'
import { Grid, makeStyles, Card, CardMedia, Link, Breadcrumbs, TextField, Typography, Paper, IconButton } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { Visibility } from '@material-ui/icons'
import clsx from 'clsx'
import { isMobile } from 'react-device-detect'

import ReactPlayer from 'react-player'

import { useDispatch } from "react-redux";
import { actions } from '_redux';

import axios from 'axios'
import { host, authHeaderJSON, history, ws, authHeaderForm } from 'helpers'
import { error } from 'utils'
import { element } from 'prop-types';

const useStyles = makeStyles((theme) => ({
  media: {
    paddingTop: '80%',
    height: 0,
    width: '100%',
    position: 'relative',
    '&:hover div.actions': {
      display: 'flex !important'
    },
    '&:focus div.actions': {
      display: 'flex !important'
    },
    '&:active div.actions': {
      display: 'flex !important'
    },
  },
  video: {
    position: 'relative',
    '&:hover div.actions': {
      display: 'flex !important'
    },
    '&:focus div.actions': {
      display: 'flex !important'
    },
    '&:active div.actions': {
      display: 'flex !important'
    },
  },
  button: {
    position: "absolute",
    top: 10,
    right: 10,
  }
}))

export default function Detail({ module }) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const show = id => () => {
    dispatch(actions.startLoading())
    history.push(`/module/experiment/${id}`)
    dispatch(actions.finishLoading())
  }

  return <>
    <Grid container spacing={2}>
      {
        module.experiments.map((item, key) =>
          <Grid key={key} item xs={12} sm={6} md={6} lg={4} xl={3}>
            {
              module.elements.input.value === 'image' ? <Card>
                <CardMedia className={classes.media} image={`${host}${item.state}`} title={item.state}>
                  <Paper elevation={3} style={{ display: isMobile ? 'flex' : 'none', position: 'absolute', right: 10, borderRadius: '50%', zIndex: 1, top: 10 }} className="actions">
                    <IconButton size="small" onClick={show(item.id)}  >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Paper>
                </CardMedia>
              </Card> : <div className={classes.video}>
                  <ReactPlayer url={`${host}${item.state}`} className={clsx('react-player')} controls playing muted loop width='100%' height='100%' />
                  <Paper elevation={3} style={{ display: isMobile ? 'flex' : 'none', position: 'absolute', right: 10, borderRadius: '50%', zIndex: 1, top: 10 }} className="actions">
                    <IconButton size="small" onClick={show(item.id)}  >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Paper>
                </div>
            }
          </Grid>
        )
      }
    </Grid>
  </>
}
