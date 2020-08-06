import React from 'react'

import { Grid, TextField } from '@material-ui/core'

export default function ShowModelDetail({ value }) {
  return <>
    <Grid container>
      {/* <Grid className="p-2" item sm={12} xs={12}>
        <TextField label="Name" fullWidth defaultValue={value.name} size="small" name="name" inputProps={{ readOnly: true }} />
      </Grid> */}
      {/* <Grid className="p-2" item sm={12} xs={12}>
        <TextField multiline rows={4} label="Description" fullWidth defaultValue={value.description} size="small" name="description" inputProps={{ readOnly: true }} />
      </Grid> */}
      <Grid className="p-2" item sm={6} xs={12}>
        <TextField label="Image" fullWidth variant="outlined" defaultValue={value.image} size="small" name="image" inputProps={{ readOnly: true }} />
      </Grid>
      <Grid className="p-2" item sm={6} xs={12}>
        <TextField label="Path" fullWidth variant="outlined" value={value.workdir} size="small" name="workdir" inputProps={{ readOnly: true }} />
      </Grid>
      <Grid className="p-2" item sm={6} xs={12}>
        <TextField label="Filename" fullWidth variant="outlined" value={value.file} size="small" name="file" inputProps={{ readOnly: true }} />
      </Grid>
      <Grid className="p-2" item sm={6} xs={12}>
        <TextField label="Classname" fullWidth variant="outlined" value={value.classname} size="small" name="classname" inputProps={{ readOnly: true }} />
      </Grid>
    </Grid>
  </>
}