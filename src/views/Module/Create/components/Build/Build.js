import React, { useState } from "react"
import { makeStyles, withStyles, LinearProgress, Grid, Link, FormHelperText, Paper } from "@material-ui/core"
import theme from "theme"

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  paper: {
    backgroundColor: '#29292e',
    color: theme.palette.white,
    padding: theme.spacing(2),
    borderRadius: 12
  },
  div: {
    fontSize: 12
  }
})

const BorderLinearProgress = withStyles(theme => ({
  root: {
    height: 15,
    borderRadius: 10
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700]
  },
  dashed: {
    marginTop: 6,
  },
  bar: {
    borderRadius: 8,
  }
}))(LinearProgress)

export default function ({ progress }) {
  const classes = useStyles()
  const [show, setShow] = useState(true)

  const toggleShow = () => {
    setShow(show => !show)
  }

  return (
    <div className={classes.root}>
      <Grid container justify="flex-end">
        <Grid item>
          <FormHelperText>
            {
              progress.length > 0 ?
                progress[progress.length - 1].state : 0
            }%
          </FormHelperText>
        </Grid>
      </Grid>
      <BorderLinearProgress variant="buffer"
        value={
          progress.length > 0 ?
            progress[progress.length - 1].state : 0
        }
        valueBuffer={
          progress.length > 0 ?
            progress[progress.length - 1].state : 0
        }
      />
      <Grid container justify="space-between" className="mb-3">
        <Grid item>
          <FormHelperText>
            {
              progress.length > 0 ?
                progress[progress.length - 1].description : 'Starting process...'
            }
          </FormHelperText>
        </Grid>
        <Grid item>
          <FormHelperText>
            <Link component="button" onClick={toggleShow}>show more</Link>
          </FormHelperText>
        </Grid>
      </Grid>
      {
        show ? <>
          <Paper className={classes.paper}>
            {
              progress.map(item =>
                <div key={item} className={classes.div}>
                  {item.description}
                </div>
              )
            }
          </Paper>
        </> : null
      }

    </div>

  )
}
