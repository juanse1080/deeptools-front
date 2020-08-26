import React, { useState, useEffect } from 'react'

import { TextField, Grid, Paper, makeStyles, FormControl, InputLabel, Select, MenuItem, Typography, FormHelperText } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

import { InputFile } from 'components'

import axios from 'axios'

import { host, authHeaderJSON } from 'helpers'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: 0,
      boxShadow: 'none',
      backgroundColor: 'transparent'
    },
  },
  error: {
    color: theme.palette.error.light
  }
}))

export default function ({ value, change, errors, input, ...others }) {
  const classes = useStyles()
  const [images, setImages] = useState([])
  const [extensions, setExtensions] = useState('default')

  const getImages = () => {
    axios.get(`${host}/module/images`, authHeaderJSON()).then(
      function (res) {
        setImages(res.data)
      }
    ).catch(
      function (err) {
        console.error(err)
      }
    )
  }

  const setValue = e => {
    change(e.target.name, e.target.value)
  }

  const handleType = () => {
    setExtensions(extensions => extensions === 'default' ? 'custom' : 'default')
  }

  const setPath = e => {
    const value = e.target.value.replace('\\', '/')
    const name = e.target.name
    change(name, value)
  }

  const setImage = (_, value) => {
    change('image', value.name)
  }

  const hasError = field => errors[field] ? true : false

  useEffect(() => {
    getImages()
  }, [])

  return <>
    <Grid container>
      <Grid className="p-2" item sm={12} xs={12}>
        <Typography variant="subtitle1" align="justify" component="p" className="mb-3">
          Help us with some necessary information to be able to communicate with your container.
        </Typography>
      </Grid>
      <Grid className="p-2" item sm={6} xs={12}>
        <Autocomplete fullWidth size="small"
          options={images}
          groupBy={(option) => option.label}
          onChange={setImage}
          getOptionLabel={(option) => option.name}
          renderInput={
            (params) => <TextField {...params} label="Images" variant="outlined" error={hasError('image')}
              helperText={
                hasError('image') ? errors.image[0] : 'Images dockers'
              } />
          }
        />
      </Grid>
      <Grid className="p-2" item sm={6} xs={12}>
        <TextField label="Path" variant="outlined" fullWidth value={value.workdir} size="small" name="workdir" onChange={setPath} error={hasError('workdir')} helperText={hasError('workdir') ? errors.workdir[0] : 'Path to workdir'} />
      </Grid>
      <Grid className="p-2" item sm={6} xs={12}>
        <TextField label="Filename" variant="outlined" fullWidth value={value.file} size="small" name="file" onChange={setValue} error={hasError('file')} helperText={hasError('file') ? errors.file[0] : 'how is the file is named?'} />
      </Grid>
      <Grid className="p-2" item sm={6} xs={12}>
        <TextField label="Classname" variant="outlined" fullWidth value={value.classname} size="small" name="classname" onChange={setValue} error={hasError('classname')} helperText={hasError('classname') ? errors.classname[0] : 'how is the class named?'} />
      </Grid>
      <Grid className="p-2" item sm={6} xs={12}>
        <Grid container spacing={3}>
          <Grid item sm={extensions === 'default' ? 12 : 6} xs={12}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="demo-simple-select-label">Extensions</InputLabel>
              <Select name="type" label="Extensions" labelId="demo-simple-select-label" id="demo-simple-select" value={extensions} onChange={handleType}>
                <MenuItem value="default">{input.value === "video" ? "Video extensions" : "Image extensions"}</MenuItem>
                <MenuItem value="custom">Custom extensions</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {
            extensions === 'default' ? null : <Grid item sm={extensions === 'default' ? 12 : 6} xs={12}>
              <TextField label="Extensions" placeholder="mp4 avi web" variant="outlined" fullWidth value={value.extensions} size="small" name="extensions" onChange={setValue} error={hasError('extensions')} helperText={hasError('extensions') ? errors.extensions[0] : 'Allowed extensions separated by spaces'} />
            </Grid>
          }
        </Grid>

        {/* <TextField label="Extensions" placeholder="mp4 avi web" variant="outlined" fullWidth value={value.extensions} size="small" name="extensions" onChange={setValue} error={hasError('extensions')} helperText={hasError('extensions') ? errors.extensions[0] : 'Allowed extensions separated by spaces'} /> */}
      </Grid>
      <Grid className="p-2" item sm={6} xs={12}>
        <InputFile onChange={change} id="background" titleTooltip="Select an image that represents your algorithm" accept="image/*" error={hasError('background') ? errors.background[0] : null} name="background" />
      </Grid>
      <Grid className="p-2" item sm={12} xs={12}>
        <TextField label="Name" variant="outlined" fullWidth defaultValue={value.name} size="small" name="name" onBlur={setValue} error={hasError('name')} helperText={hasError('name') ? errors.name[0] : null} />
      </Grid>
      <Grid className="p-2" item sm={12} xs={12}>
        <TextField multiline rows={4} label="Description" variant="outlined" fullWidth defaultValue={value.description} size="small" name="description" onBlur={setValue} error={hasError('description')} helperText={hasError('description') ? errors.description[0] : null} />
      </Grid>

    </Grid>
  </>
}