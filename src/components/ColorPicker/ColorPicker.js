import React, { useState } from 'react'

import { ChromePicker } from 'react-color'

import { Tooltip, Button, FormHelperText, Popover, makeStyles } from '@material-ui/core'

import { contrast } from 'utils'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: "relative",
    borderRadius: "4px",
    backgroundColor: "#ededed",
    width: "100%",
    padding: "5px",
    margin: 0,
    display: "flex",
    maxWidth: "100%",
    flexWrap: "nowrap",
    alignItems: "center",
  },
  wrapperError: {
    position: "relative",
    borderRadius: "4px",
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
    width: "100%",
    padding: "5px",
    margin: 0,
    display: "flex",
    maxWidth: "100%",
    flexWrap: "nowrap",
    alignItems: "center",
  },
  popoverColorPicker: {
    marginTop: theme.spacing(1)
  },
  nameFile: {
    textTransform: 'uppercase',
    color: "gray",
    display: "inline",
    margin: "0 10px 0 10px",
    fontWeight: 400,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  errorText: {
    textTransform: 'uppercase',
    color: theme.palette.error.contrastText,
    display: "inline",
    margin: "0 10px 0 10px",
    fontWeight: 400,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  errorHelper: {
    color: theme.palette.error.main,
  },
}))


export default function ({ error, color, setColor, size }) {
  const classes = useStyles()

  const [anchor, setAnchor] = useState(null)

  const open = Boolean(anchor)
  const id = open ? 'simple-popover' : undefined

  // Asignar la referencia al Popover
  const handleClick = e => {
    setAnchor(e.currentTarget)
  }

  // Limpiar la referencia del Popover
  const handleClose = () => {
    setAnchor(null)
  }

  const handleColor = color => {
    setColor(color.hex)
  }

  return <>
    <div className={error ? classes.wrapperError : classes.wrapper}>
      <Tooltip title='Seleccione un color' placement='top'>
        {
          color ? <>
            <Button variant='contained' size={size} color='primary' onClick={handleClick} style={{ backgroundColor: color, color: contrast(color), minWidth: '104.5px' }}>
              Seleccione
            </Button>
          </> : <div></div>
        }

      </Tooltip>
      <p className={error ? classes.errorText : classes.nameFile}>
        {color}
      </p>
    </div>
    <FormHelperText className={classes.errorHelper} >{error}</FormHelperText>
    <Popover id={id} open={open} anchorEl={anchor} onClose={handleClose} classes={{ root: classes.popoverColorPicker }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <ChromePicker disableAlpha color={color} onChange={handleColor} />
    </Popover>
  </>
}