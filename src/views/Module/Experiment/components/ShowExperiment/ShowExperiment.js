import React, { useState } from 'react'
import { Grid, makeStyles, Card, CardMedia } from '@material-ui/core'

import ReactPlayer from 'react-player'

import { host } from 'helpers'

const useStyles = makeStyles((theme) => ({
  media: {
    paddingTop: '80%',
    height: 0,
    width: '100%'
  }
}))

export default function ({ value, ...others }) {
  const classes = useStyles()

  return <div {...others}>
    <Grid container spacing={2}>
      <Grid item lg={3} md={12} sm={12} xs={12}>
        <Grid container spacing={2}>
          <Grid item lg={12} md={6} sm={6} xs={12}>
            {
              value.input.length == 1 ? <ReactPlayer url={`${host}${value.input[0]}`} className='react-player' controls playing muted loop width='100%' height='100%' /> : null
            }
          </Grid>
          <Grid item lg={12} md={6} sm={6} xs={12}>
            {
              value.output.length == 1 ? <ReactPlayer url={`${host}${value.output[0]}`} className='react-player' controls playing muted loop width='100%' height='100%' /> : null
            }
          </Grid>
        </Grid>
      </Grid>
      <Grid item lg={9} md={12} sm={12}>
        <span className="text-muted">
          {value.response[0]}
        </span>
      </Grid>

    </Grid>
  </div>

}