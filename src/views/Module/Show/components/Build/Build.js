import React, { useState } from "react"
import { makeStyles, LinearProgress, Grid, Link, FormHelperText, Paper, Fab, Icon } from "@material-ui/core"
import theme from "theme"
import { host } from 'helpers'

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  paper: {
    position: 'relative',
    backgroundColor: '#29292e',
    color: theme.palette.white,
    padding: theme.spacing(2),
    borderRadius: 12,
    overflowY: 'scroll',
    height: '500px',
    '&::-webkit-scrollbar': {
      backgroundColor: '#29292e',
      width: 10,
      borderRadius: 12,
    },
    '&::-webkit-scrollbar-track': {
      background: '#7e7e7e',
      borderRadius: 12,
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#e1e1e1',
      borderRadius: 12,
    }
  },
  download: {
    position: 'sticky',
    left: '100%',
    right: 0,
    bottom: 0
  },
  linearRoot: {
    height: 15,
    borderRadius: 10
  },
  dashed: {
    marginTop: 6,
  },
  bar: {
    borderRadius: 8,
  },
  div: {
    fontSize: 12
  },
  error: {
    backgroundColor: '#f44336'
  },
  success: {
    backgroundColor: '#689f38'
  },
  inherit: {
    backgroundColor: '#3f51b5'
  }
})

export default function ({ progress, download }) {
  const classes = useStyles()
  const [show, setShow] = useState(true)

  const toggleShow = () => {
    setShow(show => !show)
  }

  const getState = () => {
    if (progress.length > 0) {
      switch (progress[progress.length - 1].state) {
        case 'success':
          return '#689f38'
        case 'error':
          return '#f44336'
        default:
          return 'inherit'
      }
    }
  }

  const getClass = () => {
    if (progress.length > 0) {
      switch (progress[progress.length - 1].state) {
        case 'success':
          return classes.success
        case 'error':
          return classes.error
        default:
          return classes.inherit
      }
    }
  }

  return (
    <div className={classes.root}>
      <Grid container justify="flex-end">
        <Grid item>
          <FormHelperText style={{ color: getState() }}>
            {
              progress.length > 0 ?
                parseInt(progress[progress.length - 1].progress) : 0
            }%
          </FormHelperText>
        </Grid>
      </Grid>
      <LinearProgress variant="determinate" classes={{ dashed: classes.dashed, bar: classes.bar, root: classes.linearRoot, barColorPrimary: getClass() }}
        value={
          progress.length > 0 ?
            parseInt(progress[progress.length - 1].progress) : 0
        }
      />
      <Grid container justify="space-between" className="mb-3">
        <Grid item>
          <FormHelperText style={{ color: getState() }}>
            {
              progress.length > 0 ?
                progress[progress.length - 1].description : 'Starting process...'
            }
          </FormHelperText>
        </Grid>
        <Grid item>
          <FormHelperText style={{ color: getState() }}>
            <Link component="button" onClick={toggleShow}>{show ? 'show less' : 'show more'}</Link>
          </FormHelperText>
        </Grid>
      </Grid>
      {
        show ? <>
          <Paper className={classes.paper}>
            {
              progress.map((item, key) =>
                <div key={key} className={classes.div}>
                  {item.description}
                </div>
              )
            }
            {
              download ? <Link href={host+download} target="_blank" download rel="noreferrer">
                <Fab size="small" color="primary" aria-label="add" className={classes.download}>
                  <Icon className="fas fa-link text-white" fontSize="small"/>
                </Fab>
              </Link> : null
            }
          </Paper>
        </> : null
      }

    </div>

  )
}
