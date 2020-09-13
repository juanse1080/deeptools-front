import { Grid, useMediaQuery } from '@material-ui/core';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import Media from '../Media';
import ShowResponse from '../ShowResponse';

export default function({ value, types, ...others }) {
  const md = useMediaQuery(theme => theme.breakpoints.down('md'));
  const lg = useMediaQuery(theme => theme.breakpoints.up('lg'));

  return (
    <div {...others}>
      <Grid container spacing={2} className="mt-3">
        <Grid item lg={7} md={12} sm={12} xs={12}>
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <Media type={types.input.value} values={value.input} />
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <Media type={types.output.value} values={value.output} />
            </Grid>
            {md ? (
              <Grid item lg={5} md={6} sm={12} xs={12}>
                {value.graph.map((graph, key) => (
                  <HighchartsReact
                    key={key}
                    highcharts={Highcharts}
                    options={JSON.parse(graph)}
                    updateArgs={[true, true, true]}
                  />
                ))}
              </Grid>
            ) : null}
            <Grid item lg={12} md={6} sm={12} xs={12}>
              <ShowResponse value={value.response[0]} />
            </Grid>
          </Grid>
        </Grid>
        {lg ? (
          <Grid item lg={5} md={6}>
            {value.graph.map((graph, key) => (
              <HighchartsReact
                key={key}
                highcharts={Highcharts}
                options={JSON.parse(graph)}
                updateArgs={[true, true, true]}
              />
            ))}
          </Grid>
        ) : null}
      </Grid>
    </div>
  );
}
