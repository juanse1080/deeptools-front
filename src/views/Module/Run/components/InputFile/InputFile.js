import React, { useState, useEffect } from 'react'

import { makeStyles, Paper, Icon, Snackbar, Grid, Typography, CircularProgress, Tooltip, Box } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Cancel, Delete } from '@material-ui/icons'

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
    borderWidth: 1,
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
  },
  progressIcon: {
    height: 24,
    width: 24,
  }
}))

export default function InputFile({ media, init, addMedia, deleteMedia, cancelUpload, pattern, enterMedia, leaveMedia, ...others }) {
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
    let files = Array.from(e.target.files || e.dataTransfer.files)
    console.log(files[0].type)
    if (pattern) {
      let errors = []
      files = files.filter(file => {
        if (!file.type.match(pattern || "")) {
          errors.push(file.name)
          return false
        } else {
          return true
        }
      })

      if (errors.length > 0) {
        setMessage(message => `${errors.join(', ')} files do not correspond to the allowed format`)
        setError(true)
      }
    }
    addMedia(files)
  }

  const handleError = (event, reason) => {
    if (reason === "clickaway") return
    setError(false)
    setMessage('')
  }

  return <>
    {
      init ? <Box className="p-2" variant="h3">
        <Typography>To activate your algorithm you must provide a base dataset for simple tests.</Typography>
      </Box> : null
    }
    <Paper className={classes.paper} variant="outlined" >
      <label htmlFor="input" className={classes.label} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}>
        <div className={classes.paperContent} style={{ borderColor: over ? '#007bff' : '#6a6a6a', color: over ? '#007bff' : '#6a6a6a' }}>
          <Icon className={clsx(classes.iconButton, "mb-3 fal fa-file-upload")} />
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
        <input multiple type="file" id="input" accept="image/*,video/*" style={{ display: 'none' }} onChange={handleMedia} />
      }

    </Paper>
    <Grid container spacing={2}>
      {
        media.map((item, key, media_array) =>
          <Grid key={key} item xs={12} sm={6} md={6} lg={4} xl={3}>
            <Paper  variant="outlined" className={classes.file} onMouseEnter={enterMedia(key)} onMouseLeave={leaveMedia} onMouseOver={enterMedia(key)}>
              <Tooltip title={item.name}>
                <Typography noWrap align="left" className="mr-2"> {item.name} </Typography>
              </Tooltip>
              <div className={classes.progressIcon}>
                {
                  item.hover ?
                    <Tooltip title={item.uploaded ? "Delete" : "Cancel"}>
                      {
                        item.uploaded ? item.deleting ? <CircularProgress variant="indeterminate" value={item.progress} size={24} /> : <Icon fontSize="small" onClick={deleteMedia(key)} className={clsx(classes.deleteFile, "fal fa-trash-alt text-danger")} /> : <Cancel className={classes.deleteFile} onClick={cancelUpload(key)} />
                      }
                    </Tooltip> : item.uploaded ? null : <CircularProgress variant="determinate" value={item.progress} size={24} />
                }
              </div>
            </Paper>
          </Grid>
        )
      }
    </Grid>
    <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={error} autoHideDuration={3000} onClose={handleError}>
      <Alert onClose={handleError} severity="error" variant="outlined">
        {message}
      </Alert>
    </Snackbar>
  </>
}