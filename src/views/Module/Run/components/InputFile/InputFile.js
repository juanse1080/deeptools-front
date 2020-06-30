import React, { useState, useEffect } from 'react'

import { makeStyles, Paper, Icon, Snackbar, Grid, Typography, CircularProgress } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Cancel } from '@material-ui/icons'

import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    cursor: 'pointer',
    marginBottom: theme.spacing(2)
  },
  label: {
    width: '100%',
    cursor: 'pointer',
  },
  paperContent: {
    borderWidth: 2,
    borderStyle: 'dashed',
    width: '100%',
    paddingBottom: '20%',
    paddingTop: '20%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconButton: {
    textAlign: 'center',
  },
  file: {
    padding: theme.spacing(1.3),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  deleteFile: {
    color: theme.palette.error.main,
    cursor: 'pointer',
  }
}))

export default function InputFile({ media, addMedia, deleteMedia, pattern, enterMedia, leaveMedia, many, ...others }) {
  const classes = useStyles()

  const [error, setError] = useState(false)
  const [message, setMessage] = useState(false)
  const [over, setOver] = useState(false)

  const onDragEnter = e => {
    setOver(true)
    e.preventDefault()
  }

  const onDragLeave = e => {
    setOver(false)
    e.preventDefault()
  }

  const onDragOver = e => {
    setOver(true)
    e.preventDefault()
  }

  const onDrop = e => {
    setOver(false)
    e.preventDefault()
    handleMedia(e)
  }

  const handleMedia = e => {

    let files
    if (many) {
      files = Array.from(e.target.files || e.dataTransfer.files)
    } else {
      files = Array.from(e.target.files || e.dataTransfer.files)
      files = [files[0]]
    }

    console.log(files)

    let errors = []
    files.forEach((file, index, files_) => {
      if (!file.type.match(pattern || "")) {
        files_.splice(index, 1)
        errors.push(file.name)
      }
    })

    addMedia(many, files)
    if (errors.length > 0) {
      if (many) {
        setMessage(message => `${errors.join(', ')} files do not correspond to the allowed format`)
      } else {
        setMessage(message => `${errors[0]} file does not correspond to the allowed format`)
      }
    }
  }

  const handleError = (event, reason) => {
    if (reason === "clickaway") return
    setError(false)
    setMessage('')
  }

  return <>
    <Paper className={classes.paper}>
      <label htmlFor="input" className={classes.label} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}>
        <div className={classes.paperContent} style={{ borderColor: over ? '#007bff' : '#6a6a6a', color: over ? '#007bff' : '#6a6a6a' }}>
          <Icon className={clsx(classes.iconButton, "mb-3 fas fa-file-upload")} />
          <span>
            {
              over ? <>
                <span className="font-weight-bold">Drop here </span>
              </> : <>
                  <span className="font-weight-bold">Choose a file </span>
                  <span>or drag it here</span>
                </>
            }
          </span>
        </div>
      </label>
      {
        !many && media.label > 0 ? null : <input multiple={many} type="file" id="input" accept="image/*" style={{ display: 'none' }} onChange={handleMedia} />
      }
      
    </Paper>
    <Grid container spacing={2}>
      {
        media.map((item, key) =>
          <Grid key={key} item xs={12} sm={many ? 6 : 12} md={many ? 6 : 12} lg={many ? 6 : 12} xl={many ? 4 : 12}>

            <Paper className={classes.file} onMouseEnter={enterMedia(key)} onMouseLeave={leaveMedia} onMouseOver={enterMedia(key)}>
              <Typography noWrap align="left" className="mr-2"> {item.file.name} </Typography>
              {
                item.hover ? <Cancel className={classes.deleteFile} onClick={deleteMedia(key)} /> : <CircularProgress variant="determinate" value={100} size={24} thickness={5} />
              }
            </Paper>
          </Grid>
        )
      }
    </Grid>
    <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={error} autoHideDuration={3000} onClose={handleError}>
      <Alert onClose={handleError} severity="error">
        {message}
      </Alert>
    </Snackbar>
  </>
}