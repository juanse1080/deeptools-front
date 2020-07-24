import React from 'react'

import { Grid, TextField } from '@material-ui/core'

export default function ShowModelDetail({ value }) {
  return <>
    <Grid container>
      <Grid className="p-2" item sm={12} xs={12}>
        <TextField label="Name" variant="outlined" fullWidth defaultValue={value.name} size="small" name="name" disabled />
      </Grid>
      <Grid className="p-2" item sm={12} xs={12}>
        <TextField multiline rows={4} label="Description" variant="outlined" fullWidth defaultValue={value.description} size="small" name="description" disabled />
      </Grid>
      <Grid className="p-2" item sm={6} xs={12}>
        <TextField label="Image" variant="outlined" fullWidth defaultValue={value.image} size="small" name="image" disabled />
      </Grid>
      <Grid className="p-2" item sm={6} xs={12}>
        <TextField label="Path" variant="outlined" fullWidth value={value.workdir} size="small" name="workdir" disabled />
      </Grid>
      <Grid className="p-2" item sm={6} xs={12}>
        <TextField label="Filename" variant="outlined" fullWidth value={value.file} size="small" name="file" disabled />
      </Grid>
      <Grid className="p-2" item sm={6} xs={12}>
        <TextField label="Classname" variant="outlined" fullWidth value={value.classname} size="small" name="classname" disabled />
      </Grid>
    </Grid>
  </>
}