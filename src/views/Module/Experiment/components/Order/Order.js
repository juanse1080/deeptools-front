import { Grid } from '@material-ui/core';
import React from 'react';
import Media from '../Media';
import ShowResponse from '../ShowResponse';

export default function({ value, types, ...others }) {
  return (
    <div {...others}>
      <Grid container spacing={2} className="mt-3">
        <Grid item lg={3} md={12} sm={12} xs={12}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={6} sm={6} xs={12}>
              <Media type={types.input.value} values={value.input} />
            </Grid>
            <Grid item lg={12} md={6} sm={6} xs={12}>
              <Media type={types.output.value} values={value.output} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={9} md={12} sm={12}>
          <ShowResponse value={value.response[0]} />
        </Grid>
      </Grid>
    </div>
  );
}
